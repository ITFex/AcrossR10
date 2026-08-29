import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import {
	checkCrossingGeofence,
	getCrossings,
	getPlan,
	getPlansForToday,
	getUpcomingPlans,
	recordValidatedCrossing,
	setCrossing,
	setPlan,
	syncRider,
	TOTAL_CROSSINGS,
} from '$lib/db/progress.js';

const PLAN_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAN_DIRECTIONS = new Set(['forward', 'return']);

/**
 * Baut die volle Seiten-Datenstruktur (gleiche Form wie `load`),
 * damit die UI nach einem Action automatisch aktuell bleibt.
 * @param {string} subjectId
 */
const fullState = (subjectId) => ({
	crossings: getCrossings(subjectId),
	total: TOTAL_CROSSINGS,
	myPlan: getPlan(subjectId),
	todaysRiders: getPlansForToday(),
	upcoming: getUpcomingPlans(7),
});

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
	return {
		session,
		...fullState(user.id),
	};
};

/** @type {import('./$types').PageServerActions} */
export const actions = {
	/**
	 * POST /acrossr10/members?action=toggle
	 * form: toggle (1..10):'0'|'1', geo_lat, geo_lon
	 *
	 * Geofencing (serverseitig erzwungen):
	 * - Eintragen (→ '1') verlangt eine GPS-Position innerhalb des
	 *   100-m-Radius des jeweiligen Checkpoints. Ohne gültige Koordinate
	 *   oder außerhalb des Radius wird abgelehnt (fail 400).
	 * - Rückgängig (→ '0') bleibt ohne GPS möglich.
	 *
	 * Achtung: In Actions gibt es kein `parent()` – Session via locals.auth().
	 */
	toggle: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			throw redirect(303, `${base}/`);
		}
		const subjectId = session.user.id;

		const formData = await request.formData();
		const raw = String(formData.get('toggle') ?? '');
		const [posStr, stateStr] = raw.split(':');
		const position = Number(posStr);
		const done = stateStr === '1';

		if (!Number.isInteger(position) || position < 1 || position > TOTAL_CROSSINGS) {
			return fail(400, { error: 'invalid_position' });
		}

		if (done) {
			// ── Geofence: GPS-Position muss mitgeschickt werden ──
			const latRaw = formData.get('geo_lat');
			const lonRaw = formData.get('geo_lon');
			const lat = typeof latRaw === 'string' ? Number(latRaw) : NaN;
			const lon = typeof lonRaw === 'string' ? Number(lonRaw) : NaN;

			if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
				return fail(400, { error: 'geo_required' });
			}

			// ── Geofence: serverseitig innerhalb des Radius prüfen ──
			const check = checkCrossingGeofence(subjectId, position, lat, lon);
			if (!check.allowed) {
				return fail(400, {
					error: 'geo_denied',
					geo: {
						allowed: false,
						ts: Date.now(),
						distance_m: check.distance_m,
						point: check.point,
					},
				});
			}

			try {
				recordValidatedCrossing(subjectId, position, lat, lon);
			} catch {
				return fail(500, { error: 'db_error' });
			}

			return {
				...fullState(subjectId),
				updated: position,
				geo: {
					allowed: true,
					ts: Date.now(),
					distance_m: check.distance_m,
					point: check.point,
				},
			};
		}

		// ── Rückgängig: kein Geofence nötig ──
		try {
			setCrossing(subjectId, position, false);
		} catch {
			return fail(400, { error: 'invalid_position' });
		}

		return {
			...fullState(subjectId),
			updated: position,
			geo: { allowed: false, undone: true },
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
		const subjectId = session.user.id;

		const formData = await request.formData();
		const dateRaw = String(formData.get('date') ?? '').trim();
		const directionRaw = String(formData.get('direction') ?? 'forward');
		const clear = String(formData.get('clear') ?? '') === '1';

		const direction = PLAN_DIRECTIONS.has(directionRaw)
			? /** @type {'forward' | 'return'} */ (directionRaw)
			: 'forward';
		const date = !clear && PLAN_DATE_RE.test(dateRaw) ? dateRaw : null;

		try {
			setPlan(subjectId, date, date ? direction : null);
		} catch {
			return fail(400, { error: 'invalid_plan' });
		}

		return {
			...fullState(subjectId),
			planUpdated: true,
		};
	},
};