import { json } from '@sveltejs/kit';
import { clearSession } from '$lib/server/auth';

export async function POST({ cookies }) {
  clearSession(cookies);
  return json({ ok: true });
}
