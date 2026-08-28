import { getLeaderboard } from '$lib/db/progress.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	// Top-3-Vorschau für den Bestenliste-Teaser auf der Startseite
	return {
		leaderboardTop: getLeaderboard().slice(0, 3),
	};
};
