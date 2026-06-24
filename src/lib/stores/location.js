import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const initialState = {
  status: 'idle',
  coords: null,
  accuracy: null,
  error: null
};

const state = writable(initialState);
let watchId = null;

const geolocationErrorMessage = (error) => {
  switch (error?.code) {
    case 1:
      return 'Standortzugriff verweigert.';
    case 2:
      return 'Standort momentan nicht verfügbar.';
    case 3:
      return 'Standortabfrage hat zu lange gedauert.';
    default:
      return 'Unbekannter Geolokalisierungsfehler.';
  }
};

const start = (options = {}) => {
  if (!browser) return;

  if (!('geolocation' in navigator)) {
    state.set({
      ...initialState,
      status: 'error',
      error: 'Geolocation wird von diesem Gerät nicht unterstützt.'
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
  navigator.geolocation.clearWatch(watchId);
  watchId = null;
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
