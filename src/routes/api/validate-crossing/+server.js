import { json } from '@sveltejs/kit';
import { checkCrossingGeofence } from '$lib/db/progress.js';

/**
 * POST /acrossr10/api/validate-crossing
 * Body: { position: 1..10, lat: number, lon: number }
 *
 * NUR lesend: prüft, ob der User im Geofence-Radius des Checkpoints ist.
 * Die eigentliche Eintragung erfolgt über die serverseitige Action
 * `?/toggle`, die dieselbe Prüfung erneut serverseitig durchführt.
 */
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ error: 'unauthorized' }, { status: 401 });
	}

	const body = await request.json().catch(() => ({}));
	const { position, lat, lon } = body;

	if (!Number.isInteger(position) || position < 1 || position > 10) {
		return json({ error: 'invalid_position' }, { status: 400 });
	}
	if (typeof lat !== 'number' || typeof lon !== 'number' || Number.isNaN(lat) || Number.isNaN(lon)) {
		return json({ error: 'invalid_coordinates' }, { status: 400 });
	}

	const result = checkCrossingGeofence(session.user.id, position, lat, lon);
	return json(result);
}