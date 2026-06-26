import { json } from '@sveltejs/kit';
import { getDbPool } from '$lib/server/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    const { rows } = await pool.query(
      `
        SELECT id, name, latitude, longitude, geofence_radius_meters
        FROM pois
        WHERE active = TRUE
        ORDER BY name ASC
      `
    );

    return json({ pois: rows });
  } catch (error) {
    return json({ error: `Database read failed: ${error.message}` }, { status: 500 });
  }
}
