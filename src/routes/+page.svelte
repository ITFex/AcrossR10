<main>
  <section class="hero panel">
    <div class="hero-copy">
      <p class="kicker">AcrossR10 Logbook 2026</p>
      <h1>Dein digitales Basislager für den Rennsteig</h1>
      <p>
        Live-Check-ins, Teamtracking und Wettkampfmodus in einer Oberfläche mit klarer Tour-Dramaturgie.
        Vor der Fahrt planen, unterwegs sichern, danach auswerten.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/checkin">Session starten</a>
        <a class="btn btn-secondary" href="/guide">Etappe planen</a>
      </div>
      <div class="hero-strip" aria-label="Saisonstatus">
        <span>Rennsteig-ready</span>
        <span>POI-Fokus</span>
        <span>Teammodus</span>
      </div>
    </div>
    <div class="hero-stats" aria-label="Leistungswerte">
      <article>
        <p class="stat-value">169,3 km</p>
        <p class="stat-label">Rennsteig Distanz</p>
      </article>
      <article>
        <p class="stat-value">2.740 hm</p>
        <p class="stat-label">Hohes Profil</p>
      </article>
      <article>
        <p class="stat-value">50 m</p>
        <p class="stat-label">Geofence Radius</p>
      </article>
      <article>
        <p class="stat-value">∞</p>
        <p class="stat-label">Ewiges Ranking</p>
      </article>
    </div>
  </section>

  <section class="story-grid" aria-label="Etappen-Flow">
    <article class="panel stage-card">
      <p class="mini-kicker">01 Vorbereitung</p>
      <h2>Guide lesen, Taktik wählen</h2>
      <p>Fokus auf Wind, Höhenmeter und die POIs mit dem besten Punktehebel.</p>
      <a href="/guide">Zum Guide</a>
    </article>
    <article class="panel stage-card">
      <p class="mini-kicker">02 Auf der Strecke</p>
      <h2>Live einchecken und sichern</h2>
      <p>Jeder Treffer wird sofort sichtbar und zahlt auf deine Saisonleistung ein.</p>
      <a href="/checkin">Check-in öffnen</a>
    </article>
    <article class="panel stage-card">
      <p class="mini-kicker">03 Nach der Ausfahrt</p>
      <h2>Leaderboard und Teamanalyse</h2>
      <p>Vergleiche Punktedichte, Abdeckung und Konstanz über mehrere Wochen.</p>
      <a href="/bestenliste">Bestenliste sehen</a>
    </article>
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
      <h2>Trainingsmodus: Rennsteig</h2>
      <p>
        Plane harte Blöcke entlang des Kamms, nutze Wetterfenster clever und baue dir eine robuste
        Wochenstruktur statt Einzelaktionen.
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
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@500;600;700;800&display=swap');

  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 1rem 1rem 1.8rem;
    display: grid;
    gap: 1.05rem;
  }

  .panel {
    position: relative;
    overflow: hidden;
    background: linear-gradient(162deg, rgba(250, 241, 229, 0.97), rgba(236, 219, 195, 0.97));
    border: 1px solid rgba(104, 77, 49, 0.34);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 14px 34px rgba(82, 57, 31, 0.17);
  }

  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 38%);
  }

  .hero {
    display: grid;
    gap: 1rem;
    border-color: rgba(130, 93, 51, 0.46);
    background:
      radial-gradient(circle at 18% 2%, rgba(250, 236, 216, 0.74), transparent 42%),
      radial-gradient(circle at 85% 8%, rgba(178, 129, 75, 0.24), transparent 44%),
      linear-gradient(140deg, rgba(224, 205, 177, 0.96), rgba(243, 230, 213, 0.98));
    animation: revealUp 520ms ease-out;
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

  .hero-strip {
    margin-top: 0.3rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .hero-strip span {
    font-size: 0.74rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #65472d;
    border: 1px solid rgba(124, 90, 56, 0.36);
    background: rgba(254, 247, 235, 0.64);
    padding: 0.32rem 0.48rem;
    border-radius: 0.45rem;
  }

  .btn {
    width: fit-content;
    text-decoration: none;
    border-radius: 999px;
    padding: 0.56rem 0.88rem;
    font-size: 0.9rem;
    font-weight: 700;
    transition: transform 140ms ease, box-shadow 140ms ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn-primary {
    color: #fff9ef;
    background: linear-gradient(135deg, #9f6a35, #7d4e29);
    box-shadow: 0 10px 18px rgba(104, 66, 33, 0.3);
  }

  .btn-secondary {
    color: #61462d;
    background: rgba(248, 238, 223, 0.88);
    border: 1px solid rgba(129, 96, 62, 0.38);
  }

  .hero-stats {
    display: grid;
    gap: 0.55rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
  }

  .hero-stats article {
    border: 1px solid rgba(126, 93, 60, 0.34);
    border-radius: 0.75rem;
    background: linear-gradient(180deg, rgba(252, 246, 236, 0.92), rgba(238, 223, 202, 0.9));
    padding: 0.6rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .stat-value,
  .stat-label {
    margin: 0;
  }

  .stat-value {
    font-size: 1.08rem;
    font-weight: 800;
    color: #573e27;
  }

  .stat-label {
    font-size: 0.76rem;
    color: #745538;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .kicker {
    margin: 0;
    color: #84562e;
    text-transform: uppercase;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.11em;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .hero h1 {
    font-size: clamp(1.45rem, 2.5vw, 2.3rem);
    max-width: 20ch;
    line-height: 1.08;
    color: #372515;
  }

  .hero p {
    color: #553c24;
    max-width: 56ch;
  }

  .story-grid {
    display: grid;
    gap: 0.9rem;
    animation: revealUp 700ms ease-out;
  }

  .stage-card {
    display: grid;
    gap: 0.45rem;
    background:
      linear-gradient(140deg, rgba(246, 236, 220, 0.98), rgba(235, 217, 191, 0.95)),
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 0,
        rgba(255, 255, 255, 0.2) 4px,
        transparent 4px,
        transparent 8px
      );
  }

  .stage-card h2 {
    color: #3a2817;
    font-size: 1.38rem;
    line-height: 1.06;
  }

  .stage-card p {
    color: #664a2f;
  }

  .stage-card a {
    width: fit-content;
    text-decoration: none;
    color: #fff8ef;
    background: linear-gradient(136deg, #916133, #7a4d28);
    border-radius: 999px;
    padding: 0.46rem 0.74rem;
    font-size: 0.86rem;
    font-weight: 700;
  }

  .focus-grid {
    display: grid;
    gap: 0.9rem;
    animation: revealUp 840ms ease-out;
  }

  .focus-card {
    display: grid;
    gap: 0.45rem;
  }

  .mini-kicker {
    margin: 0;
    color: #7c5732;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .focus-card h2,
  .card h2 {
    color: #392616;
  }

  .focus-card p,
  .card p,
  .card li {
    color: #62472c;
  }

  .focus-card a,
  .card a {
    width: fit-content;
    text-decoration: none;
    color: #fff9ef;
    background: linear-gradient(135deg, #9a6534, #7b4c29);
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .grid {
    display: grid;
    gap: 0.9rem;
    animation: revealUp 980ms ease-out;
  }

  .card {
    display: grid;
    gap: 0.45rem;
  }

  .card-highlight {
    border-color: rgba(146, 102, 58, 0.52);
    background: linear-gradient(160deg, rgba(228, 205, 172, 0.98), rgba(244, 229, 203, 0.98));
  }

  .card ul {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.4rem;
  }

  @keyframes revealUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 860px) {
    .hero {
      grid-template-columns: 1.22fr 0.78fr;
      align-items: stretch;
    }

    .story-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .focus-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .grid {
      grid-template-columns: 1.2fr 1fr;
    }

    .hero-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    main {
      padding-top: 0.75rem;
      gap: 0.85rem;
    }

    .hero {
      padding: 0.9rem;
    }

    .hero h1 {
      font-size: clamp(1.4rem, 7vw, 1.9rem);
    }

    .hero-stats {
      grid-template-columns: 1fr;
    }

    .story-grid,
    .focus-grid,
    .grid {
      gap: 0.75rem;
    }
  }
</style>
