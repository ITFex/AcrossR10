import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import de from './de.js';
import en from './en.js';

/** @typedef {'de' | 'en'} Locale */

const STORAGE_KEY = 'locale';
const SUPPORTED = /** @type {const} */ (['de', 'en']);

/** @param {string | null} value @returns {Locale} */
const coerce = (value) => (SUPPORTED.includes(/** @type {any} */ (value)) ? /** @type {Locale} */ (value) : 'de');

const detectLocale = () => {
  if (!browser) return 'de';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return coerce(stored);
  const lang = navigator.language?.slice(0, 2);
  return coerce(SUPPORTED.includes(/** @type {any} */ (lang)) ? lang : 'de');
};

/** @type {import('svelte/store').Writable<Locale>} */
export const locale = writable('de');

if (browser) {
  locale.set(detectLocale());
  locale.subscribe((value) => localStorage.setItem(STORAGE_KEY, value));
}

/** @param {Locale} next */
export const setLocale = (next) => locale.set(coerce(next));

/** @type {import('svelte/store').Readable<import('./de.js').default>} */
export const messages = derived(locale, ($locale) => ($locale === 'en' ? en : de));
