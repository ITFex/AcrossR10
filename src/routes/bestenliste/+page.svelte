<script>
  import { onMount } from 'svelte';
  import { locale } from '$lib/stores/i18n';

  const copy = {
    de: {
      kicker: 'Hall of Fame',
      title: 'Ewige Bestenliste',
      intro:
        'Alle Punkte aus Check-ins werden in der lokalen PostgreSQL-Datenbank gespeichert. Je näher der Check-in am POI liegt, desto höher die Punktzahl pro Eintrag.',
      participants: 'Teilnehmende',
      totalPoints: 'Gesamtpunkte',
      totalCheckins: 'Check-ins gesamt',
      podium: 'Podium',
      points: 'Punkte',
      checkins: 'Check-ins',
      noEntries: 'Noch keine Einträge. Starte auf der Check-in-Seite und sammle die ersten Punkte.',
      fullRanking: 'Komplette Rangliste',
      rank: 'Rang',
      name: 'Name',
      poi: 'POIs',
      lastCheckin: 'Letzter Check-in',
      noData: 'Keine Daten vorhanden.',
      loading: 'Bestenliste wird geladen...',
      loadError: 'Bestenliste konnte nicht geladen werden.',
      moreInfo: 'Weitere Infos',
      notes: [
        'Punktelogik pro Check-in: mindestens 10, maximal 100 Punkte.',
        'Die Punkteberechnung nutzt die Distanz zum Ziel-POI zum Check-in-Zeitpunkt.',
        'Bei Gleichstand zählt zuerst die Anzahl der Check-ins, danach der Name.',
        'Die Speicherung erfolgt lokal im Browser und bleibt beim Neuladen erhalten.'
      ]
    },
    en: {
      kicker: 'Hall of Fame',
      title: 'All-time Leaderboard',
      intro:
        'All check-in points are stored in the local PostgreSQL database. The closer a check-in is to a POI, the more points are awarded.',
      participants: 'Participants',
      totalPoints: 'Total points',
      totalCheckins: 'Total check-ins',
      podium: 'Podium',
      points: 'points',
      checkins: 'check-ins',
      noEntries: 'No entries yet. Start on the check-in page and collect your first points.',
      fullRanking: 'Full ranking',
      rank: 'Rank',
      name: 'Name',
      poi: 'POIs',
      lastCheckin: 'Last check-in',
      noData: 'No data available.',
      loading: 'Loading leaderboard...',
      loadError: 'Failed to load leaderboard.',
      moreInfo: 'More information',
      notes: [
        'Scoring per check-in: at least 10 and up to 100 points.',
        'Scoring uses the distance to the target POI at check-in time.',
        'If points are tied, check-in count comes first, then name.',
        'Data is stored locally in the browser and persists after reload.'
      ]
    }
  };

  $: t = copy[$locale] ?? copy.de;

  let riders = [];
  let isLoading = false;
  let loadError = '';
  let refreshTimer = null;
  let accessCode = '';
  let isAuthorized = false;

  const loginForLeaderboard = async () => {
    loadError = '';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accessCode })
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.error || t.loadError);
      }

      isAuthorized = true;
      await loadLeaderboard();
      if (!refreshTimer) {
        refreshTimer = window.setInterval(loadLeaderboard, 10_000);
      }
    } catch (error) {
      loadError = error?.message || t.loadError;
      isAuthorized = false;
    }
  };

  const loadLeaderboard = async () => {
    isLoading = true;
    loadError = '';

    try {
      const response = await fetch('/api/leaderboard');
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          isAuthorized = false;
        }
        throw new Error(body.error || t.loadError);
      }

      riders = Array.isArray(body.riders) ? body.riders : [];
      isAuthorized = true;
    } catch (error) {
      loadError = error?.message || t.loadError;
      riders = [];
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((body) => {
        isAuthorized = Boolean(body?.authenticated);
        if (isAuthorized) {
          loadLeaderboard();
          refreshTimer = window.setInterval(loadLeaderboard, 10_000);
        }
      })
      .catch(() => {
        isAuthorized = false;
      });

    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  });

  $: topThree = riders.slice(0, 3);
  $: totalPoints = riders.reduce((sum, rider) => sum + rider.totalPoints, 0);
  $: totalCheckIns = riders.reduce((sum, rider) => sum + rider.totalCheckIns, 0);
</script>

<main>
  {#if !isAuthorized}
    <section class="panel">
      <h2>{t.title}</h2>
      <p>{t.loading}</p>
      <input
        type="password"
        placeholder="ACROSSR10-MEMBER"
        value={accessCode}
        on:input={(event) => (accessCode = event.currentTarget.value)}
      />
      <button class="auth-btn" on:click={loginForLeaderboard}>Login</button>
      {#if loadError}
        <p>{loadError}</p>
      {/if}
    </section>
  {:else}
  <header class="panel hero-panel">
    <p class="kicker">{t.kicker}</p>
    <h1>{t.title}</h1>
    <p>{t.intro}</p>
    <div class="metrics">
      <span>{t.participants}: {riders.length}</span>
      <span>{t.totalPoints}: {totalPoints}</span>
      <span>{t.totalCheckins}: {totalCheckIns}</span>
    </div>
  </header>

  <section class="panel">
    <h2>{t.podium}</h2>
    {#if isLoading}
      <p>{t.loading}</p>
    {:else if loadError}
      <p>{loadError}</p>
    {:else if topThree.length > 0}
      <div class="podium-grid">
        {#each topThree as rider, idx}
          <article class="podium-card">
            <p class="rank">#{idx + 1}</p>
            <h3>{rider.name}</h3>
            <p>{rider.totalPoints} {t.points}</p>
            <p>{rider.totalCheckIns} {t.checkins} · {rider.uniquePois} {t.poi}</p>
          </article>
        {/each}
      </div>
    {:else}
      <p>{t.noEntries}</p>
    {/if}
  </section>

  <section class="panel">
    <h2>{t.fullRanking}</h2>
    {#if isLoading}
      <p>{t.loading}</p>
    {:else if loadError}
      <p>{loadError}</p>
    {:else if riders.length > 0}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.rank}</th>
              <th>{t.name}</th>
              <th>{t.points}</th>
              <th>{t.checkins}</th>
              <th>{t.poi}</th>
              <th>{t.lastCheckin}</th>
            </tr>
          </thead>
          <tbody>
            {#each riders as rider, idx}
              <tr>
                <td>#{idx + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.totalPoints}</td>
                <td>{rider.totalCheckIns}</td>
                <td>{rider.uniquePois}</td>
                <td>{new Date(rider.lastCheckInAt).toLocaleString($locale)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p>{t.noData}</p>
    {/if}
  </section>

  <section class="panel info-panel">
    <h2>{t.moreInfo}</h2>
    <ul>
      {#each t.notes as note}
        <li>{note}</li>
      {/each}
    </ul>
  </section>
  {/if}
</main>

<style>
  main {
    max-width: 68rem;
    margin: 0 auto;
    padding: 0.5rem 1rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .panel {
    border-radius: 0.9rem;
    padding: 1rem;
    border: 1px solid #d0b390;
    background: linear-gradient(160deg, rgba(248, 238, 224, 0.98), rgba(240, 224, 203, 0.98));
    display: grid;
    gap: 0.6rem;
  }

  .hero-panel {
    border-color: #bd935f;
    background: linear-gradient(160deg, rgba(234, 216, 190, 0.98), rgba(244, 232, 214, 0.98));
  }

  .kicker {
    margin: 0;
    color: #9c7444;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .metrics span {
    border: 1px solid #c8a97e;
    border-radius: 999px;
    padding: 0.3rem 0.65rem;
    background: rgba(247, 237, 222, 0.92);
    font-size: 0.84rem;
  }

  .podium-grid {
    display: grid;
    gap: 0.6rem;
  }

  .podium-card {
    border-radius: 0.75rem;
    border: 1px solid #d1b48f;
    background: rgba(251, 244, 234, 0.95);
    padding: 0.75rem;
    display: grid;
    gap: 0.25rem;
  }

  .rank {
    font-size: 0.9rem;
    font-weight: 700;
    color: #9c7444;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 40rem;
  }

  th,
  td {
    text-align: left;
    padding: 0.55rem 0.5rem;
    border-bottom: 1px solid #ddc6a7;
    font-size: 0.9rem;
  }

  th {
    color: #7c6243;
    font-weight: 700;
  }

  .info-panel ul {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.35rem;
  }

  input {
    border: 1px solid #c9aa82;
    border-radius: 0.65rem;
    background: rgba(251, 245, 236, 0.92);
    color: #4f3a25;
    padding: 0.6rem 0.65rem;
    font: inherit;
    max-width: 20rem;
  }

  .auth-btn {
    width: fit-content;
    border: 1px solid transparent;
    border-radius: 999px;
    background: linear-gradient(135deg, #8b5f36, #6f4829);
    color: #fff9ef;
    padding: 0.4rem 0.75rem;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
  }

  @media (min-width: 760px) {
    .podium-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
