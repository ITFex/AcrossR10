/**
 * Gemeinsame Single-Source für die 10 AcrossR10-Checkpoints (Geofence, 100 m).
 * Client-safe: nur Daten – darf in App + Build importiert werden.
 * Kanonische DE-Namen = Basis für DB-Seed (db/progress.js) + Karte.
 * Lokalisierte Anzeige: i18n-Liste members.geofence.checkpoints (Index = position - 1).
 */

/** @typedef {{ position: number, name: string, lat: number, lon: number, radius_m: number }} Checkpoint */

/** @type {Checkpoint[]} */
export const CHECKPOINTS = [
	{ position: 1, name: 'Hörschel (Start)', lat: 51.006922, lon: 10.228308, radius_m: 100 },
	{ position: 2, name: 'Neuenhof / Eisenach', lat: 50.99701, lon: 10.214077, radius_m: 100 },
	{ position: 3, name: 'St. Elisabeth / Eisenach', lat: 50.976117, lon: 10.320483, radius_m: 100 },
	{ position: 4, name: 'Hohe Sonne', lat: 50.932015, lon: 10.31897, radius_m: 100 },
	{ position: 5, name: 'Gerstungen', lat: 50.921473, lon: 10.306867, radius_m: 100 },
	{ position: 6, name: 'Ruhla', lat: 50.890611, lon: 10.354525, radius_m: 100 },
	{ position: 7, name: 'Friedrichroda', lat: 50.831053, lon: 10.554117, radius_m: 100 },
	{ position: 8, name: 'Schnellbach', lat: 50.774293, lon: 10.559983, radius_m: 100 },
	{ position: 9, name: 'Zellaer Forst / Oberhof', lat: 50.699302, lon: 10.710864, radius_m: 100 },
	{ position: 10, name: 'Oberhof Ziel (Rondell)', lat: 50.69422, lon: 10.720421, radius_m: 100 },
];
