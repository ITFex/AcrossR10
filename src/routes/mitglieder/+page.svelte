<script>
  import { onMount } from 'svelte';
  import LiveTrackingMap from '$lib/components/LiveTrackingMap.svelte';
  import memberTracking from '$lib/stores/memberTracking';

  const ACCESS_CODE = 'ACROSSR10-MEMBER';
  const ACCESS_KEY = 'acrossr10.member-access';

  const routeMarkers = [
    {
      id: 'poi-nord',
      name: 'Rastplatz Nord',
      coords: { latitude: 52.5208, longitude: 13.4095 }
    },
    {
      id: 'poi-sued',
      name: 'Fahrradstation Süd',
      coords: { latitude: 52.5173, longitude: 13.3928 }
    },
    {
      id: 'poi-west',
      name: 'Aussichtspunkt West',
      coords: { latitude: 52.5124, longitude: 13.3777 }
    }
  ];

  let enteredCode = '';
  let gateError = '';
  let isAuthorized = false;
  let selfMemberId = '';

  $: members = ($memberTracking.members || []).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );

  onMount(() => {
    memberTracking.initialize();
    selfMemberId = memberTracking.getSelfId();

    if (typeof localStorage !== 'undefined') {
      isAuthorized = localStorage.getItem(ACCESS_KEY) === 'granted';
    }

    return () => memberTracking.stop();
  });

  const submitCode = () => {
    if (enteredCode.trim().toUpperCase() !== ACCESS_CODE) {
      gateError = 'Ungültiger Zugangscode.';
      return;
    }

    gateError = '';
    isAuthorized = true;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ACCESS_KEY, 'granted');
    }
  };

  const lockArea = () => {
    isAuthorized = false;
    enteredCode = '';
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ACCESS_KEY);
    }
  };

  const toRelativeTime = (isoDate) => {
    const ms = Date.now() - new Date(isoDate).getTime();
    if (!Number.isFinite(ms) || ms < 0) return 'gerade eben';

    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}min`;

    const hours = Math.round(minutes / 60);
    return `${hours}h`;
  };
</script>

<main>
  {#if !isAuthorized}
    <section class="panel auth-panel">
      <p class="kicker">Interner Bereich</p>
      <h1>Mitglieder LiveTracking</h1>
      <p>Zugang nur mit internem Mitgliedercode.</p>

      <label for="member-code">Zugangscode</label>
      <input
        id="member-code"
        type="password"
        placeholder="Code eingeben"
        value={enteredCode}
        on:input={(event) => (enteredCode = event.currentTarget.value)}
      />
      <button class="btn" on:click={submitCode}>Bereich öffnen</button>

      {#if gateError}
        <p class="error">{gateError}</p>
      {/if}

      <p class="subtle">Demo-Code: {ACCESS_CODE}</p>
    </section>
  {:else}
    <header class="panel hero-panel">
      <p class="kicker">Mitgliederbereich</p>
      <h1>LiveTracking der Mitglieder</h1>
      <p>Positionen werden in Supabase Realtime synchronisiert.</p>
      <div class="meta">
        <span>Aktive Positionen: {members.filter((m) => m.status === 'active').length}</span>
        <span>Gesamt-Mitglieder: {members.length}</span>
      </div>
      {#if $memberTracking.error}
        <p class="error">{$memberTracking.error}</p>
      {:else if !$memberTracking.ready}
        <p class="subtle">Realtime-Verbindung wird aufgebaut...</p>
      {/if}
      <button class="lock" on:click={lockArea}>Bereich sperren</button>
    </header>

    <section class="grid">
      <LiveTrackingMap members={members} {routeMarkers} {selfMemberId} />

      <article class="panel list-panel">
        <h2>Mitgliederstatus</h2>
        {#if members.length > 0}
          <ul class="members-list">
            {#each members as member}
              <li>
                <div>
                  <strong>
                    {member.name}
                    {#if member.id === selfMemberId}
                      (Du)
                    {/if}
                  </strong>
                  <p>{member.status === 'active' ? 'Aktiv' : 'Inaktiv'}</p>
                </div>
                <div class="right">
                  <p>Zuletzt: {toRelativeTime(member.lastSeen)}</p>
                  {#if member.accuracy}
                    <p>GPS: ±{member.accuracy}m</p>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p>Noch keine Mitglieder im LiveTracking.</p>
        {/if}
      </article>
    </section>
  {/if}
</main>

<style>
  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0.5rem 1rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .panel {
    border-radius: 0.9rem;
    border: 1px solid #cfb28c;
    background: linear-gradient(160deg, rgba(248, 238, 224, 0.98), rgba(240, 224, 203, 0.98));
    padding: 1rem;
    display: grid;
    gap: 0.55rem;
  }

  .auth-panel {
    max-width: 30rem;
  }

  .hero-panel {
    border-color: #be9562;
  }

  .kicker {
    margin: 0;
    color: #9c7444;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  label {
    font-weight: 700;
    font-size: 0.9rem;
  }

  input {
    border: 1px solid #c8aa82;
    border-radius: 0.65rem;
    background: rgba(251, 245, 236, 0.92);
    color: #4f3a25;
    padding: 0.6rem 0.65rem;
    font: inherit;
  }

  .btn,
  .lock {
    width: fit-content;
    border: 1px solid transparent;
    border-radius: 999px;
    background: linear-gradient(135deg, #b8824a, #9f6f3d);
    color: #fff9ef;
    padding: 0.45rem 0.75rem;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .lock {
    background: rgba(123, 88, 55, 0.95);
  }

  .error {
    color: #b24d3b;
    font-weight: 700;
  }

  .subtle {
    color: #7d6141;
    font-size: 0.86rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .meta span {
    border: 1px solid #c8a97e;
    border-radius: 999px;
    padding: 0.25rem 0.6rem;
    background: rgba(247, 237, 222, 0.9);
    font-size: 0.82rem;
  }

  .grid {
    display: grid;
    gap: 0.9rem;
  }

  .list-panel {
    align-content: start;
  }

  .members-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.45rem;
  }

  .members-list li {
    border: 1px solid #d6be9d;
    border-radius: 0.7rem;
    background: rgba(250, 243, 232, 0.92);
    padding: 0.6rem;
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
  }

  .members-list p {
    color: #74583a;
    font-size: 0.84rem;
  }

  .right {
    text-align: right;
  }

  @media (min-width: 900px) {
    .grid {
      grid-template-columns: 1.2fr 1fr;
    }
  }
</style>