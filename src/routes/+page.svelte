<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import { messages } from '$lib/i18n/index.js';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  const pois = [
    { id: 1, name: 'Hörschel (Start)', latitude: 51.00692, longitude: 10.22831 },
    { id: 2, name: 'Neuenhof', latitude: 50.99618, longitude: 10.28764 },
    { id: 3, name: 'Eisenach', latitude: 50.97774, longitude: 10.31952 },
    { id: 4, name: 'Hohe Sonne', latitude: 50.93179, longitude: 10.35795 },
    { id: 5, name: 'Etterwinden', latitude: 50.8769, longitude: 10.37449 },
    { id: 6, name: 'Ascherbrück', latitude: 50.84486, longitude: 10.42432 },
    { id: 7, name: 'Ruhla', latitude: 50.89233, longitude: 10.36556 },
    { id: 8, name: 'Großer Inselsberg', latitude: 50.85139, longitude: 10.46389 },
    { id: 9, name: 'Grenzwiese', latitude: 50.76494, longitude: 10.55807 },
    { id: 10, name: 'Oberhof', latitude: 50.70647, longitude: 10.72797 }
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
