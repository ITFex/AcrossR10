<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  const pois = [
    { id: 1, name: 'Rastplatz Nord', latitude: 52.5208, longitude: 13.4095 },
    { id: 2, name: 'Fahrradstation Süd', latitude: 52.5173, longitude: 13.3928 },
    { id: 3, name: 'Aussichtspunkt West', latitude: 52.5124, longitude: 13.3777 }
  ];

  let checkedInPoi = null;
  let checkedInAt = null;

  $: userCoords = $location.coords;
  $: nearest = findNearestPoi(userCoords, pois);

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
    checkedInPoi = event.detail.poi;
    checkedInAt = new Date();
  }
</script>

<main>
  <header>
    <h1>AcrossR10</h1>
    <p>Mobile Geofencing Check-in für Radfahrer</p>
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
      <p>Warte auf GPS-Signal…</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Nächster POI</h2>
    {#if nearest}
      <p>{nearest.poi.name}</p>
      <p>{Math.round(nearest.distance)}m entfernt</p>
    {:else}
      <p>Kein POI verfügbar.</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Check-in</h2>
    <CheckInBtn
      userLocation={userCoords}
      {pois}
      activeLabel="Jetzt einchecken"
      inactiveLabel="Check-in nicht verfügbar"
      formatDistanceLabel={(distance) => `Noch ${Math.round(distance)}m entfernt`}
      on:checkin={handleCheckIn}
    />

    {#if checkedInPoi}
      <p class="success">
        Eingecheckt bei {checkedInPoi.name}
        {#if checkedInAt}
          um {checkedInAt.toLocaleTimeString()}
        {/if}
      </p>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, sans-serif;
    color: #f8fafc;
    background: #0f172a;
  }

  main {
    min-height: 100vh;
    padding: 1rem;
    display: grid;
    gap: 1rem;
    align-content: start;
    max-width: 32rem;
    margin: 0 auto;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  header p {
    opacity: 0.9;
    margin-top: 0.25rem;
  }

  .panel {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.75rem;
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
  }

  .error {
    color: #fca5a5;
    font-weight: 700;
  }

  .success {
    color: #86efac;
    font-weight: 700;
  }
</style>
