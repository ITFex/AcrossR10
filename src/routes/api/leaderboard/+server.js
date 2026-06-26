import { json } from '@sveltejs/kit';
import { getDbPool } from '$lib/server/db';
import { requireRole } from '$lib/server/auth';

export async function GET({ cookies }) {
  const access = requireRole(cookies, ['member', 'admin']);
  if (!access.ok) {
    return json({ error: access.reason }, { status: access.reason === 'Forbidden' ? 403 : 401 });
  }

  try {
    const pool = await getDbPool();
    const { rows } = await pool.query(`
      SELECT
        rider_name AS name,
        SUM(points)::int AS total_points,
        COUNT(*)::int AS total_check_ins,
        COUNT(DISTINCT poi_id)::int AS unique_pois,
        MAX(created_at) AS last_check_in_at
      FROM checkins
      GROUP BY rider_name
      ORDER BY total_points DESC, total_check_ins DESC, rider_name ASC
    `);

    const riders = rows.map((row) => ({
      name: row.name,
      totalPoints: Number(row.total_points) || 0,
      totalCheckIns: Number(row.total_check_ins) || 0,
      uniquePois: Number(row.unique_pois) || 0,
      lastCheckInAt: row.last_check_in_at
    }));

    return json({ riders });
  } catch (error) {
    return json({ error: `Database read failed: ${error.message}` }, { status: 500 });
  }
}
