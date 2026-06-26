import crypto from 'node:crypto';

const SESSION_COOKIE = 'acrossr10.session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const getSecret = () => process.env.AUTH_SESSION_SECRET || 'acrossr10-dev-secret';

const base64UrlEncode = (value) => Buffer.from(value, 'utf8').toString('base64url');
const base64UrlDecode = (value) => Buffer.from(value, 'base64url').toString('utf8');

const signPayload = (payload) =>
  crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');

const serializeSession = ({ role }) => {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = base64UrlEncode(JSON.stringify({ role, exp }));
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
};

const parseSession = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expected = signPayload(payload);
  if (sig !== expected) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload));
    if (!parsed?.role || !parsed?.exp) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      role: parsed.role,
      exp: parsed.exp
    };
  } catch {
    return null;
  }
};

export const authConfig = {
  sessionCookie: SESSION_COOKIE,
  memberCode: process.env.MEMBER_ACCESS_CODE || 'ACROSSR10-MEMBER',
  adminCode: process.env.ADMIN_ACCESS_CODE || 'ACROSSR10-ADMIN'
};

export const issueSession = (cookies, role) => {
  const token = serializeSession({ role });
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS
  });
};

export const clearSession = (cookies) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
};

export const getSession = (cookies) => {
  const token = cookies.get(SESSION_COOKIE);
  return parseSession(token);
};

export const requireRole = (cookies, allowedRoles = []) => {
  const session = getSession(cookies);
  if (!session) return { ok: false, reason: 'Unauthorized' };
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return { ok: false, reason: 'Forbidden' };
  }

  return { ok: true, session };
};
