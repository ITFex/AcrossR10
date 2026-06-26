<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import leaderboard from '$lib/stores/leaderboard';
  import { haversineDistanceMeters } from '$lib/utils/haversine';

  const GEOFENCE_RADIUS_METERS = 50;
  const RIDER_NAME_KEY = 'acrossr10.current-rider';

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
  let riderName = '';
  let riderHint = '';
  let scorePreview = 100;

  $: userCoords = $location.coords;
  $: nearest = findNearestPoi(userCoords, pois);
  $: isInsideGeofence = Boolean(nearest && nearest.distance <= GEOFENCE_RADIUS_METERS);
  $: scorePreview = nearest ? Math.max(10, 100 - Math.min(90, Math.round(nearest.distance))) : 100;

  onMount(() => {
    leaderboard.initialize();
    location.start();

    if (typeof localStorage !== 'undefined') {
      riderName = localStorage.getItem(RIDER_NAME_KEY) || '';
    }

    return () => location.stop();
  });

  function saveRiderName(value) {
    riderName = value;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(RIDER_NAME_KEY, value);
    }
  }

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
    const normalizedName = riderName.trim();

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

    if (!normalizedName) {
      riderHint = 'Bitte zuerst einen Fahrernamen eingeben, damit Punkte in die ewige Bestenliste zählen.';
      return;
    }

    leaderboard.addCheckIn({
      riderName: normalizedName,
      poiId: event.detail.poi.id,
      distance: event.detail.distance,
      timestamp
    });

    riderHint = `${normalizedName} hat Punkte für die ewige Bestenliste gesammelt.`;
  }
</script>

<main>
  <header class="panel panel-hero">
    <h1>Live Check-in</h1>
    <p>Standortdaten prüfen, nächsten POI finden und in der Geofence-Zone einchecken.</p>
    <div class="hero-meta">
      <span>Geofence-Radius: {GEOFENCE_RADIUS_METERS} m</span>
      <span>Vorschau Punkte: {scorePreview}</span>
    </div>
  </header>

  <section class="panel panel-identity">
    <h2>Fahrerprofil</h2>
    <label for="rider-name">Name für die ewige Bestenliste</label>
    <input
      id="rider-name"
      type="text"
      placeholder="z. B. Lena, Markus, Team Waldritt"
      value={riderName}
      on:input={(event) => saveRiderName(event.currentTarget.value)}
    />
    <p class="subtle">Der Name bleibt lokal gespeichert und wird für alle kommenden Check-ins genutzt.</p>
    {#if riderHint}
      <p class="inside">{riderHint}</p>
    {/if}
  </section>

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
    <h2>Nächster POI</h2>
    {#if nearest}
      <p>{nearest.poi.name}</p>
      <p>{Math.round(nearest.distance)}m entfernt</p>
      <p class:inside={isInsideGeofence} class:outside={!isInsideGeofence}>
        {#if isInsideGeofence}
          Du bist im Geofence (Radius {GEOFENCE_RADIUS_METERS}m).
        {:else}
          Außerhalb des Geofence-Radius ({GEOFENCE_RADIUS_METERS}m).
        {/if}
      </p>
    {:else}
      <p>Kein POI verfügbar.</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Check-in</h2>
    <CheckInBtn
      userLocation={userCoords}
      {pois}
      threshold={GEOFENCE_RADIUS_METERS}
      activeLabel="Jetzt einchecken"
      inactiveLabel="Check-in nicht verfügbar"
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

  <section class="panel panel-info">
    <h2>Wertung und weitere Infos</h2>
    <ul class="history-list">
      <li>Jeder Check-in bringt Punkte auf Basis der Distanz zum POI (nah = mehr Punkte).</li>
      <li>Die ewige Bestenliste summiert alle Punkte und Check-ins dauerhaft.</li>
      <li>Bei Punktgleichheit entscheidet zuerst die Anzahl der Check-ins, dann der Name.</li>
      <li>Die Auswertung findest du in der neuen Rubrik Bestenliste.</li>
    </ul>
    <a class="jump-link" href="/bestenliste">Zur ewigen Bestenliste</a>
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
    background: linear-gradient(160deg, rgba(248, 238, 224, 0.98), rgba(240, 224, 203, 0.98));
    border: 1px solid #d1b48f;
    border-radius: 0.9rem;
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
  }

  .panel-hero {
    border-color: #c39b67;
  }

  .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .hero-meta span {
    display: inline-flex;
    border-radius: 999px;
    border: 1px solid #cfb18a;
    background: rgba(247, 237, 222, 0.9);
    padding: 0.25rem 0.6rem;
    font-size: 0.82rem;
  }

  .panel-identity {
    border-color: #ba9768;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .error {
    color: #b24d3b;
    font-weight: 700;
  }

  label {
    font-weight: 700;
    font-size: 0.9rem;
  }

  input {
    border: 1px solid #c9aa82;
    border-radius: 0.65rem;
    background: rgba(251, 245, 236, 0.92);
    color: #4f3a25;
    padding: 0.6rem 0.65rem;
    font: inherit;
  }

  .subtle {
    color: #7d6141;
    font-size: 0.86rem;
  }

  .success {
    color: #497046;
    font-weight: 700;
  }

  .inside {
    color: #497046;
    font-weight: 700;
  }

  .outside {
    color: #a46334;
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

  .panel-info {
    border-color: #c39b67;
  }

  .jump-link {
    width: fit-content;
    text-decoration: none;
    color: #fff9ef;
    background: linear-gradient(135deg, #b8824a, #9f6f3d);
    border-radius: 999px;
    padding: 0.45rem 0.72rem;
    font-size: 0.9rem;
    font-weight: 700;
  }
</style>
