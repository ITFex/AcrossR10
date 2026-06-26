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

    <article class="panel focus-card">
      <p class="mini-kicker">3D Preview</p>
      <h2>Streckenvorschau</h2>
      <p>Isometrische 3D Map Vorschau der Rennsteig-Strecke inkl. Höhenprofil.</p>
      <a href="/rennsteig">3D Vorschau öffnen</a>
    </article>

    <article class="panel focus-card card-highlight">
      <p class="mini-kicker">Members</p>
      <h2>Internes LiveTracking</h2>
      <p>Nur für Mitglieder: aktuelle Positionen in einer Live-Karte verfolgen.</p>
      <a href="/mitglieder">Zum Mitgliederbereich</a>
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
    color: #4f3a25;
    background:
      radial-gradient(circle at 15% 0%, rgba(205, 170, 130, 0.24), transparent 32%),
      radial-gradient(circle at 85% 10%, rgba(185, 149, 108, 0.22), transparent 38%),
      radial-gradient(circle at 40% 100%, rgba(221, 194, 162, 0.28), transparent 34%),
      #f3e7d5;
  }

  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0.5rem 1rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .panel {
    background: linear-gradient(160deg, rgba(248, 238, 224, 0.98), rgba(239, 223, 203, 0.98));
    border: 1px solid #d2b691;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 12px 30px rgba(125, 96, 66, 0.16);
  }

  .hero {
    display: grid;
    gap: 1rem;
    border-color: #c39a66;
    background:
      linear-gradient(140deg, rgba(233, 215, 189, 0.95), rgba(245, 236, 223, 0.98)),
      radial-gradient(circle at 90% 10%, rgba(183, 140, 94, 0.22), transparent 45%);
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
    color: #fff9ef;
    background: linear-gradient(135deg, #b8824a, #9f6f3d);
  }

  .btn-secondary {
    color: #6a5033;
    background: rgba(246, 236, 220, 0.88);
    border: 1px solid #c8aa83;
  }

  .hero-stats {
    display: grid;
    gap: 0.55rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-stats article {
    border: 1px solid #d2b38d;
    border-radius: 0.75rem;
    background: rgba(250, 242, 231, 0.94);
    padding: 0.55rem;
  }

  .stat-value,
  .stat-label {
    margin: 0;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 800;
    color: #5f452a;
  }

  .stat-label {
    font-size: 0.78rem;
    color: #8b6a48;
  }

  .kicker {
    margin: 0;
    color: #9c7444;
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
    color: #8d6a42;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .focus-card a,
  .card a {
    width: fit-content;
    text-decoration: none;
    color: #fff9ef;
    background: linear-gradient(135deg, #b8824a, #9f6f3d);
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
    border-color: #b58a58;
    background: linear-gradient(160deg, rgba(232, 213, 185, 0.98), rgba(243, 229, 208, 0.98));
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
