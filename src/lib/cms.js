/**
 * Kleiner Client für das Payload CMS (Container `acrossr10-cms` im Docker-Netz).
 * Lädt News/Highlights serverseitig für beide Locales, mit In-Memory-Cache und
 * sanftem Fallback: ist das CMS down, liefert die App weiter (leere Listen).
 */
import { env } from '$env/dynamic/private';

// Vollständiger REST-Base: CMS-API läuft unter dem Next.js basePath
// /acrossr10/cms → http://<container>:3000/acrossr10/cms/api
const CMS_API_URL = (env.CMS_API_URL ?? 'http://acrossr10-cms:3000/acrossr10/cms/api').replace(/\/$/, '');
// Öffentliche Basis für Asset-/Media-URLs (für den Browser)
const CMS_PUBLIC_URL = (env.CMS_PUBLIC_URL ?? 'https://wideride.de/acrossr10/cms').replace(/\/$/, '');
const CACHE_TTL = 60_000; // 60 s – News ändern sich selten
const FETCH_TIMEOUT = 5_000;

/** @type {Map<string, {ts:number, data:any}>} */
const cache = new Map();

/**
 * @param {string} key
 * @param {() => Promise<any>} fetcher
 * @returns {Promise<any>}
 */
async function cached(key, fetcher) {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;
	const data = await fetcher();
	cache.set(key, { ts: Date.now(), data });
	return data;
}

/**
 * GET gegen die CMS-REST-API. @returns {Promise<null | any>}
 * @param {string} path z. B. '/news?where[published]=equals[true]&locale=de'
 */
async function cmsGet(path) {
	try {
		const res = await fetch(CMS_API_URL + path, {
			signal: AbortSignal.timeout(FETCH_TIMEOUT),
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null; // CMS down → App läuft trotzdem
	}
}

/**
 * @param {any} ref Media-Referenz (Payload-Upload) oder null
 * @returns {string} Öffentliche URL oder ''
 */
export function mediaUrl(ref) {
	if (!ref) return '';
	if (typeof ref === 'string') ref = { url: ref };
	const url = ref.url ?? '';
	if (!url) return '';
	if (url.startsWith('http')) return url;
	// Relative URL → CMS-Public-Base + /api + url
	const clean = url.replace(/^\//, '');
	return `${CMS_PUBLIC_URL}/api/${clean}`;
}

/**
 * Lädt veröffentlichte News für eine Locale (neueste zuerst).
 * @param {'de' | 'en'} locale
 * @returns {Promise<Array<{id:string, title:string, teaser:string, date:string|null, imageUrl:string}>>}
 */
export function getNews(locale) {
	return cached(`news:${locale}`, async () => {
		const json = await cmsGet(
			`/news?where[published][equals]=true&sort=-date&limit=6&locale=${locale}`,
		);
		const docs = json?.docs;
		if (!Array.isArray(docs)) return [];
		return docs
			.map((d) => ({
				id: String(d.id),
				title: d.title || '',
				teaser: d.teaser || '',
				date: d.date || null,
				imageUrl: mediaUrl(d.image),
			}))
			.filter((n) => n.title);
	});
}

/**
 * Lädt veröffentlichte Highlights für eine Locale (sortiert nach position).
 * @param {'de' | 'en'} locale
 * @returns {Promise<Array<{id:string, title:string, text:string, imageUrl:string}>>}
 */
export function getHighlights(locale) {
	return cached(`highlights:${locale}`, async () => {
		const json = await cmsGet(
			`/highlights?where[published][equals]=true&sort=position&limit=6&locale=${locale}`,
		);
		const docs = json?.docs;
		if (!Array.isArray(docs)) return [];
		return docs
			.map((d) => ({
				id: String(d.id),
				title: d.title || '',
				text: d.text || '',
				imageUrl: mediaUrl(d.image),
			}))
			.filter((h) => h.title);
	});
}

/**
 * Lädt News + Highlights für beide Locales einmalig (clientseitiges
 * Locale-Switching ohne Reload).
 * @returns {Promise<{news:{de:never[], en:never[]}, highlights:{de:never[], en:never[]}}>}
 */
export async function getCmsContent() {
	const [newsDe, newsEn, hiDe, hiEn] = await Promise.all([
		getNews('de'),
		getNews('en'),
		getHighlights('de'),
		getHighlights('en'),
	]);
	return {
		news: { de: newsDe, en: newsEn },
		highlights: { de: hiDe, en: hiEn },
	};
}
