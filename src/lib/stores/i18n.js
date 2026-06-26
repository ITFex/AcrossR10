import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'acrossr10.locale';
const DEFAULT_LOCALE = 'de';
const SUPPORTED_LOCALES = ['de', 'en'];

const normalizeLocale = (value) => {
  if (!value || typeof value !== 'string') return null;

  const normalized = value.toLowerCase().slice(0, 2);
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : null;
};

const detectLocale = () => {
  if (!browser) return DEFAULT_LOCALE;

  const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY));
  if (stored) return stored;

  const fromNavigator = normalizeLocale(navigator.language || navigator.languages?.[0]);
  return fromNavigator || DEFAULT_LOCALE;
};

export const locale = writable(DEFAULT_LOCALE);

export const initLocale = () => {
  if (!browser) return;
  locale.set(detectLocale());
};

export const setLocale = (value) => {
  const normalized = normalizeLocale(value) || DEFAULT_LOCALE;
  locale.set(normalized);

  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, normalized);
};

if (browser) {
  locale.subscribe((value) => {
    document.documentElement.lang = value;
  });
}
