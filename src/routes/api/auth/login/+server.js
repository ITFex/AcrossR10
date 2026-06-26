import { json } from '@sveltejs/kit';
import { authConfig, issueSession } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const accessCode = String(body?.accessCode || '').trim().toUpperCase();
  if (!accessCode) {
    return json({ error: 'Access code is required.' }, { status: 400 });
  }

  let role = null;
  if (accessCode === authConfig.adminCode.toUpperCase()) {
    role = 'admin';
  } else if (accessCode === authConfig.memberCode.toUpperCase()) {
    role = 'member';
  }

  if (!role) {
    return json({ error: 'Invalid access code.' }, { status: 401 });
  }

  issueSession(cookies, role);
  return json({ ok: true, role });
}
