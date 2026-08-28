import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
	const issuer = env.KEYCLOAK_ISSUER ?? '';
	const clientId = env.KEYCLOAK_ID ?? '';
	const redirectUri = event.url.origin;
	const registrationUrl = issuer
		? `${issuer}/protocol/openid-connect/registrations?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
		: null;

	return {
		session: await event.locals.auth(),
		registrationUrl
	};
};
