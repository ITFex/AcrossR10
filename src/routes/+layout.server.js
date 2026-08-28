import { env } from '$env/dynamic/private';
import { base } from '$app/paths';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
	return {
		session: await event.locals.auth()
	};
};
