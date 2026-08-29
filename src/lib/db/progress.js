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

// ── Migration: Tour-Planung (planned_date / plan_direction) ──────────────
const riderColumns = new Set(
	/** @type {{name: string}[]} */ (db.prepare('PRAGMA table_info(riders)').all()).map(
		(row) => row.name
	)
);
for (const column of ['planned_date', 'plan_direction']) {
	if (!riderColumns.has(column)) {
		db.exec(`ALTER TABLE riders ADD COLUMN ${column} TEXT`);
	}
}

/** @typedef {{ subjectId: string, name: string, email: string, done: number, lastCompletedAt: string | null, completedAllAt: string | null, plannedDate: string | null, planDirection: string | null }} RiderRow */

/** @typedef {{ date: string, riders: { name: string, done: number, direction: string | null }[] }} UpcomingDay */

const PLAN_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAN_DIRECTIONS = new Set(['forward', 'return']);

const upsertRider = db.prepare(`
	INSERT INTO riders (subject_id, name, email) VALUES (?, ?, ?)
	ON CONFLICT (subject_id) DO UPDATE SET
		name  = CASE WHEN excluded.name  = '' THEN riders.name  ELSE excluded.name  END,
		email = CASE WHEN excluded.email = '' THEN riders.email ELSE excluded.email END
`);

const ensureRider = db.prepare(`
	INSERT INTO riders (subject_id, name, email) VALUES (?, 'Unbekannt', '')
	ON CONFLICT (subject_id) DO NOTHING
`);

const deleteCrossing = db.prepare(
	'DELETE FROM crossings WHERE rider_subject_id = ? AND position = ?'
);
const insertCrossing = db.prepare(
	'INSERT OR IGNORE INTO crossings (rider_subject_id, position) VALUES (?, ?)'
);

const setPlanStmt = db.prepare(
	'UPDATE riders SET planned_date = ?, plan_direction = ? WHERE subject_id = ?'
);

/** @type {import('node:sqlite').StatementSync} */
const riderStateQuery = db.prepare(`
	SELECT c.position AS position, c.completed_at AS completedAt
	FROM crossings c
	WHERE c.rider_subject_id = ?
	ORDER BY c.position ASC
`);

/** @type {import('node:sqlite').StatementSync} */
const riderPlanQuery = db.prepare(`
	SELECT planned_date AS plannedDate, plan_direction AS planDirection
	FROM riders
	WHERE subject_id = ?
`);

/** @type {import('node:sqlite').StatementSync} */
const leaderboardQuery = db.prepare(`
	SELECT
		r.subject_id AS subjectId,
		r.name       AS name,
		r.email      AS email,
		r.planned_date AS plannedDate,
		r.plan_direction AS planDirection,
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

/**
 * Alltagsformat YYYY-MM-DD im Server-Zeitzonen-Kontext (Container läuft UTC,
 * Website ist Deutschland). Heute = CEST/CEST-Umrechnung.
 * @returns {string}
 */
function todayStr() {
	// UTC+2 im Sommer (CEST), UTC+1 im Winter (CET) – für eine Challenge,
	// die Mai–Oktober gefahren wird, ist +2 korrekt. Einfach und stabil:
	return new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString().slice(0, 10);
}

/** @param {{ id?: string, name?: string | null, email?: string | null }} user */
export function syncRider(user) {
	if (!user?.id) return; // ohne stable ID nicht persistieren (verhindert 500er)
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
	ensureRider.run(subjectId);
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

/**
 * @param {string} subjectId
 * @returns {{ date: string | null, direction: 'forward' | 'return' | null }}
 */
export function getPlan(subjectId) {
	const row =
		/** @type {{ plannedDate: string | null, planDirection: string | null }} */ (
			riderPlanQuery.get(subjectId)
		);
	if (!row || !row.plannedDate) return { date: null, direction: null };
	const direction = PLAN_DIRECTIONS.has(row.planDirection ?? '')
		? /** @type {'forward' | 'return'} */ (row.planDirection)
		: 'forward';
	return { date: row.plannedDate, direction };
}

/**
 * Setzt (oder löscht bei leerem Datum) die geplante Tour.
 * @param {string} subjectId
 * @param {string | '' | null} date  YYYY-MM-DD oder leer zum Löschen
 * @param {'forward' | 'return' | null} direction
 */
export function setPlan(subjectId, date, direction) {
	ensureRider.run(subjectId);
	const cleanDate =
		typeof date === 'string' && PLAN_DATE_RE.test(date) ? date : null;
	const cleanDirection = PLAN_DIRECTIONS.has(direction ?? '') ? direction : null;
	setPlanStmt.run(cleanDate, cleanDirection, subjectId);
}

/** @returns {RiderRow[]} ewige Bestenliste (alle Zeit, max. 1000) */
export function getLeaderboard() {
	return /** @type {RiderRow[]} */ (leaderboardQuery.all());
}

/**
 * Heute geplante Touren (für den Mitgliederbereich: „Wie viele fahren heute?").
 * @returns {{ name: string, done: number, direction: 'forward' | 'return' }[]}
 */
export function getPlansForToday() {
	const today = todayStr();
	return /** @type {any[]} */ (
		db
			.prepare(`
				SELECT r.name AS name, r.plan_direction AS direction,
				       COUNT(c.position) AS done
				FROM riders r
				LEFT JOIN crossings c ON c.rider_subject_id = r.subject_id
				WHERE r.planned_date = ?
				GROUP BY r.subject_id
				ORDER BY r.name COLLATE NOCASE ASC
			`)
			.all(today)
	).map((row) => ({
		name: row.name,
		done: row.done,
		direction: PLAN_DIRECTIONS.has(row.direction ?? '')
			? /** @type {'forward' | 'return'} */ (row.direction)
			: 'forward',
	}));
}

/**
 * Die nächsten `days` Tage (inkl. heute) mit allen geplanten Touren.
 * @param {number} days Anzahl Tage ab heute
 * @returns {UpcomingDay[]}
 */
export function getUpcomingPlans(days = 7) {
	const base = Date.parse(todayStr() + 'T00:00:00Z');
	if (Number.isNaN(base)) return [];
	const rows =
		/** @type {{ plannedDate: string, name: string, direction: string | null, done: number }[]} */ (
			db
				.prepare(`
				SELECT r.planned_date AS plannedDate,
				       r.name AS name,
				       r.plan_direction AS direction,
				       COUNT(c.position) AS done
				FROM riders r
				LEFT JOIN crossings c ON c.rider_subject_id = r.subject_id
				WHERE r.planned_date IS NOT NULL
				GROUP BY r.subject_id
				ORDER BY r.planned_date ASC
			`)
				.all()
		);

	/** @type {Map<string, UpcomingDay>} */
	const byDate = new Map();
	for (const row of rows) {
		const day =
			/** @type {UpcomingDay} */ (byDate.get(row.plannedDate)) ?? {
				date: row.plannedDate,
				riders: [],
			};
		day.riders.push({
			name: row.name,
			done: row.done,
			direction: PLAN_DIRECTIONS.has(row.direction ?? '')
				? /** @type {'forward' | 'return'} */ (row.direction)
				: 'forward',
		});
		byDate.set(row.plannedDate, day);
	}

	/** @type {UpcomingDay[]} */
	const result = [];
	for (let i = 0; i < days; i++) {
		const date = new Date(base + i * 86400000).toISOString().slice(0, 10);
		const day = byDate.get(date);
		if (day) {
			day.riders.sort((a, b) => a.name.localeCompare(b.name, 'de'));
			result.push(day);
		}
	}
	return result;
}

// ═════════════════════════════════════════════════════════════════════════
// GEOFENCING – 10 Checkpoints, 100 m Radius
// ═════════════════════════════════════════════════════════════════════════

/** @type {{ position: number, name: string, lat: number, lon: number, radius_m: number }[]} */
const GEOFENCE_POINTS = [
	{ position: 1, name: 'Hörschel (Start)', lat: 51.006922, lon: 10.228308, radius_m: 100 },
	{ position: 2, name: 'Neuenhof / Eisenach', lat: 50.997010, lon: 10.214077, radius_m: 100 },
	{ position: 3, name: 'St. Elisabeth / Eisenach', lat: 50.976117, lon: 10.320483, radius_m: 100 },
	{ position: 4, name: 'Hohe Sonne', lat: 50.932015, lon: 10.318970, radius_m: 100 },
	{ position: 5, name: 'Gerstungen', lat: 50.921473, lon: 10.306867, radius_m: 100 },
	{ position: 6, name: 'Ruhla', lat: 50.890611, lon: 10.354525, radius_m: 100 },
	{ position: 7, name: 'Friedrichroda', lat: 50.831053, lon: 10.554117, radius_m: 100 },
	{ position: 8, name: 'Schnellbach', lat: 50.774293, lon: 10.559983, radius_m: 100 },
	{ position: 9, name: 'Zellaer Forst / Oberhof', lat: 50.699302, lon: 10.710864, radius_m: 100 },
	{ position: 10, name: 'Oberhof Ziel (Rondell)', lat: 50.694220, lon: 10.720421, radius_m: 100 },
];

// Migration: crossing_points + crossing_validations Tabellen
db.exec(`
	CREATE TABLE IF NOT EXISTS crossing_points (
		position    INTEGER PRIMARY KEY CHECK (position BETWEEN 1 AND ${TOTAL_CROSSINGS}),
		name        TEXT NOT NULL,
		lat         REAL NOT NULL,
		lon         REAL NOT NULL,
		radius_m    INTEGER NOT NULL DEFAULT 100
	);

	CREATE TABLE IF NOT EXISTS crossing_validations (
		rider_subject_id TEXT NOT NULL REFERENCES riders(subject_id) ON DELETE CASCADE,
		position         INTEGER NOT NULL CHECK (position BETWEEN 1 AND ${TOTAL_CROSSINGS}),
		validated_at     TEXT NOT NULL DEFAULT (datetime('now')),
		lat              REAL NOT NULL,
		lon              REAL NOT NULL,
		distance_m       REAL NOT NULL,
		PRIMARY KEY (rider_subject_id, position)
	);
`);

// Seeding der 10 Checkpoints (einmalig beim Start)
const seedPoint = db.prepare(`
	INSERT OR IGNORE INTO crossing_points (position, name, lat, lon, radius_m)
	VALUES (?, ?, ?, ?, ?)
`);
for (const p of GEOFENCE_POINTS) {
	seedPoint.run(p.position, p.name, p.lat, p.lon, p.radius_m);
}

/**
 * Haversine-Distanz in Metern zwischen zwei Lat/Lon-Punkten.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distanz in Metern
 */
function haversineM(lat1, lon1, lat2, lon2) {
	const R = 6371000; // Erdradius in m
	const φ1 = lat1 * Math.PI / 180;
	const φ2 = lat2 * Math.PI / 180;
	const Δφ = (lat2 - lat1) * Math.PI / 180;
	const Δλ = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Prüft (nur lesend), ob eine User-Position im Radius des Checkpoints liegt.
 * @param {string} subjectId
 * @param {number} position 1..10
 * @param {number} userLat
 * @param {number} userLon
 * @returns {{ allowed: boolean, distance_m: number | null, point: {name: string, lat: number, lon: number, radius_m: number} | null, error?: string }}
 */
export function checkCrossingGeofence(subjectId, position, userLat, userLon) {
	const pos = Number(position);
	if (!Number.isInteger(pos) || pos < 1 || pos > TOTAL_CROSSINGS) {
		return { allowed: false, distance_m: null, point: null, error: 'invalid_position' };
	}
	const point = db.prepare('SELECT * FROM crossing_points WHERE position = ?').get(pos);
	if (!point) return { allowed: false, distance_m: null, point: null, error: 'invalid_position' };

	const dist = haversineM(userLat, userLon, point.lat, point.lon);
	return {
		allowed: dist <= point.radius_m,
		distance_m: Math.round(dist),
		point: { name: point.name, lat: point.lat, lon: point.lon, radius_m: point.radius_m },
	};
}

/**
 * Protokoliert die Geofence-Validierung und trägt die Crossing ein.
 * Wirft RangeError, wenn die Position außerhalb des Radius liegt.
 * @param {string} subjectId
 * @param {number} position 1..10
 * @param {number} userLat
 * @param {number} userLon
 * @returns {{ allowed: boolean, distance_m: number, point: {name: string, lat: number, lon: number, radius_m: number} }}
 */
export function recordValidatedCrossing(subjectId, position, userLat, userLon) {
	const check = checkCrossingGeofence(subjectId, position, userLat, userLon);
	if (!check.allowed) {
		throw new RangeError(`Außerhalb des Checkpoint-Radius (${check.distance_m} m)`);
	}
	ensureRider.run(subjectId);
	db.prepare(`
		INSERT OR IGNORE INTO crossing_validations
			(rider_subject_id, position, lat, lon, distance_m)
		VALUES (?, ?, ?, ?, ?)
	`).run(subjectId, position, userLat, userLon, check.distance_m);
	insertCrossing.run(subjectId, position);
	return check;
}

/**
 * Liefert alle Checkpoint-Definitionen für Client-seitige Anzeige (Karte, Liste).
 * @returns {{position: number, name: string, lat: number, lon: number, radius_m: number}[]}
 */
export function getCrossingPoints() {
	return GEOFENCE_POINTS.map(p => ({ ...p }));
}
