<script>
  import { onMount } from 'svelte';
  import CheckInBtn from '$lib/components/CheckInBtn.svelte';
  import location from '$lib/stores/location';
  import leaderboard from '$lib/stores/leaderboard';
  import memberTracking from '$lib/stores/memberTracking';
  import { locale } from '$lib/stores/i18n';
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

  const copy = {
    de: {
      title: 'Live Check-in',
      subtitle: 'Standortdaten prüfen, nächsten POI finden und in der Geofence-Zone einchecken.',
      geofenceRadius: 'Geofence-Radius',
      scorePreview: 'Vorschau Punkte',
      riderProfile: 'Fahrerprofil',
      riderNameLabel: 'Name für die ewige Bestenliste',
      riderNamePlaceholder: 'z. B. Lena, Markus, Team Waldritt',
      riderNameHint: 'Der Name bleibt lokal gespeichert und wird für alle kommenden Check-ins genutzt.',
      location: 'Standort',
      lat: 'Lat',
      lon: 'Lon',
      accuracy: 'Genauigkeit',
      waitingGps: 'Warte auf GPS-Signal...',
      nearestPoi: 'Nächster POI',
      distanceAway: 'entfernt',
      inGeofence: 'Du bist im Geofence (Radius {radius}m).',
      outsideGeofence: 'Außerhalb des Geofence-Radius ({radius}m).',
      noPoi: 'Kein POI verfügbar.',
      checkin: 'Check-in',
      activeCheckin: 'Jetzt einchecken',
      inactiveCheckin: 'Check-in nicht verfügbar',
      stillAway: 'Noch {distance}m entfernt',
      checkedInAt: 'Eingecheckt bei {poi} am {date} um {time}',
      history: 'Check-in Historie',
      distance: 'Distanz',
      noHistory: 'Noch keine Meldungen erfasst.',
      scoreInfo: 'Wertung und weitere Infos',
      scoreNotes: [
        'Jeder Check-in bringt Punkte auf Basis der Distanz zum POI (nah = mehr Punkte).',
        'Die ewige Bestenliste summiert alle Punkte und Check-ins dauerhaft.',
        'Bei Punktgleichheit entscheidet zuerst die Anzahl der Check-ins, dann der Name.',
        'Die Auswertung findest du in der Rubrik Bestenliste.'
      ],
      gotoLeaderboard: 'Zur ewigen Bestenliste',
      hintNameFirst: 'Bitte zuerst einen Fahrernamen eingeben, damit Punkte in die ewige Bestenliste zählen.',
      hintPointsCollected: '{name} hat Punkte für die ewige Bestenliste gesammelt.'
    },
    en: {
      title: 'Live Check-in',
      subtitle: 'Check location data, find the nearest POI and check in within the geofence.',
      geofenceRadius: 'Geofence radius',
      scorePreview: 'Points preview',
      riderProfile: 'Rider profile',
      riderNameLabel: 'Name for the all-time leaderboard',
      riderNamePlaceholder: 'e.g. Lena, Markus, Team Forest Ride',
      riderNameHint: 'Your name is stored locally and used for future check-ins.',
      location: 'Location',
      lat: 'Lat',
      lon: 'Lon',
      accuracy: 'Accuracy',
      waitingGps: 'Waiting for GPS signal...',
      nearestPoi: 'Nearest POI',
      distanceAway: 'away',
      inGeofence: 'You are inside the geofence (radius {radius}m).',
      outsideGeofence: 'Outside geofence radius ({radius}m).',
      noPoi: 'No POI available.',
      checkin: 'Check-in',
      activeCheckin: 'Check in now',
      inactiveCheckin: 'Check-in unavailable',
      stillAway: '{distance}m away',
      checkedInAt: 'Checked in at {poi} on {date} at {time}',
      history: 'Check-in history',
      distance: 'Distance',
      noHistory: 'No check-ins recorded yet.',
      scoreInfo: 'Scoring and details',
      scoreNotes: [
        'Each check-in awards points based on distance to the POI (closer = more points).',
        'The all-time leaderboard accumulates points and check-ins permanently.',
        'If points are tied, check-in count comes first, then name.',
        'You can view the evaluation in the leaderboard section.'
      ],
      gotoLeaderboard: 'Go to all-time leaderboard',
      hintNameFirst: 'Please enter a rider name first so points can be counted on the leaderboard.',
      hintPointsCollected: '{name} collected points for the all-time leaderboard.'
    }
  };

  const formatText = (text, values = {}) =>
    text.replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? '').toString());

  $: t = copy[$locale] ?? copy.de;

  $: userCoords = $location.coords;
  $: nearest = findNearestPoi(userCoords, pois);
  $: isInsideGeofence = Boolean(nearest && nearest.distance <= GEOFENCE_RADIUS_METERS);
  $: scorePreview = nearest ? Math.max(10, 100 - Math.min(90, Math.round(nearest.distance))) : 100;

  onMount(() => {
    leaderboard.initialize();
    memberTracking.initialize();
    location.start();

    if (typeof localStorage !== 'undefined') {
      riderName = localStorage.getItem(RIDER_NAME_KEY) || '';
    }

    return () => {
      location.stop();
      if (riderName.trim()) {
        memberTracking.markSelfInactive({
          name: riderName,
          coords: userCoords,
          accuracy: $location.accuracy
        });
      }
      memberTracking.stop();
    };
  });

  function saveRiderName(value) {
    riderName = value;
    const trimmed = value.trim();

    if (trimmed) {
      memberTracking.setSelfProfile({ name: trimmed });
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(RIDER_NAME_KEY, value);
    }
  }

  $: if (riderName.trim() && userCoords) {
    memberTracking.updateSelfLocation({
      name: riderName,
      coords: userCoords,
      accuracy: $location.accuracy
    });
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
      riderHint = t.hintNameFirst;
      return;
    }

    leaderboard.addCheckIn({
      riderName: normalizedName,
      poiId: event.detail.poi.id,
      distance: event.detail.distance,
      timestamp
    });

    riderHint = formatText(t.hintPointsCollected, { name: normalizedName });
  }
</script>

<main>
  <header class="panel panel-hero">
    <h1>{t.title}</h1>
    <p>{t.subtitle}</p>
    <div class="hero-meta">
      <span>{t.geofenceRadius}: {GEOFENCE_RADIUS_METERS} m</span>
      <span>{t.scorePreview}: {scorePreview}</span>
    </div>
  </header>

  <section class="panel panel-identity">
    <h2>{t.riderProfile}</h2>
    <label for="rider-name">{t.riderNameLabel}</label>
    <input
      id="rider-name"
      type="text"
      placeholder={t.riderNamePlaceholder}
      value={riderName}
      on:input={(event) => saveRiderName(event.currentTarget.value)}
    />
    <p class="subtle">{t.riderNameHint}</p>
    {#if riderHint}
      <p class="inside">{riderHint}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{t.location}</h2>
    {#if $location.error}
      <p class="error">{$location.error}</p>
    {:else if userCoords}
      <p>{t.lat}: {userCoords.latitude.toFixed(5)}</p>
      <p>{t.lon}: {userCoords.longitude.toFixed(5)}</p>
      <p>{t.accuracy}: {Math.round($location.accuracy ?? 0)}m</p>
    {:else}
      <p>{t.waitingGps}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{t.nearestPoi}</h2>
    {#if nearest}
      <p>{nearest.poi.name}</p>
      <p>{Math.round(nearest.distance)}m {t.distanceAway}</p>
      <p class:inside={isInsideGeofence} class:outside={!isInsideGeofence}>
        {#if isInsideGeofence}
          {formatText(t.inGeofence, { radius: GEOFENCE_RADIUS_METERS })}
        {:else}
          {formatText(t.outsideGeofence, { radius: GEOFENCE_RADIUS_METERS })}
        {/if}
      </p>
    {:else}
      <p>{t.noPoi}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{t.checkin}</h2>
    <CheckInBtn
      userLocation={userCoords}
      {pois}
      threshold={GEOFENCE_RADIUS_METERS}
      activeLabel={t.activeCheckin}
      inactiveLabel={t.inactiveCheckin}
      formatDistanceLabel={(distance) => formatText(t.stillAway, { distance: Math.round(distance) })}
      on:checkin={handleCheckIn}
    />

    {#if checkedInPoi}
      <p class="success">
        {#if checkedInAt}
          {formatText(t.checkedInAt, {
            poi: checkedInPoi.name,
            date: checkedInAt.toLocaleDateString($locale),
            time: checkedInAt.toLocaleTimeString($locale)
          })}
        {:else}
          {checkedInPoi.name}
        {/if}
      </p>
    {/if}

    <h3>{t.history}</h3>
    {#if checkIns.length > 0}
      <ul class="history-list">
        {#each checkIns as checkIn}
          <li>
            <strong>{checkIn.poi.name}</strong><br />
            {checkIn.timestamp.toLocaleDateString($locale)} {checkIn.timestamp.toLocaleTimeString($locale)}<br />
            {t.distance}: {Math.round(checkIn.distance)}m
          </li>
        {/each}
      </ul>
    {:else}
      <p>{t.noHistory}</p>
    {/if}
  </section>

  <section class="panel panel-info">
    <h2>{t.scoreInfo}</h2>
    <ul class="history-list">
      {#each t.scoreNotes as note}
        <li>{note}</li>
      {/each}
    </ul>
    <a class="jump-link" href="/bestenliste">{t.gotoLeaderboard}</a>
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
