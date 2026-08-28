import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getCrossings, setCrossing, syncRider, TOTAL_CROSSINGS } from '$lib/db/progress.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const { session } = /** @type {{ session: import('@auth/core/types').Session | null }} */ (
		await parent()
	);
	if (!session?.user) {
		throw redirect(303, `${base}/`);
	}
	const user = session.user;
	syncRider(user);
	const crossings = getCrossings(user.id);
	return { session, crossings, total: TOTAL_CROSSINGS };
};

/** @type {import('./$types').PageServerActions} */
export const actions = {
	/**
	 * POST /acrossr10/members?action=toggle
	 * form: position (1..10), done ('true' | 'false')
	 */
	toggle: async ({ request, parent }) => {
		const { session } = /** @type {{ session: import('@auth/core/types').Session | null }} */ (
			await parent()
		);
		if (!session?.user) {
			throw redirect(303, `${base}/`);
		}

		const formData = await request.formData();
		const raw = String(formData.get('toggle') ?? '');
		const [posStr, stateStr] = raw.split(':');
		const position = Number(posStr);
		const done = stateStr === '1';

		try {
			setCrossing(session.user.id, position, done);
		} catch {
			return fail(400, { error: 'invalid_position' });
		}

		const crossings = getCrossings(session.user.id);
		return { session, crossings, total: TOTAL_CROSSINGS, updated: position };
	},
};
