import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const DB_PATH = env.DATA_PATH
	? path.join(env.DATA_PATH, 'acrossr10.db')
	: path.join(process.cwd(), 'data', 'acrossr10.db');

let _db = null;

function initDb() {
	if (_db) return _db;
	const dir = path.dirname(DB_PATH);
	try {
		mkdirSync(dir, { recursive: true });
	} catch {}
	_db = new Database(DB_PATH);
	_db.pragma('journal_mode = WAL');
	_db.exec(`
		CREATE TABLE IF NOT EXISTS participants (
			user_id      TEXT PRIMARY KEY,
			user_name    TEXT NOT NULL,
			gender       TEXT NOT NULL CHECK(gender IN ('M', 'W', 'D')),
			birth_year   INTEGER NOT NULL,
			crossings    INTEGER NOT NULL DEFAULT 0,
			public       INTEGER NOT NULL DEFAULT 1,
			completed_at TEXT,
			updated_at   TEXT NOT NULL
		)
	`);
	return _db;
}

export function db() {
	return initDb();
}

/** @param {string} userId */
export function getParticipant(userId) {
	return db().prepare('SELECT * FROM participants WHERE user_id = ?').get(userId);
}

/**
 * @param {{ userId: string, userName: string, gender: string, birthYear: number, crossings: number, isPublic: boolean }} opts
 */
export function upsertParticipant({ userId, userName, gender, birthYear, crossings, isPublic }) {
	const now = new Date().toISOString();
	const existing = getParticipant(userId);
	const wasCompleted = existing?.completed_at ?? null;
	const completedAt = crossings >= 10 ? (wasCompleted ?? now) : null;

	db()
		.prepare(
			`INSERT INTO participants (user_id, user_name, gender, birth_year, crossings, public, completed_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(user_id) DO UPDATE SET
			   user_name    = excluded.user_name,
			   gender       = excluded.gender,
			   birth_year   = excluded.birth_year,
			   crossings    = excluded.crossings,
			   public       = excluded.public,
			   completed_at = excluded.completed_at,
			   updated_at   = excluded.updated_at`
		)
		.run(userId, userName, gender, birthYear, crossings, isPublic ? 1 : 0, completedAt, now);
}

/**
 * Returns all participants who have completed 10 crossings and opted in to public listing.
 * @returns {Array<{user_id: string, user_name: string, gender: string, birth_year: number, crossings: number, completed_at: string}>}
 */
export function getLeaderboard() {
	return db()
		.prepare(
			`SELECT user_id, user_name, gender, birth_year, crossings, completed_at
			 FROM participants
			 WHERE crossings >= 10 AND public = 1
			 ORDER BY completed_at ASC`
		)
		.all();
}
