<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import { messages } from '$lib/i18n/index.js';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  const pois = [
    { id: 1, name: 'Rastplatz Nord', latitude: 52.5208, longitude: 13.4095 },
    { id: 2, name: 'Fahrradstation Süd', latitude: 52.5173, longitude: 13.3928 },
    { id: 3, name: 'Aussichtspunkt West', latitude: 52.5124, longitude: 13.3777 }
  ];

  let checkedInPoi = null;
  let checkedInAt = null;
  let userCoords = null;
  let nearest = null;

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
    <h1>{$messages.app.title}</h1>
    <p>{$messages.app.subtitle}</p>
  </header>

  <section class="panel">
    <h2>{$messages.location.heading}</h2>
    {#if $location.error}
      <p class="error">{$location.error}</p>
    {:else if userCoords}
      <p>{$messages.location.lat}: {userCoords.latitude.toFixed(5)}</p>
      <p>{$messages.location.lon}: {userCoords.longitude.toFixed(5)}</p>
      <p>{$messages.location.accuracy}: {Math.round($location.accuracy ?? 0)}m</p>
    {:else}
      <p>{$messages.location.waiting}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{$messages.poi.heading}</h2>
    {#if nearest}
      <p>{nearest.poi.name}</p>
      <p>{$messages.poi.distance(nearest.distance)}</p>
    {:else}
      <p>{$messages.poi.none}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{$messages.checkin.heading}</h2>
    <CheckInBtn
      userLocation={userCoords}
      {pois}
      activeLabel={$messages.checkin.active}
      inactiveLabel={$messages.checkin.inactive}
      formatDistanceLabel={$messages.checkin.distanceHint}
      on:checkin={handleCheckIn}
    />

    {#if checkedInPoi}
      <p class="success">
        {$messages.checkin.success(
          checkedInPoi.name,
          checkedInAt?.toLocaleTimeString() ?? ''
        )}
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
