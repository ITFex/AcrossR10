<script>
  import { onMount } from 'svelte';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  export let gpxPath = '/rennsteig-race.gpx';
  export let title = 'Renntrack (GPX)';

  let loading = true;
  let error = '';
  let trackPoints = [];
  let waypoints = [];

  const formatKm = (meters) => `${(meters / 1000).toFixed(1)} km`;
  const formatMeters = (meters) => `${Math.round(meters)} m`;

  const parseGpx = (xmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('GPX konnte nicht gelesen werden.');
    }

    const trkNodes = [...doc.querySelectorAll('trkpt')];
    const wptNodes = [...doc.querySelectorAll('wpt')];

    const parsedTrack = trkNodes
      .map((node) => {
        const lat = Number(node.getAttribute('lat'));
        const lon = Number(node.getAttribute('lon'));
        const eleNode = node.querySelector('ele');
        const elevation = eleNode ? Number(eleNode.textContent) : null;

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

        return {
          latitude: lat,
          longitude: lon,
          elevation: Number.isFinite(elevation) ? elevation : null
        };
      })
      .filter(Boolean);

    const parsedWaypoints = wptNodes
      .map((node) => {
        const lat = Number(node.getAttribute('lat'));
        const lon = Number(node.getAttribute('lon'));
        const nameNode = node.querySelector('name');

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

        return {
          name: nameNode?.textContent?.trim() || 'POI',
          latitude: lat,
          longitude: lon
        };
      })
      .filter(Boolean);

    return {
      track: parsedTrack,
      waypoints: parsedWaypoints
    };
  };

  const samplePoints = (points, maxPoints = 1400) => {
    if (points.length <= maxPoints) return points;

    const step = Math.ceil(points.length / maxPoints);
    const sampled = [];
    for (let idx = 0; idx < points.length; idx += step) {
      sampled.push(points[idx]);
    }

    const last = points[points.length - 1];
    if (sampled[sampled.length - 1] !== last) sampled.push(last);

    return sampled;
  };

  const toPolyline = (points) => {
    if (points.length < 2) return [];

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

    const lonSpan = Math.max(0.00001, maxLon - minLon);
    const latSpan = Math.max(0.00001, maxLat - minLat);

    return points.map((point) => {
      const x = 4 + ((point.longitude - minLon) / lonSpan) * 92;
      const y = 96 - ((point.latitude - minLat) / latSpan) * 92;
      return { x, y };
    });
  };

  const calcStats = (points) => {
    let totalDistance = 0;
    let totalAscent = 0;

    for (let idx = 1; idx < points.length; idx += 1) {
      totalDistance += haversineDistanceMeters(points[idx - 1], points[idx]);

      const prevEle = points[idx - 1].elevation;
      const nextEle = points[idx].elevation;
      if (Number.isFinite(prevEle) && Number.isFinite(nextEle) && nextEle > prevEle) {
        totalAscent += nextEle - prevEle;
      }
    }

    return {
      distance: totalDistance,
      ascent: totalAscent
    };
  };

  onMount(async () => {
    loading = true;
    error = '';

    try {
      const response = await fetch(gpxPath);
      if (!response.ok) {
        throw new Error(`GPX nicht gefunden (${response.status}).`);
      }

      const xmlText = await response.text();
      const parsed = parseGpx(xmlText);
      trackPoints = parsed.track;
      waypoints = parsed.waypoints;
    } catch (err) {
      error = err?.message || 'Fehler beim Laden des GPX-Tracks.';
    } finally {
      loading = false;
    }
  });

  $: stats = calcStats(trackPoints);
  $: simplifiedTrack = samplePoints(trackPoints);
  $: projected = toPolyline(simplifiedTrack);
  $: polylinePoints = projected.map((p) => `${p.x},${p.y}`).join(' ');
  $: firstPoint = projected[0] || null;
  $: lastPoint = projected[projected.length - 1] || null;
  $: shownWaypoints = waypoints.slice(0, 8);
</script>

<section class="gpx-card" aria-label={title}>
  <header>
    <h3>{title}</h3>
    <p>Beispieltrack fur das eintagige Rennformat, inkl. visualisierter Strecke.</p>
  </header>

  {#if loading}
    <p class="info">GPX wird geladen...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div class="stats">
      <article>
        <p class="label">DISTANZ</p>
        <p class="value">{formatKm(stats.distance)}</p>
      </article>
      <article>
        <p class="label">HÖHENMETER</p>
        <p class="value">{stats.ascent > 0 ? formatMeters(stats.ascent) : 'n/a'}</p>
      </article>
      <article>
        <p class="label">TRACKPUNKTE</p>
        <p class="value">{trackPoints.length}</p>
      </article>
      <article>
        <p class="label">WEGPUNKTE</p>
        <p class="value">{waypoints.length}</p>
      </article>
    </div>

    <div class="map-wrap">
      <svg viewBox="0 0 100 100" role="img" aria-label="GPX Streckenverlauf">
        <rect x="2" y="2" width="96" height="96" rx="8" class="bg" />
        {#if projected.length > 1}
          <polyline points={polylinePoints} class="line" />
          {#if firstPoint}
            <circle cx={firstPoint.x} cy={firstPoint.y} r="1.5" class="start" />
          {/if}
          {#if lastPoint}
            <circle cx={lastPoint.x} cy={lastPoint.y} r="1.5" class="finish" />
          {/if}
        {/if}
      </svg>
    </div>

    {#if shownWaypoints.length > 0}
      <div class="waypoint-box">
        <h4>Ausgewahlte Wegpunkte</h4>
        <ul>
          {#each shownWaypoints as waypoint}
            <li>{waypoint.name}</li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}
</section>

<style>
  .gpx-card {
    border: 1px solid #ccb993;
    border-radius: 0.85rem;
    background: rgba(248, 241, 230, 0.94);
    padding: 0.85rem;
    display: grid;
    gap: 0.7rem;
  }

  header {
    display: grid;
    gap: 0.2rem;
  }

  h3,
  h4,
  p {
    margin: 0;
  }

  p {
    color: #615644;
    font-size: 0.86rem;
  }

  .info {
    color: #5b6c4a;
    font-weight: 700;
  }

  .error {
    color: #a43c32;
    font-weight: 700;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .stats article {
    border-top: 1px solid #d8c6a2;
    padding-top: 0.35rem;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #6f624e;
    letter-spacing: 0.08em;
  }

  .value {
    color: #30271d;
    font-size: 1rem;
    font-weight: 700;
  }

  .map-wrap {
    border: 1px solid #c9b388;
    border-radius: 0.7rem;
    overflow: hidden;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .bg {
    fill: rgba(241, 232, 216, 0.96);
  }

  .line {
    fill: none;
    stroke: #8a6237;
    stroke-width: 0.8;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .start {
    fill: #3f7447;
    stroke: #224128;
    stroke-width: 0.25;
  }

  .finish {
    fill: #b86a35;
    stroke: #693718;
    stroke-width: 0.25;
  }

  .waypoint-box {
    display: grid;
    gap: 0.4rem;
  }

  .waypoint-box ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.25rem;
    color: #4f4638;
  }

  @media (min-width: 760px) {
    .stats {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
