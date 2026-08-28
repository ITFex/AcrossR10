import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { env } from '$env/dynamic/private';

/**
 * JWT-Sessions enthalten den Keycloak-`sub` in `token.sub` – der Standard-
 * Session-Callback gibt ihn aber nicht an `session.user` weiter. Ohne `id`
 * bricht die Fortschritts-DB (syncRider) ab → /members wirft 500 und die
 * ewige Bestenliste bleibt leer. Deshalb: sub → user.id kopieren.
 */
export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: env.KEYCLOAK_ID,
			clientSecret: env.KEYCLOAK_SECRET,
			issuer: env.KEYCLOAK_ISSUER
		})
	],
	secret: env.AUTH_SECRET,
	trustHost: true,
	callbacks: {
		session({ session, token }) {
			if (session?.user) {
				session.user.id = /** @type {string} */ (token.sub ?? session.user.id);
			}
			return session;
		},
	},
});
