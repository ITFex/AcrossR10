import { redirect } from '@sveltejs/kit';
import { getParticipant } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) {
		throw redirect(303, '/');
	}
	const userId = session.user.email ?? session.user.id;
	const row = getParticipant(userId);
	const profile = row
		? { gender: row.gender, birthYear: row.birth_year, isPublic: row.public === 1 }
		: null;
	return { session, profile };
};
