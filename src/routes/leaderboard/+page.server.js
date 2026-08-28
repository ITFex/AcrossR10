import { getLeaderboard } from '$lib/db/progress.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const { session } = /** @type {{ session: import('@auth/core/types').Session | null }} */ (
		await parent()
	);
	return {
		session,
		leaderboard: getLeaderboard(),
	};
};
