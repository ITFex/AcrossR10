<main>
  <section class="hero panel">
    <div class="hero-copy">
      <p class="kicker">AcrossR10 Performance Hub</p>
      <h1>Trainieren, einchecken, im Ranking angreifen</h1>
      <p>
        Für sportbegeisterte Radfahrer: Schneller Einstieg in Live-Check-ins, ewige Bestenliste,
        Streckenstrategie und Rennsteig-Planung. Alles in einem Flow vor und nach der Ausfahrt.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/checkin">Jetzt Fahrt starten</a>
        <a class="btn btn-secondary" href="/bestenliste">Ranking ansehen</a>
      </div>
    </div>
    <div class="hero-stats" aria-label="Leistungswerte">
      <article>
        <p class="stat-value">169,3 km</p>
        <p class="stat-label">Rennsteig-Distanz</p>
      </article>
      <article>
        <p class="stat-value">∞</p>
        <p class="stat-label">Ewiges Ranking</p>
      </article>
      <article>
        <p class="stat-value">50 m</p>
        <p class="stat-label">Geofence-Zone</p>
      </article>
    </div>
  </section>

  <section class="focus-grid">
    <article class="panel focus-card">
      <p class="mini-kicker">Session</p>
      <h2>Live Check-in</h2>
      <p>Standortfreigabe aktivieren, POI treffen und Punkte sofort sichern.</p>
      <a href="/checkin">Zum Check-in Bereich</a>
    </article>

    <article class="panel focus-card card-highlight">
      <p class="mini-kicker">Competition</p>
      <h2>Ewige Bestenliste</h2>
      <p>Langfristig messen: Punkte, Check-ins und POI-Abdeckung im direkten Vergleich.</p>
      <a href="/bestenliste">Zur Bestenliste</a>
    </article>

    <article class="panel focus-card">
      <p class="mini-kicker">Strategy</p>
      <h2>Routen-Guide</h2>
      <p>Startpunkte, Etappencharakter und Taktik-Hinweise für effizientere Touren.</p>
      <a href="/guide">Zum Guide</a>
    </article>
  </section>

  <section class="grid">
    <article class="panel card">
      <h2>Trainingsmodus Rennsteig</h2>
      <p>
        Plane anspruchsvolle Blöcke entlang des Kamms und nutze Saison-, Anreise- und Sicherheitsinfos
        für stabile Wochenziele.
      </p>
      <a href="/rennsteig">Rennsteig-Daten öffnen</a>
    </article>

    <article class="panel card">
      <h2>So holst du mehr Punkte</h2>
      <ul>
        <li>POIs präzise anfahren, um die Distanzpunkte zu maximieren.</li>
        <li>Regelmäßig einchecken, damit dein Profil im Ranking stabil wächst.</li>
        <li>Guide und Rennsteig-Infos als Wochenplan kombinieren.</li>
      </ul>
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
      radial-gradient(circle at 40% 100%, rgba(251, 191, 36, 0.14), transparent 30%),
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
    background: linear-gradient(160deg, rgba(21, 33, 51, 0.96), rgba(8, 15, 28, 0.96));
    border: 1px solid #345a7e;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(2, 8, 23, 0.34);
  }

  .hero {
    display: grid;
    gap: 1rem;
    border-color: #2b7aa6;
    background:
      linear-gradient(140deg, rgba(6, 78, 114, 0.5), rgba(15, 23, 42, 0.92)),
      radial-gradient(circle at 90% 10%, rgba(34, 197, 94, 0.24), transparent 45%);
    animation: reveal 420ms ease-out;
  }

  .hero-copy {
    display: grid;
    gap: 0.7rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .btn {
    width: fit-content;
    text-decoration: none;
    border-radius: 999px;
    padding: 0.56rem 0.88rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .btn-primary {
    color: #f8fafc;
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
  }

  .btn-secondary {
    color: #e2e8f0;
    background: rgba(15, 23, 42, 0.56);
    border: 1px solid #4b6f92;
  }

  .hero-stats {
    display: grid;
    gap: 0.55rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-stats article {
    border: 1px solid #3e6b90;
    border-radius: 0.75rem;
    background: rgba(15, 23, 42, 0.52);
    padding: 0.55rem;
  }

  .stat-value,
  .stat-label {
    margin: 0;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 800;
    color: #e0f2fe;
  }

  .stat-label {
    font-size: 0.78rem;
    color: #c7d2fe;
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
    font-size: clamp(1.45rem, 2.5vw, 2.3rem);
    max-width: 18ch;
    line-height: 1.08;
  }

  .focus-grid {
    display: grid;
    gap: 0.9rem;
  }

  .focus-card {
    display: grid;
    gap: 0.45rem;
  }

  .mini-kicker {
    margin: 0;
    color: #93c5fd;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .focus-card a,
  .card a {
    width: fit-content;
    text-decoration: none;
    color: #f8fafc;
    background: linear-gradient(135deg, #0284c7, #1d4ed8);
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .grid {
    display: grid;
    gap: 0.9rem;
  }

  .card {
    display: grid;
    gap: 0.45rem;
  }

  .card-highlight {
    border-color: #956f2d;
    background: linear-gradient(160deg, rgba(72, 49, 16, 0.84), rgba(12, 20, 38, 0.95));
  }

  .card ul {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.4rem;
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 860px) {
    .hero {
      grid-template-columns: 1.2fr 0.8fr;
      align-items: stretch;
    }

    .focus-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .grid {
      grid-template-columns: 1.2fr 1fr;
    }
  }
</style>
