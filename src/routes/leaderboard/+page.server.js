import { getLeaderboard } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const entries = getLeaderboard();
	return { entries };
};
