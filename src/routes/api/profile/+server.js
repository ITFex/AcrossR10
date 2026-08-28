import { json, error } from '@sveltejs/kit';
import { getParticipant, upsertParticipant } from '$lib/server/db.js';

const TOTAL_CROSSINGS = 10;

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	const session = await locals.auth();
	if (!session?.user) throw error(401, 'Unauthorized');

	const userId = session.user.email ?? session.user.id;
	const row = getParticipant(userId);
	if (!row) return json({ profile: null });

	return json({
		profile: {
			gender: row.gender,
			birthYear: row.birth_year,
			crossings: row.crossings,
			isPublic: row.public === 1,
			completedAt: row.completed_at
		}
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const session = await locals.auth();
	if (!session?.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { gender, birthYear, crossings, isPublic } = body;

	if (!['M', 'W', 'D'].includes(gender)) throw error(400, 'Invalid gender');
	const year = Number(birthYear);
	if (!Number.isInteger(year) || year < 1920 || year > new Date().getFullYear() - 10)
		throw error(400, 'Invalid birth year');
	const cross = Number(crossings);
	if (!Number.isInteger(cross) || cross < 0 || cross > TOTAL_CROSSINGS)
		throw error(400, 'Invalid crossings count');

	const userId = session.user.email ?? session.user.id;
	const userName = session.user.name ?? session.user.email ?? userId;

	upsertParticipant({
		userId,
		userName,
		gender,
		birthYear: year,
		crossings: cross,
		isPublic: Boolean(isPublic)
	});

	return json({ ok: true });
}
