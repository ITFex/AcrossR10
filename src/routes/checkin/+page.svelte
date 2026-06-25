<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  const GEOFENCE_RADIUS_METERS = 50;

  const pois = [
    { id: 1, name: 'Rastplatz Nord', latitude: 52.5208, longitude: 13.4095 },
    { id: 2, name: 'Fahrradstation Süd', latitude: 52.5173, longitude: 13.3928 },
    { id: 3, name: 'Aussichtspunkt West', latitude: 52.5124, longitude: 13.3777 }
  ];

  let checkedInPoi = null;
  let checkedInAt = null;
  let checkIns = [];
  let userCoords = null;
  let nearest = null;
  let isInsideGeofence = false;

  $: userCoords = $location.coords;
  $: nearest = findNearestPoi(userCoords, pois);
  $: isInsideGeofence = Boolean(nearest && nearest.distance <= GEOFENCE_RADIUS_METERS);

  onMount(() => {
    location.start();
    return () => location.stop();
  });

  function findNearestPoi(user, items) {
    if (!user || !items?.length) return null;

    let bestPoi = null;
    let bestDistance = Infinity;

    for (const poi of items) {
      const distance = haversineDistanceMeters(user, poi);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPoi = poi;
      }
    }

    return bestPoi
      ? {
          poi: bestPoi,
          distance: bestDistance
        }
      : null;
  }

  function handleCheckIn(event) {
    const timestamp = new Date();

    checkedInPoi = event.detail.poi;
    checkedInAt = timestamp;
    checkIns = [
      {
        id: `${event.detail.poi.id}-${timestamp.getTime()}`,
        poi: event.detail.poi,
        distance: event.detail.distance,
        timestamp
      },
      ...checkIns
    ];
  }
</script>

<main>
  <header class="panel">
    <h1>Live Check-in</h1>
    <p>Standortdaten pruefen, naechsten POI finden und in der Geofence-Zone einchecken.</p>
  </header>

  <section class="panel">
    <h2>Standort</h2>
    {#if $location.error}
      <p class="error">{$location.error}</p>
    {:else if userCoords}
      <p>Lat: {userCoords.latitude.toFixed(5)}</p>
      <p>Lon: {userCoords.longitude.toFixed(5)}</p>
      <p>Genauigkeit: {Math.round($location.accuracy ?? 0)}m</p>
    {:else}
      <p>Warte auf GPS-Signal...</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Naechster POI</h2>
    {#if nearest}
      <p>{nearest.poi.name}</p>
      <p>{Math.round(nearest.distance)}m entfernt</p>
      <p class:inside={isInsideGeofence} class:outside={!isInsideGeofence}>
        {#if isInsideGeofence}
          Du bist im Geofence (Radius {GEOFENCE_RADIUS_METERS}m).
        {:else}
          Ausserhalb des Geofence-Radius ({GEOFENCE_RADIUS_METERS}m).
        {/if}
      </p>
    {:else}
      <p>Kein POI verfuegbar.</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Check-in</h2>
    <CheckInBtn
      userLocation={userCoords}
      {pois}
      threshold={GEOFENCE_RADIUS_METERS}
      activeLabel="Jetzt einchecken"
      inactiveLabel="Check-in nicht verfuegbar"
      formatDistanceLabel={(distance) => `Noch ${Math.round(distance)}m entfernt`}
      on:checkin={handleCheckIn}
    />

    {#if checkedInPoi}
      <p class="success">
        Eingecheckt bei {checkedInPoi.name}
        {#if checkedInAt}
          am {checkedInAt.toLocaleDateString()} um {checkedInAt.toLocaleTimeString()}
        {/if}
      </p>
    {/if}

    <h3>Check-in Historie</h3>
    {#if checkIns.length > 0}
      <ul class="history-list">
        {#each checkIns as checkIn}
          <li>
            <strong>{checkIn.poi.name}</strong><br />
            {checkIn.timestamp.toLocaleDateString()} {checkIn.timestamp.toLocaleTimeString()}<br />
            Distanz: {Math.round(checkIn.distance)}m
          </li>
        {/each}
      </ul>
    {:else}
      <p>Noch keine Meldungen erfasst.</p>
    {/if}
  </section>
</main>

<style>
  main {
    max-width: 56rem;
    margin: 0 auto;
    padding: 0.5rem 1rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .panel {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.75rem;
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .error {
    color: #fca5a5;
    font-weight: 700;
  }

  .success {
    color: #86efac;
    font-weight: 700;
  }

  .inside {
    color: #86efac;
    font-weight: 700;
  }

  .outside {
    color: #fdba74;
    font-weight: 700;
  }

  .history-list {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }

  .history-list li {
    line-height: 1.35;
  }

  h3 {
    margin: 0.25rem 0 0;
    font-size: 1rem;
  }
</style>
