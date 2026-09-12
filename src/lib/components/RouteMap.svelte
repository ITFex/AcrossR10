<script>
  import { onMount, onDestroy } from 'svelte';
  import { MAP } from '$lib/mapProfile.js';
  import { CHECKPOINTS } from '$lib/checkpoints.js';

  /** @type {string} Aktuelle Locale */
  export let locale = 'de';
  /** @type {string[]} Lokalisierte Checkpoint-Namen (10 Stück, Index = position-1) */
  export let checkpointNames = [];

  let mapEl;
  let map;
  let L;

  // Checkpoint-Icon: nummerierter Kreis
  function makeIcon(num, isFirst, isLast) {
    const color = isFirst ? '#22c55e' : isLast ? '#ef4444' : '#f97316';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="${color}" stroke="#fff" stroke-width="2"/>
      <text x="14" y="19" text-anchor="middle" font-size="12" font-weight="bold"
            font-family="system-ui,sans-serif" fill="#fff">${num}</text>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }

  onMount(async () => {
    // Leaflet dynamisch laden (kein SSR-Problem)
    L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    map = L.map(mapEl, { zoomControl: true, scrollWheelZoom: false });

    // OSM-Tiles (kein API-Key nötig)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // GPX-Track (orange, 3 px)
    const polyline = L.polyline(MAP.track, {
      color: '#f97316',
      weight: 3,
      opacity: 0.85,
    }).addTo(map);

    // km-Labels (subtile graue Marker ohne Symbol)
    const kmLabels = [0, 50, 100, 130];
    MAP.kmL.forEach(([lat, lon], i) => {
      if (i === 0 || i === MAP.kmL.length - 1) return; // Start/Ziel = Checkpoints
      const km = Math.round((i / (MAP.kmL.length - 1)) * MAP.totalKm);
      L.marker([lat, lon], {
        icon: L.divIcon({
          html: `<span style="background:rgba(0,0,0,.55);color:#fff;font-size:10px;padding:1px 4px;border-radius:3px;white-space:nowrap">${km} km</span>`,
          className: '',
          iconAnchor: [20, 8],
        }),
        interactive: false,
      }).addTo(map);
    });

    // Checkpoint-Marker
    CHECKPOINTS.forEach((cp, i) => {
      const isFirst = cp.position === 1;
      const isLast  = cp.position === 10;
      const name = checkpointNames[i] || cp.name;
      const label = isFirst
        ? `🚦 ${name}`
        : isLast
        ? `🏁 ${name}`
        : `${cp.position}. ${name}`;

      L.marker([cp.lat, cp.lon], { icon: makeIcon(cp.position, isFirst, isLast) })
        .bindPopup(`<strong>${label}</strong>`, { maxWidth: 200 })
        .addTo(map);
    });

    // Kartenausschnitt auf Track anpassen
    map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
  });

  onDestroy(() => {
    map?.remove();
  });
</script>

<div class="map-wrap">
  <div bind:this={mapEl} class="map-canvas"></div>
  <div class="map-legend">
    <span class="legend-item"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#22c55e"/></svg> Start</span>
    <span class="legend-item"><svg width="12" height="12"><line x1="0" y1="6" x2="12" y2="6" stroke="#f97316" stroke-width="3"/></svg> Route</span>
    <span class="legend-item"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#ef4444"/></svg> Ziel</span>
  </div>
</div>

<style>
  .map-wrap {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,.35);
  }
  .map-canvas {
    width: 100%;
    height: 420px;
  }
  @media (max-width: 600px) {
    .map-canvas { height: 300px; }
  }
  .map-legend {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1000;
    background: rgba(0,0,0,.65);
    color: #fff;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 6px;
    display: flex;
    gap: 12px;
    pointer-events: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
