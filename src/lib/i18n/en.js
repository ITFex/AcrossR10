/** @type {import('./types').Messages} */
const en = {
  app: {
    title: 'AcrossR10',
    subtitle: 'Mobile geofencing check-in for cyclists'
  },
  location: {
    heading: 'Location',
    lat: 'Lat',
    lon: 'Lon',
    accuracy: 'Accuracy',
    waiting: 'Waiting for GPS signal\u2026'
  },
  poi: {
    heading: 'Nearest POI',
    distance: (meters) => `${Math.round(meters)}\u202fm away`,
    none: 'No POI available.'
  },
  checkin: {
    heading: 'Check-in',
    active: 'Check in now',
    inactive: 'Check-in unavailable',
    distanceHint: (meters) => `Still ${Math.round(meters)}\u202fm away`,
    success: (name, time) => time ? `Checked in at ${name} at ${time}` : `Checked in at ${name}`
  },
  geo: {
    permissionDenied: 'Location access denied.',
    unavailable: 'Location is currently unavailable.',
    timeout: 'Location request timed out.',
    unknown: 'Unknown geolocation error.',
    unsupported: 'Geolocation is not supported on this device.'
  },
  lang: {
    switchTo: 'Deutsch'
  }
};

export default en;
