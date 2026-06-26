import { json } from '@sveltejs/kit';
import { getDbPool } from '$lib/server/db';

export async function GET() {
  try {
    const pool = await getDbPool();
    const { rows } = await pool.query('SELECT NOW() AS now');
    return json({ ok: true, dbNow: rows[0]?.now || null });
  } catch (error) {
    return json({ ok: false, error: `Database unavailable: ${error.message}` }, { status: 503 });
  }
}
