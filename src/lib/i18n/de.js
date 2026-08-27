/** @type {import('./types').Messages} */
const de = {
  app: {
    title: 'AcrossR10',
    subtitle: 'Mobile Geofencing-Check-ins entlang des Across R10 im Thüringer Wald'
  },
  location: {
    heading: 'Standort',
    lat: 'Lat',
    lon: 'Lon',
    accuracy: 'Genauigkeit',
    waiting: 'Warte auf GPS-Signal\u2026'
  },
  poi: {
    heading: 'Nächster POI',
    distance: (meters) => `${Math.round(meters)}\u202fm entfernt`,
    none: 'Kein POI verfügbar.'
  },
  checkin: {
    heading: 'Check-in',
    active: 'Jetzt einchecken',
    inactive: 'Check-in nicht verfügbar',
    distanceHint: (meters) => `Noch ${Math.round(meters)}\u202fm entfernt`,
    success: (name, time) => time ? `Eingecheckt bei ${name} um ${time}` : `Eingecheckt bei ${name}`
  },
  geo: {
    permissionDenied: 'Standortzugriff verweigert.',
    unavailable: 'Standort ist derzeit nicht verfügbar.',
    timeout: 'Standortanfrage hat das Zeitlimit überschritten.',
    unknown: 'Unbekannter Standortfehler.',
    unsupported: 'Geolokalisierung wird auf diesem Gerät nicht unterstützt.'
  },
  lang: {
    switchTo: 'English'
  }
};

export default de;
