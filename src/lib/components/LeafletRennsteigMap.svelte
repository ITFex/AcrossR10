<script>
  import { onMount } from 'svelte';

  export let title = 'Rennsteig Karte';
  export let description = 'Leaflet-Karte mit Rennsteig-Radtour';
  export let gpxPath = '/rennsteig-race.gpx';

  let mapContainer;
  let isLoading = true;
  let error = '';

  const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

  const ensureLeafletCss = () => {
    if (document.querySelector('link[data-leaflet="true"]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS_URL;
    link.dataset.leaflet = 'true';
    document.head.appendChild(link);
  };

  const ensureLeafletJs = () => {
    if (window.L) return Promise.resolve(window.L);

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-leaflet="true"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.L));
        existing.addEventListener('error', () => reject(new Error('Leaflet konnte nicht geladen werden.')));
        return;
      }

      const script = document.createElement('script');
      script.src = LEAFLET_JS_URL;
      script.async = true;
      script.dataset.leaflet = 'true';
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error('Leaflet konnte nicht geladen werden.'));
      document.head.appendChild(script);
    });
  };

  const parseGpx = (xmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('GPX konnte nicht gelesen werden.');
    }

    const trackPoints = [...doc.querySelectorAll('trkpt')]
      .map((node) => [Number(node.getAttribute('lat')), Number(node.getAttribute('lon'))])
      .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));

    const waypoints = [...doc.querySelectorAll('wpt')]
      .map((node) => ({
        lat: Number(node.getAttribute('lat')),
        lon: Number(node.getAttribute('lon')),
        name: node.querySelector('name')?.textContent?.trim() || 'Wegpunkt'
      }))
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

    return { trackPoints, waypoints };
  };

  onMount(async () => {
    if (!mapContainer) return;

    try {
      ensureLeafletCss();
      const L = await ensureLeafletJs();

      const map = L.map(mapContainer, {
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const response = await fetch(gpxPath);
      if (!response.ok) {
        throw new Error(`GPX konnte nicht geladen werden (${response.status}).`);
      }

      const xmlText = await response.text();
      const { trackPoints, waypoints } = parseGpx(xmlText);

      if (trackPoints.length < 2) {
        throw new Error('Zu wenige Trackpunkte im GPX-Track.');
      }

      const polyline = L.polyline(trackPoints, {
        color: '#2f6f4f',
        weight: 4,
        opacity: 0.92
      }).addTo(map);

      const start = trackPoints[0];
      const finish = trackPoints[trackPoints.length - 1];

      L.circleMarker(start, {
        radius: 6,
        color: '#184a35',
        fillColor: '#2f6f4f',
        fillOpacity: 1,
        weight: 2
      })
        .addTo(map)
        .bindPopup('Start der Radtour');

      L.circleMarker(finish, {
        radius: 6,
        color: '#7f3d1f',
        fillColor: '#b45e33',
        fillOpacity: 1,
        weight: 2
      })
        .addTo(map)
        .bindPopup('Ziel der Radtour');

      for (const waypoint of waypoints.slice(0, 15)) {
        L.circleMarker([waypoint.lat, waypoint.lon], {
          radius: 4,
          color: '#7a6a4a',
          fillColor: '#b79b72',
          fillOpacity: 0.9,
          weight: 1
        })
          .addTo(map)
          .bindPopup(waypoint.name);
      }

      map.fitBounds(polyline.getBounds(), { padding: [24, 24] });
      isLoading = false;

      return () => {
        map.remove();
      };
    } catch (err) {
      error = err?.message || 'Karte konnte nicht initialisiert werden.';
      isLoading = false;
    }
  });
</script>

<section class="leaflet-card" aria-label={title}>
  <header>
    <h3>{title}</h3>
    <p>{description}</p>
  </header>

  {#if isLoading}
    <p class="status">Karte wird geladen...</p>
  {:else if error}
    <p class="error">{error}</p>
  {/if}

  <div class="map-wrap {isLoading || error ? 'is-dimmed' : ''}" bind:this={mapContainer}></div>
</section>

<style>
  .leaflet-card {
    border: 1px solid #c8b996;
    border-radius: 0.85rem;
    background: rgba(248, 241, 230, 0.94);
    padding: 0.9rem;
    display: grid;
    gap: 0.55rem;
  }

  header {
    display: grid;
    gap: 0.2rem;
  }

  h3,
  p {
    margin: 0;
  }

  p {
    color: #5f5443;
    font-size: 0.86rem;
  }

  .status {
    color: #4c6f4f;
    font-weight: 700;
  }

  .error {
    color: #a64033;
    font-weight: 700;
  }

  .map-wrap {
    width: 100%;
    min-height: 20rem;
    border-radius: 0.7rem;
    border: 1px solid #ccb997;
    overflow: hidden;
  }

  .is-dimmed {
    opacity: 0.65;
  }
</style>
