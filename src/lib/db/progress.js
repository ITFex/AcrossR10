import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export const TOTAL_CROSSINGS = 10;

/**
 * Ewige Bestenliste – server-seitige Fortschritts-Datenbank.
 *
 * Nutzt die eingebaute node:sqlite (Node >= 22.5). Der DB-Pfad kommt aus
 * der Env-Var DB_PATH; in Docker ist /data als Volume gebunden, damit die
 * Daten über Container-Neubuilds hinweg erhalten bleiben.
 */
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'progress.db');
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
	PRAGMA journal_mode = WAL;

	CREATE TABLE IF NOT EXISTS riders (
		subject_id TEXT PRIMARY KEY,
		name       TEXT NOT NULL,
		email      TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS crossings (
		rider_subject_id TEXT NOT NULL REFERENCES riders(subject_id) ON DELETE CASCADE,
		position         INTEGER NOT NULL CHECK (position BETWEEN 1 AND ${TOTAL_CROSSINGS}),
		completed_at     TEXT NOT NULL DEFAULT (datetime('now')),
		PRIMARY KEY (rider_subject_id, position)
	);
`);

/** @typedef {{ subjectId: string, name: string, email: string, done: number, lastCompletedAt: string | null, completedAllAt: string | null }} RiderRow */

const upsertRider = db.prepare(`
	INSERT INTO riders (subject_id, name, email) VALUES (?, ?, ?)
	ON CONFLICT (subject_id) DO UPDATE SET
		name = excluded.name,
		email = excluded.email
`);

const deleteCrossing = db.prepare(
	'DELETE FROM crossings WHERE rider_subject_id = ? AND position = ?'
);
const insertCrossing = db.prepare(
	'INSERT OR IGNORE INTO crossings (rider_subject_id, position) VALUES (?, ?)'
);

/** @type {import('node:sqlite').StatementSync} */
const riderStateQuery = db.prepare(`
	SELECT c.position AS position, c.completed_at AS completedAt
	FROM crossings c
	WHERE c.rider_subject_id = ?
	ORDER BY c.position ASC
`);

/** @type {import('node:sqlite').StatementSync} */
const leaderboardQuery = db.prepare(`
	SELECT
		r.subject_id AS subjectId,
		r.name       AS name,
		r.email      AS email,
		COUNT(c.position)                    AS done,
		MAX(c.completed_at)                  AS lastCompletedAt,
		MIN(CASE WHEN c.position = ${TOTAL_CROSSINGS} THEN c.completed_at END) AS completedAllAt
	FROM riders r
	LEFT JOIN crossings c ON c.rider_subject_id = r.subject_id
	GROUP BY r.subject_id, r.name, r.email
	ORDER BY
		done DESC,
		completedAllAt IS NULL,
		completedAllAt ASC,
		MIN(c.completed_at) IS NULL,
		MIN(c.completed_at) ASC,
		name COLLATE NOCASE ASC
	LIMIT 1000
`);

/** @param {{ id: string, name?: string | null, email?: string | null }} user */
export function syncRider(user) {
	upsertRider.run(user.id, user.name || user.email || 'Unbekannt', user.email || user.id);
}

/**
 * Meldet eine Querung an (done=true) oder zurück (done=false).
 * @param {string} subjectId
 * @param {number} position 1-based Position 1..10
 * @param {boolean} done
 */
export function setCrossing(subjectId, position, done) {
	const pos = Number(position);
	if (!Number.isInteger(pos) || pos < 1 || pos > TOTAL_CROSSINGS) {
		throw new RangeError('Ungültige Querungsnummer');
	}
	syncRider({ id: subjectId, name: '', email: '' });
	if (done) insertCrossing.run(subjectId, pos);
	else deleteCrossing.run(subjectId, pos);
}

/**
 * @param {string} subjectId
 * @returns {boolean[]} erledigte Positionen (Index 0 = Querung 1)
 */
export function getCrossings(subjectId) {
	const rows = /** @type {{ position: number }[]} */ (riderStateQuery.all(subjectId));
	const state = Array(TOTAL_CROSSINGS).fill(false);
	for (const row of rows) state[row.position - 1] = true;
	return state;
}

/** @returns {RiderRow[]} ewige Bestenliste (alle Zeit, max. 1000) */
export function getLeaderboard() {
	return /** @type {RiderRow[]} */ (leaderboardQuery.all());
}
