<script>
  import { onMount } from 'svelte';
  import LiveTrackingMap from '$lib/components/LiveTrackingMap.svelte';
  import memberTracking from '$lib/stores/memberTracking';
  import { locale } from '$lib/stores/i18n';

  const ACCESS_CODE = 'ACROSSR10-MEMBER';

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
  let sessionRole = '';
  let selfMemberId = '';

  const copy = {
    de: {
      internalArea: 'Interner Bereich',
      title: 'Mitglieder Live-Tracking',
      accessOnly: 'Zugang nur mit internem Mitgliedercode.',
      accessCodeLabel: 'Zugangscode',
      accessCodePlaceholder: 'Code eingeben',
      openArea: 'Bereich öffnen',
      invalidCode: 'Ungültiger Zugangscode.',
      authFailed: 'Anmeldung fehlgeschlagen.',
      demoCode: 'Demo-Code',
      memberArea: 'Mitgliederbereich',
      liveTrackingTitle: 'Live-Tracking der Mitglieder',
      realtimeHint: 'Positionen werden mit der lokalen PostgreSQL-API synchronisiert.',
      activePositions: 'Aktive Positionen',
      totalMembers: 'Gesamt-Mitglieder',
      realtimeConnect: 'Realtime-Verbindung wird aufgebaut...',
      lockArea: 'Bereich sperren',
      memberStatus: 'Mitgliederstatus',
      you: 'Du',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      lastSeen: 'Zuletzt',
      gps: 'GPS',
      noMembers: 'Noch keine Mitglieder im Live-Tracking.',
      justNow: 'gerade eben',
      seconds: 's',
      minutes: 'min',
      hours: 'h'
    },
    en: {
      internalArea: 'Internal area',
      title: 'Member Live Tracking',
      accessOnly: 'Access with internal member code only.',
      accessCodeLabel: 'Access code',
      accessCodePlaceholder: 'Enter code',
      openArea: 'Open area',
      invalidCode: 'Invalid access code.',
      authFailed: 'Login failed.',
      demoCode: 'Demo code',
      memberArea: 'Member area',
      liveTrackingTitle: 'Live tracking of members',
      realtimeHint: 'Positions are synchronized via the local PostgreSQL API.',
      activePositions: 'Active positions',
      totalMembers: 'Total members',
      realtimeConnect: 'Establishing realtime connection...',
      lockArea: 'Lock area',
      memberStatus: 'Member status',
      you: 'You',
      active: 'Active',
      inactive: 'Inactive',
      lastSeen: 'Last seen',
      gps: 'GPS',
      noMembers: 'No members in live tracking yet.',
      justNow: 'just now',
      seconds: 's',
      minutes: 'min',
      hours: 'h'
    }
  };

  $: t = copy[$locale] ?? copy.de;

  $: members = ($memberTracking.members || []).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );

  onMount(() => {
    memberTracking.initialize();
    selfMemberId = memberTracking.getSelfId();

    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((body) => {
        isAuthorized = Boolean(body?.authenticated);
        sessionRole = body?.role || '';
      })
      .catch(() => {
        isAuthorized = false;
        sessionRole = '';
      });

    return () => memberTracking.stop();
  });

  const submitCode = async () => {
    gateError = '';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accessCode: enteredCode })
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        gateError = body.error || t.invalidCode;
        return;
      }

      isAuthorized = true;
      sessionRole = body.role || '';
    } catch {
      gateError = t.authFailed;
    }
  };

  const lockArea = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    isAuthorized = false;
    sessionRole = '';
    enteredCode = '';
  };

  const toRelativeTime = (isoDate) => {
    const ms = Date.now() - new Date(isoDate).getTime();
    if (!Number.isFinite(ms) || ms < 0) return t.justNow;

    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}${t.seconds}`;

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}${t.minutes}`;

    const hours = Math.round(minutes / 60);
    return `${hours}${t.hours}`;
  };
</script>

<main>
  {#if !isAuthorized}
    <section class="panel auth-panel">
      <p class="kicker">{t.internalArea}</p>
      <h1>{t.title}</h1>
      <p>{t.accessOnly}</p>

      <label for="member-code">{t.accessCodeLabel}</label>
      <input
        id="member-code"
        type="password"
        placeholder={t.accessCodePlaceholder}
        value={enteredCode}
        on:input={(event) => (enteredCode = event.currentTarget.value)}
      />
      <button class="btn" on:click={submitCode}>{t.openArea}</button>

      {#if gateError}
        <p class="error">{gateError}</p>
      {/if}

      <p class="subtle">{t.demoCode}: ACROSSR10-MEMBER / ACROSSR10-ADMIN</p>
    </section>
  {:else}
    <header class="panel hero-panel">
      <p class="kicker">{t.memberArea}</p>
      <h1>{t.liveTrackingTitle}</h1>
      <p>{t.realtimeHint}</p>
      <div class="meta">
        <span>{t.activePositions}: {members.filter((m) => m.status === 'active').length}</span>
        <span>{t.totalMembers}: {members.length}</span>
        <span>Role: {sessionRole || 'member'}</span>
      </div>
      {#if $memberTracking.error}
        <p class="error">{$memberTracking.error}</p>
      {:else if !$memberTracking.ready}
        <p class="subtle">{t.realtimeConnect}</p>
      {/if}
      <button class="lock" on:click={lockArea}>{t.lockArea}</button>
    </header>

    <section class="grid">
      <LiveTrackingMap members={members} {routeMarkers} {selfMemberId} />

      <article class="panel list-panel">
        <h2>{t.memberStatus}</h2>
        {#if members.length > 0}
          <ul class="members-list">
            {#each members as member}
              <li>
                <div>
                  <strong>
                    {member.name}
                    {#if member.id === selfMemberId}
                      ({t.you})
                    {/if}
                  </strong>
                  <p>{member.status === 'active' ? t.active : t.inactive}</p>
                </div>
                <div class="right">
                  <p>{t.lastSeen}: {toRelativeTime(member.lastSeen)}</p>
                  {#if member.accuracy}
                    <p>{t.gps}: ±{member.accuracy}m</p>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p>{t.noMembers}</p>
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