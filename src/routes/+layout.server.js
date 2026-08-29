import { getCmsContent } from '$lib/cms.js';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
	// CMS-Content für beide Locales (clientseitiges Language-Switching ohne Reload).
	// Fällt weich aus: ist das CMS nicht erreichbar, enthält cms leere Listen.
	return {
		session: await event.locals.auth(),
		cms: await getCmsContent(),
	};
};
