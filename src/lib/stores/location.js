import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { messages } from '$lib/i18n/index.js';

const initialState = {
  status: 'idle',
  coords: null,
  accuracy: null,
  error: null
};

const state = writable(initialState);
let watchId = null;

const geolocationErrorMessage = (error) => {
  const geo = get(messages).geo;
  switch (error?.code) {
    case 1:
      return geo.permissionDenied;
    case 2:
      return geo.unavailable;
    case 3:
      return geo.timeout;
    default:
      return geo.unknown;
  }
};

const start = (options = {}) => {
  if (!browser) return;

  if (!('geolocation' in navigator)) {
    state.set({
      ...initialState,
      status: 'error',
      error: get(messages).geo.unsupported
    });
    return;
  }

  if (watchId !== null) return;

  state.update((current) => ({ ...current, status: 'watching', error: null }));

  watchId = navigator.geolocation.watchPosition(
    ({ coords }) => {
      state.set({
        status: 'ready',
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        accuracy: coords.accuracy,
        error: null
      });
    },
    (error) => {
      if (error?.code === 1 && watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      state.update((current) => ({
        ...current,
        status: 'error',
        error: geolocationErrorMessage(error)
      }));
    },
    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 15000,
      ...options
    }
  );
};

const stop = () => {
  if (!browser || watchId === null) return;
  const currentWatchId = watchId;
  watchId = null;
  navigator.geolocation.clearWatch(currentWatchId);
  state.update((current) => ({ ...current, status: 'idle', error: null }));
};

const reset = () => state.set(initialState);

const location = {
  subscribe: state.subscribe,
  start,
  stop,
  reset
};

export default location;
