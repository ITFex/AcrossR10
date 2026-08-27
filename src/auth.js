import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { KEYCLOAK_ID, KEYCLOAK_SECRET, KEYCLOAK_ISSUER, AUTH_SECRET } from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: KEYCLOAK_ID,
			clientSecret: KEYCLOAK_SECRET,
			issuer: KEYCLOAK_ISSUER
		})
	],
	secret: AUTH_SECRET,
	trustHost: true
});
