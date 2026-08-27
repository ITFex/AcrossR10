import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: env.KEYCLOAK_ID,
			clientSecret: env.KEYCLOAK_SECRET,
			issuer: env.KEYCLOAK_ISSUER
		})
	],
	secret: env.AUTH_SECRET,
	trustHost: true
});
