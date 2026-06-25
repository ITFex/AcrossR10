<main>
  <section class="hero panel">
    <p class="kicker">Kompakter Einstieg</p>
    <h1>Tourinfos und Check-ins jetzt sauber getrennt</h1>
    <p>
      Die Startseite zeigt nur die wichtigsten Einstiege. Detaillierte Inhalte findest du auf den
      Unterseiten fuer Check-in, Streckenguide und Rennsteig.
    </p>
  </section>

  <section class="grid">
    <article class="panel card">
      <h2>Live Check-in</h2>
      <p>Standortfreigabe, naechsten POI sehen und direkt einchecken.</p>
      <a href="/checkin">Zum Check-in Bereich</a>
    </article>

    <article class="panel card">
      <h2>Routen-Guide</h2>
      <p>Startpunkte, Etappencharakter, Verhalten unterwegs und FAQ.</p>
      <a href="/guide">Zum Guide</a>
    </article>

    <article class="panel card">
      <h2>Rennsteig Wissen</h2>
      <p>Planungsdaten fuer den Rennsteig in Thueringen, inkl. Saison und Sicherheit.</p>
      <a href="/rennsteig">Zur Rennsteig-Seite</a>
    </article>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', 'Avenir Next', system-ui, sans-serif;
    color: #f8fafc;
    background:
      radial-gradient(circle at 15% 0%, rgba(34, 197, 94, 0.24), transparent 30%),
      radial-gradient(circle at 85% 10%, rgba(14, 165, 233, 0.22), transparent 36%),
      #0f172a;
  }

  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0.5rem 1rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .panel {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.85rem;
    padding: 1rem;
  }

  .hero {
    display: grid;
    gap: 0.45rem;
  }

  .kicker {
    margin: 0;
    color: #67e8f9;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.09em;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .hero h1 {
    font-size: clamp(1.3rem, 2vw, 1.9rem);
  }

  .grid {
    display: grid;
    gap: 0.9rem;
  }

  .card {
    display: grid;
    gap: 0.45rem;
  }

  .card a {
    width: fit-content;
    text-decoration: none;
    color: #f8fafc;
    background: linear-gradient(135deg, #0284c7, #2563eb);
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  @media (min-width: 860px) {
    .grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
