import { json } from '@sveltejs/kit';
import { getDbPool } from '$lib/server/db';
import { requireRole } from '$lib/server/auth';

const TABLE_NAME = 'member_locations';

const normalizeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export async function GET({ url, cookies }) {
  const access = requireRole(cookies, ['member', 'admin']);
  if (!access.ok) {
    return json({ error: access.reason }, { status: access.reason === 'Forbidden' ? 403 : 401 });
  }

  const sinceMinutes = Math.max(1, Math.min(180, Number(url.searchParams.get('sinceMinutes')) || 15));

  try {
    const pool = await getDbPool();
    const { rows } = await pool.query(
      `
        SELECT member_id, name, status, latitude, longitude, accuracy, last_seen, source
        FROM ${TABLE_NAME}
        WHERE last_seen >= NOW() - ($1::int || ' minutes')::interval
        ORDER BY last_seen DESC
      `,
      [sinceMinutes]
    );

    return json({ members: rows });
  } catch (error) {
    return json({ error: `Database read failed: ${error.message}` }, { status: 500 });
  }
}

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

  const memberId = String(body?.member_id || '').trim();
  const name = String(body?.name || '').trim();
  const status = body?.status === 'inactive' ? 'inactive' : 'active';
  const latitude = normalizeNumber(body?.latitude);
  const longitude = normalizeNumber(body?.longitude);
  const accuracy = normalizeNumber(body?.accuracy);
  const source = String(body?.source || 'web').trim() || 'web';

  if (!memberId || !name) {
    return json({ error: 'member_id and name are required.' }, { status: 400 });
  }

  try {
    const pool = await getDbPool();
    const { rows } = await pool.query(
      `
        INSERT INTO ${TABLE_NAME} (member_id, name, status, latitude, longitude, accuracy, last_seen, source)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
        ON CONFLICT (member_id)
        DO UPDATE SET
          name = EXCLUDED.name,
          status = EXCLUDED.status,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          accuracy = EXCLUDED.accuracy,
          last_seen = NOW(),
          source = EXCLUDED.source
        RETURNING member_id, name, status, latitude, longitude, accuracy, last_seen, source
      `,
      [memberId, name, status, latitude, longitude, accuracy, source]
    );

    return json({ member: rows[0] });
  } catch (error) {
    return json({ error: `Database write failed: ${error.message}` }, { status: 500 });
  }
}
