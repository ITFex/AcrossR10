import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import {
	getCrossings,
	getPlan,
	getPlansForToday,
	getUpcomingPlans,
	setCrossing,
	setPlan,
	syncRider,
	TOTAL_CROSSINGS,
} from '$lib/db/progress.js';

const PLAN_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAN_DIRECTIONS = new Set(['forward', 'return']);

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const { session } = /** @type {{ session: import('@auth/core/types').Session | null }} */ (
		await parent()
	);
	if (!session?.user?.id) {
		throw redirect(303, `${base}/`);
	}
	const user = session.user;
	syncRider(user);
	const crossings = getCrossings(user.id);
	return {
		session,
		crossings,
		total: TOTAL_CROSSINGS,
		myPlan: getPlan(user.id),
		todaysRiders: getPlansForToday(),
		upcoming: getUpcomingPlans(7),
	};
};

/** @type {import('./$types').PageServerActions} */
export const actions = {
	/**
	 * POST /acrossr10/members?action=toggle
	 * form: toggle (1..10):'0'|'1'
	 * Achtung: In Actions gibt es kein `parent()` – Session via locals.auth().
	 */
	toggle: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
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

		return {
			session,
			crossings: getCrossings(session.user.id),
			total: TOTAL_CROSSINGS,
			updated: position,
		};
	},

	/**
	 * POST /acrossr10/members?action=plan
	 * form: date (YYYY-MM-DD), direction ('forward' | 'return'),
	 *       clear = '1' → Planung löschen
	 * Achtung: In Actions gibt es kein `parent()` – Session via locals.auth().
	 */
	plan: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, `${base}/`);
		}

		const formData = await request.formData();
		const dateRaw = String(formData.get('date') ?? '').trim();
		const directionRaw = String(formData.get('direction') ?? 'forward');
		const clear = String(formData.get('clear') ?? '') === '1';

		const direction = PLAN_DIRECTIONS.has(directionRaw)
			? /** @type {'forward' | 'return'} */ (directionRaw)
			: 'forward';
		const date = !clear && PLAN_DATE_RE.test(dateRaw) ? dateRaw : null;

		try {
			setPlan(session.user.id, date, date ? direction : null);
		} catch {
			return fail(400, { error: 'invalid_plan' });
		}

		return {
			session,
			crossings: getCrossings(session.user.id),
			total: TOTAL_CROSSINGS,
			myPlan: getPlan(session.user.id),
			todaysRiders: getPlansForToday(),
			upcoming: getUpcomingPlans(7),
			planUpdated: true,
		};
	},
};
