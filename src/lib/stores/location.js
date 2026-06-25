import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const initialState = {
  status: 'idle',
  coords: null,
  accuracy: null,
  error: null
};

const defaultMessages = {
  permissionDenied: 'Location access denied.',
  unavailable: 'Location is currently unavailable.',
  timeout: 'Location request timed out.',
  unknown: 'Unknown geolocation error.',
  unsupported: 'Geolocation is not supported on this device.'
};

const state = writable(initialState);
let watchId = null;
let messages = { ...defaultMessages };

const geolocationErrorMessage = (error) => {
  switch (error?.code) {
    case 1:
      return messages.permissionDenied;
    case 2:
      return messages.unavailable;
    case 3:
      return messages.timeout;
    default:
      return messages.unknown;
  }
};

const setMessages = (overrides = {}) => {
  messages = { ...defaultMessages, ...overrides };
};

const start = (options = {}) => {
  if (!browser) return;

  if (!('geolocation' in navigator)) {
    state.set({
      ...initialState,
      status: 'error',
      error: messages.unsupported
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
  reset,
  setMessages
};

export default location;
