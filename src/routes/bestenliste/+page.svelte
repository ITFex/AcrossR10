<script>
  import { onMount } from 'svelte';
  import leaderboard from '$lib/stores/leaderboard';

  onMount(() => {
    leaderboard.initialize();
  });

  $: riders = $leaderboard.riders || [];
  $: topThree = riders.slice(0, 3);
  $: totalPoints = riders.reduce((sum, rider) => sum + rider.totalPoints, 0);
  $: totalCheckIns = riders.reduce((sum, rider) => sum + rider.totalCheckIns, 0);
</script>

<main>
  <header class="panel hero-panel">
    <p class="kicker">Hall of Fame</p>
    <h1>Ewige Bestenliste</h1>
    <p>
      Alle Punkte aus Check-ins werden dauerhaft lokal gespeichert. Je näher der Check-in am POI liegt,
      desto höher die Punktzahl pro Eintrag.
    </p>
    <div class="metrics">
      <span>Teilnehmende: {riders.length}</span>
      <span>Gesamtpunkte: {totalPoints}</span>
      <span>Check-ins gesamt: {totalCheckIns}</span>
    </div>
  </header>

  <section class="panel">
    <h2>Podium</h2>
    {#if topThree.length > 0}
      <div class="podium-grid">
        {#each topThree as rider, idx}
          <article class="podium-card">
            <p class="rank">#{idx + 1}</p>
            <h3>{rider.name}</h3>
            <p>{rider.totalPoints} Punkte</p>
            <p>{rider.totalCheckIns} Check-ins · {rider.uniquePois} POIs</p>
          </article>
        {/each}
      </div>
    {:else}
      <p>Noch keine Einträge. Starte auf der Check-in-Seite und sammle die ersten Punkte.</p>
    {/if}
  </section>

  <section class="panel">
    <h2>Komplette Rangliste</h2>
    {#if riders.length > 0}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Name</th>
              <th>Punkte</th>
              <th>Check-ins</th>
              <th>POIs</th>
              <th>Letzter Check-in</th>
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
                <td>{new Date(rider.lastCheckInAt).toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p>Keine Daten vorhanden.</p>
    {/if}
  </section>

  <section class="panel info-panel">
    <h2>Weitere Infos</h2>
    <ul>
      <li>Punktelogik pro Check-in: mindestens 10, maximal 100 Punkte.</li>
      <li>Die Punkteberechnung nutzt die Distanz zum Ziel-POI zum Check-in-Zeitpunkt.</li>
      <li>Bei Gleichstand zählt zuerst die Anzahl der Check-ins, danach der Name.</li>
      <li>Die Speicherung erfolgt lokal im Browser und bleibt beim Neuladen erhalten.</li>
    </ul>
  </section>
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

  @media (min-width: 760px) {
    .podium-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
