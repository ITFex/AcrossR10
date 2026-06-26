<script>
  const guideStats = [
    { label: 'Rundenlänge', value: '10.4 km' },
    { label: 'Höhenmeter', value: '+180 m' },
    { label: 'Empfohlene Zeit', value: '50-90 min' },
    { label: 'Schwierigkeit', value: 'Leicht-Mittel' }
  ];

  const startPoints = [
    {
      name: 'Bahnhof Bergneustadt',
      note: 'Guter Einstieg mit ÖPNV-Anbindung und Bäcker in Laufweite.',
      parking: 'P+R Westseite, begrenzt kostenfrei',
      surfaces: 'Asphalt / kurze Kopfsteinpflaster-Passage'
    },
    {
      name: 'Sportplatz Derschlag',
      note: 'Schneller Zugang auf den ruhigen Abschnitt entlang der Felder.',
      parking: 'Vereinsparkplatz außerhalb von Spielzeiten',
      surfaces: 'Asphalt / fester Schotter'
    },
    {
      name: 'Kesselweg 2, 51588 Malzhagen',
      note: 'Test-Startpunkt für Geofence-Checks und Onboarding-Flow.',
      parking: 'Straßenrand, bitte Zufahrten freihalten',
      surfaces: 'Asphalt / Waldweg bei Nässe rutschig'
    }
  ];

  const routeSegments = [
    {
      title: 'Segment 1: Warm-up',
      distance: '0-3 km',
      detail: 'Sanfter Einstieg mit breitem Belag. Ideal, um Trittfrequenz und Navigation zu prüfen.'
    },
    {
      title: 'Segment 2: Panorama-Kamm',
      distance: '3-7 km',
      detail: 'Leicht kupiertes Profil mit weitem Blick. Bei Seitenwind defensiv fahren.'
    },
    {
      title: 'Segment 3: Technischer Rückweg',
      distance: '7-10.4 km',
      detail: 'Kurviger, enger Abschnitt mit Wurzelkanten. Blickführung aktiv halten.'
    }
  ];

  const faqItems = [
    {
      q: 'Brauche ich ein Gravelbike?',
      a: 'Nein. Ein Trekking- oder Citybike reicht für den Dummy-Loop aus. Etwas breitere Reifen erhöhen den Komfort.'
    },
    {
      q: 'Wie funktionieren die Check-ins?',
      a: 'Wenn du in den Geofence-Radius eines POI fährst, wird der Button aktiv und du kannst den Check-in auslösen.'
    },
    {
      q: 'Gibt es Verpflegungspunkte?',
      a: 'Für diese Testdaten sind zwei Wasserstopps und ein Café-Halt als Orientierung eingetragen.'
    }
  ];
</script>

<main>
  <header class="panel guide-panel">
    <h1>Routen-Guide</h1>
    <p>
      Strukturierte Dummy-Infos zu Startpunkten, Etappenplanung und Verhalten unterwegs. Inhalte können
      später mit Live-Daten ersetzt werden.
    </p>
  </header>

  <section class="panel guide-panel">
    <h2>Tour-Überblick</h2>
    <div class="stats-grid">
      {#each guideStats as stat}
        <article class="stat-card">
          <p class="stat-label">{stat.label}</p>
          <p class="stat-value">{stat.value}</p>
        </article>
      {/each}
    </div>

    <h3>Startpunkte</h3>
    <div class="info-grid">
      {#each startPoints as point}
        <article class="info-card">
          <h4>{point.name}</h4>
          <p>{point.note}</p>
          <p><strong>Parken:</strong> {point.parking}</p>
          <p><strong>Untergrund:</strong> {point.surfaces}</p>
        </article>
      {/each}
    </div>

    <h3>Etappen und Charakter</h3>
    <ul class="segment-list">
      {#each routeSegments as segment}
        <li>
          <p class="segment-title">{segment.title} <span>{segment.distance}</span></p>
          <p>{segment.detail}</p>
        </li>
      {/each}
    </ul>

    <h3>Kurze Verhaltensregeln</h3>
    <ul class="guidelines-list">
      <li>Früh sichtbar sein: Licht bei Dämmerung, reflektierende Elemente bei Waldpassagen.</li>
      <li>Rücksicht auf Anwohner und Fußgänger, vor allem in engen Ortsdurchfahrten.</li>
      <li>Bei Nässe auf den Schotterstücken Tempo reduzieren und Bremsweg einplanen.</li>
      <li>Notfallkontakt und minimalen Reparaturkit (Schlauch, Pumpe, Multitool) dabeihaben.</li>
    </ul>

    <h3>FAQ</h3>
    <div class="faq-list">
      {#each faqItems as item}
        <article class="faq-item">
          <h4>{item.q}</h4>
          <p>{item.a}</p>
        </article>
      {/each}
    </div>
  </section>
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
    border-radius: 0.75rem;
    padding: 1rem;
    display: grid;
    gap: 0.65rem;
  }

  .guide-panel {
    border: 1px solid #2f4f66;
    background: linear-gradient(160deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.96));
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
  }

  .stat-card {
    border: 1px solid #35566f;
    border-radius: 0.65rem;
    background: rgba(15, 23, 42, 0.6);
    padding: 0.65rem;
    display: grid;
    gap: 0.3rem;
  }

  .stat-label {
    color: #93c5fd;
    font-size: 0.82rem;
  }

  .stat-value {
    font-size: 1.04rem;
    font-weight: 700;
  }

  .info-grid {
    display: grid;
    gap: 0.6rem;
  }

  .info-card {
    border: 1px solid #35566f;
    border-radius: 0.65rem;
    background: rgba(15, 23, 42, 0.45);
    padding: 0.7rem;
    display: grid;
    gap: 0.35rem;
  }

  .info-card h4,
  .faq-item h4 {
    margin: 0;
    font-size: 0.96rem;
  }

  .segment-list,
  .guidelines-list {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.45rem;
  }

  .segment-title {
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
  }

  .segment-title span {
    color: #86efac;
    font-weight: 600;
    white-space: nowrap;
  }

  .faq-list {
    display: grid;
    gap: 0.55rem;
  }

  .faq-item {
    border: 1px dashed #35566f;
    border-radius: 0.65rem;
    padding: 0.65rem;
    background: rgba(12, 18, 34, 0.5);
  }

  @media (min-width: 760px) {
    .stats-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .info-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
