import { json } from '@sveltejs/kit';
import { getDbPool } from '$lib/server/db';
import { haversineDistanceMeters } from '$lib/utils/haversine';
import { requireRole } from '$lib/server/auth';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export async function POST({ request, cookies }) {
  const access = requireRole(cookies, ['member', 'admin']);
  if (!access.ok) {
    return json({ error: access.reason }, { status: access.reason === 'Forbidden' ? 403 : 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const riderName = String(body?.riderName || '').trim();
  const poiId = Number(body?.poiId);
  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);
  const accuracy = Number(body?.accuracy);

  if (!riderName || !Number.isFinite(poiId) || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return json({ error: 'riderName, poiId, latitude and longitude are required.' }, { status: 400 });
  }

  try {
    const pool = await getDbPool();

    const poiResult = await pool.query(
      `
        SELECT id, name, latitude, longitude, geofence_radius_meters
        FROM pois
        WHERE id = $1 AND active = TRUE
      `,
      [poiId]
    );

    const poi = poiResult.rows[0];
    if (!poi) {
      return json({ error: 'POI not found.' }, { status: 404 });
    }

    const distance = haversineDistanceMeters(
      { latitude, longitude },
      { latitude: poi.latitude, longitude: poi.longitude }
    );

    const geofenceRadius = Number(poi.geofence_radius_meters) || 50;
    const insideGeofence = distance <= geofenceRadius;

    const antiCheatResult = await pool.query(
      `
        SELECT created_at
        FROM checkins
        WHERE rider_name = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [riderName]
    );

    const lastCheckInAt = antiCheatResult.rows[0]?.created_at
      ? new Date(antiCheatResult.rows[0].created_at).getTime()
      : null;

    if (lastCheckInAt && Date.now() - lastCheckInAt < 20_000) {
      return json({ error: 'Check-in too soon. Please wait before the next check-in.' }, { status: 429 });
    }

    const points = clamp(100 - Math.round(distance), 10, 100);

    const insert = await pool.query(
      `
        INSERT INTO checkins (rider_name, poi_id, latitude, longitude, accuracy, distance_meters, points, inside_geofence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, rider_name, poi_id, distance_meters, points, created_at
      `,
      [
        riderName,
        poi.id,
        latitude,
        longitude,
        Number.isFinite(accuracy) ? Math.round(accuracy) : null,
        Math.round(distance),
        points,
        insideGeofence
      ]
    );

    return json({
      checkin: insert.rows[0],
      poi: { id: poi.id, name: poi.name, geofenceRadius },
      insideGeofence,
      distance: Math.round(distance),
      points
    });
  } catch (error) {
    return json({ error: `Database write failed: ${error.message}` }, { status: 500 });
  }
}
