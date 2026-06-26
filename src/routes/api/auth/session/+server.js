import { json } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export async function GET({ cookies }) {
  const session = getSession(cookies);
  if (!session) {
    return json({ authenticated: false, role: null });
  }

  return json({
    authenticated: true,
    role: session.role,
    expiresAt: session.exp
  });
}
