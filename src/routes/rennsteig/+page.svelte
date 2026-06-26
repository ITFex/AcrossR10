<script>
  import MapPreview3D from '$lib/components/MapPreview3D.svelte';
  import GpxTrackCard from '$lib/components/GpxTrackCard.svelte';

  const routeStats = [
    { label: 'DISTANCE', value: 'ca. 58 km (Sample-Race)' },
    { label: 'DAYS', value: '1' },
    { label: '% UNPAVED', value: '62%' },
    { label: '% SINGLETRACK', value: '18%' },
    { label: '% RIDEABLE', value: '96%' },
    { label: 'TOTAL ASCENT', value: 'ca. 1,250 m' },
    { label: 'HIGH POINT', value: 'ca. 915 m' },
    { label: 'DIFFICULTY', value: '5 / 10' }
  ];

  const routeScale = [
    { label: 'CLIMBING SCALE', value: '18 m/km', detail: 'Steady climbs over long distances' },
    { label: 'TECHNICAL', value: 'MODERATE', detail: 'Roots, loose gravel, wet forest lines' },
    { label: 'PHYSICAL', value: 'MODERATE+', detail: 'Long days with repeated elevation gain' },
    { label: 'LOGISTICS', value: 'EASY', detail: 'Villages and stations are regularly spaced' }
  ];

  const contributor = {
    name: 'AcrossR10 Editorial Team',
    role: 'Route Curation',
    bio: 'Lokale Community-Rider und Tourenplaner, die den Rennsteig als Bikepacking-Linie fuhrbar, sicher und etappentauglich dokumentieren.'
  };

  const startPoints = [
    {
      name: 'Hörschel (bei Eisenach)',
      reason: 'Traditioneller Einstieg mit Symbolstart am Rennsteigbeginn.',
      logistics: 'Bahnhof Eisenach + kurzer Zubringer'
    },
    {
      name: 'Oberhof',
      reason: 'Zentraler Einstieg mit vielen Unterkünften und Bike-freundlicher Infrastruktur.',
      logistics: 'Sehr gute Erreichbarkeit via A71'
    },
    {
      name: 'Neuhaus am Rennweg',
      reason: 'Starker Hub für Mittelabschnitte mit flexiblen Rundtour-Optionen.',
      logistics: 'Mehrere Einstiegspunkte + Parken im Ort'
    }
  ];

  const highlights = [
    'Eintagiges Rennformat mit frei wahlbarer Startzeit innerhalb des Eventfensters',
    'Teilnahme solo oder in selbst organisierter Kleingruppe moglich',
    'Markante Punkte wie Burg Elgersburg, Mönchhof und Aussichtspassagen',
    'Technisch moderat mit hoher Fahrfrequenz auf wechselnden Walduntergrunden'
  ];

  const mustKnow = [
    'Die Veranstaltung ist als One-Day-Race geplant: kein offizieller Massenstart.',
    'Jede Person oder Gruppe fahrt in Eigenverantwortung mit eigener Navigation.',
    'Tracknachweis uber GPX-Aufzeichnung (z. B. Bikecomputer/Komoot/Garmin).',
    'Offline-Karte + GPX sind auf Teilstucken ohne stabiles Netz Pflicht.'
  ];

  const stageNotes = [
    {
      title: 'Westabschnitt: Hörschel → Oberhof',
      profile: 'Langer Anstieg, stetiger Hohengewinn, fordernde Forstwege.',
      hint: 'Fruh starten und Verpflegung fur langere Distanz mitnehmen.'
    },
    {
      title: 'Mittelteil: Oberhof -> Neuhaus',
      profile: 'Abwechslungsreiche Kammwege, offene Landschaft und Waldwechsel.',
      hint: 'Bei Nebel Navigation auf Trackbasis nutzen.'
    },
    {
      title: 'Ostteil: Neuhaus -> Blankenstein',
      profile: 'Flüssigeres Terrain mit schnellen Abschnitten und Ortsdurchfahrten.',
      hint: 'Auf touristischen Teilstücken frühzeitig Geschwindigkeit anpassen.'
    }
  ];

  const raceOrga = [
    {
      title: 'Startfenster',
      text: 'Empfohlenes Startfenster 06:00-10:00 Uhr, damit alle vor Einbruch der Dunkelheit im Ziel sind.'
    },
    {
      title: 'Teilnahmeformat',
      text: 'Solo oder als selbst organisierte Gruppe (2-8 Personen) mit gemeinsamer Sicherheitsabsprache.'
    },
    {
      title: 'Wertungsidee',
      text: 'Finisher-Event: Ziel ist die komplette Strecke in einem Tag. Optional Ranking nach Nettofahrzeit.'
    },
    {
      title: 'Sicherheit',
      text: 'Helm, Licht, Erste-Hilfe-Basics, Mobilakku und Notfallkontakt sind verpflichtend empfohlen.'
    }
  ];

  const faqItems = [
    {
      q: 'Kann ich auch allein starten?',
      a: 'Ja. Das Event ist explizit fur Solo-Starts und Gruppenstarts ohne zentrale Formation ausgelegt.'
    },
    {
      q: 'Darf ich in einer spontanen Gruppe fahren?',
      a: 'Ja. Gruppen konnen sich selbst organisieren. Tempo, Pausen und Navigation werden eigenstandig abgestimmt.'
    },
    {
      q: 'Wie wird die absolvierte Strecke nachgewiesen?',
      a: 'Uber eine durchgehende GPX-Aufzeichnung plus Zieleintrag im Event-Check-in.'
    },
    {
      q: 'Gibt es eine Abbruchstrategie?',
      a: 'Ja. Mehrere Orte entlang der Strecke haben Taxi-/Bahn-/Busoptionen fur einen sicheren Ruckweg.'
    }
  ];

  const aidStations = [
    {
      name: 'Gasthaus Mönchhof',
      type: 'Einkehr / Wasser / warme Speisen',
      hint: 'Sinnvoller Mid-Race-Stopp im westlichen Mittelteil.'
    },
    {
      name: 'Schmiedefeld am Rennsteig',
      type: 'Bäcker / Markt / Gastronomie',
      hint: 'Sehr guter Vor- und Nachversorgungs-Hub mit kurzer Distanz zu Unterkunften.'
    },
    {
      name: 'Elgersburg (Ortsbereich)',
      type: 'Nahversorgung / Brunnen / Gastro',
      hint: 'Flexible Nachfulloption kurz vor den langere Waldpassagen.'
    }
  ];

  const accommodations = [
    {
      area: 'Schmiedefeld am Rennsteig',
      text: 'Ideal als Race-Base fur Anreise am Vortag und Regeneration nach dem Zieleinlauf.'
    },
    {
      area: 'Oberhof',
      text: 'Gute Auswahl an Hotels/Pensionen, geeignet fur Teams oder Begleitpersonen.'
    },
    {
      area: 'Neuhaus am Rennweg',
      text: 'Ruhigere Alternative mit guter Erreichbarkeit fur pre-/post-race Ubernachtung.'
    }
  ];

  const camping = [
    'Basislager in Oberhof oder Neuhaus fur sternformige Tagesloops.',
    'Vorab prufen, welche Unterkunfte sicheren Bike-Abstellraum anbieten.',
    'Bei Biwak-Planung nur freigegebene Flachen und lokale Regeln beachten.'
  ];

  const foodAndWater = [
    'Regelmasig Nachfullen in Ortschaften einplanen, nicht auf einzelne Quellen verlassen.',
    'Wochenenden bieten bessere Einkehrdichte als ruhige Wochentage.',
    'Energiereserve fur 2-3 Stunden extra Fahrzeit mitfuhren.'
  ];

  const resources = [
    'Rennsteig-Shuttle und regionale Fahrplane fur Rucktransfers',
    'Lokale Wetter- und Wegesperrungsinfos aus den Tourismusorten',
    'Saisonhinweise zu Waldarbeiten und Forstsperrungen'
  ];

  const gallery = [
    { title: 'Morgenlicht am Kamm', tone: 'tone-a' },
    { title: 'Forstpassage Richtung Oberhof', tone: 'tone-b' },
    { title: 'Schneller Ostteil bei Neuhaus', tone: 'tone-c' },
    { title: 'Abendstimmung vor Blankenstein', tone: 'tone-d' }
  ];

  const rennsteigPreviewPoints = [
    { x: 0, y: 0, elevation: 300, label: 'Hörschel' },
    { x: 18, y: 6, elevation: 520, label: 'Ruhla' },
    { x: 34, y: 10, elevation: 780, label: 'Inselsberg-Region' },
    { x: 48, y: 18, elevation: 840, label: 'Oberhof' },
    { x: 66, y: 23, elevation: 720, label: 'Schmiedefeld' },
    { x: 82, y: 29, elevation: 760, label: 'Neuhaus' },
    { x: 100, y: 36, elevation: 500, label: 'Blankenstein' }
  ];
</script>

<main>
  <header class="hero">
    <p class="meta-line">LOCATION THURINGIA, GERMANY</p>
    <h1>Rennsteig One-Day Race</h1>
    <p class="dek">
      Das Event ist als eintagiges Rennen gestaltet und kann individuell solo oder in selbst
      organisierten Gruppen gefahren werden. Der bereitgestellte GPX-Track bildet die verbindliche
      Rennlinie fur Navigation und Nachweis.
    </p>
    <figure class="hero-art">
      <img
        src="/42BD92FD-A239-43C8-809F-06FAD4024551_1_105_c.jpeg"
        alt="Rennsteig Strecke im Wald"
        loading="eager"
      />
    </figure>
    <div class="route-stats" aria-label="Routenmetriken">
      {#each routeStats as metric}
        <article>
          <p class="label">{metric.label}</p>
          <p class="value">{metric.value}</p>
        </article>
      {/each}
    </div>
  </header>

  <section class="article-grid">
    <article class="narrative">
      <h2>Route Difficulty</h2>
      <p>
        Das One-Day-Race ist fahrtechnisch moderat, konditionell jedoch anspruchsvoll durch Dauer,
        Hohenmeter und wechselnde Bodenverhaltnisse. Gute Pacing-Strategie und verlassliche
        Eigenverpflegung machen den Unterschied im letzten Renndrittel.
      </p>

      <div class="scale-grid">
        {#each routeScale as scale}
          <article class="scale-card">
            <p class="scale-label">{scale.label}</p>
            <p class="scale-value">{scale.value}</p>
            <p class="scale-detail">{scale.detail}</p>
          </article>
        {/each}
      </div>

      <h2>Highlights</h2>
      <ul class="text-list">
        {#each highlights as item}
          <li>{item}</li>
        {/each}
      </ul>

      <h2>Must Know</h2>
      <ul class="text-list">
        {#each mustKnow as note}
          <li>{note}</li>
        {/each}
      </ul>

      <h2>Trail Notes</h2>
      <div class="stage-list">
        {#each stageNotes as stage}
          <article>
            <h3>{stage.title}</h3>
            <p><strong>Profil:</strong> {stage.profile}</p>
            <p><strong>Tipp:</strong> {stage.hint}</p>
          </article>
        {/each}
      </div>

      <h2>Map & GPS</h2>
      <GpxTrackCard
        gpxPath="/rennsteig-race.gpx"
        title="GPX Beispieltrack: Burg Elgersburg - Gasthaus Mönchhof Runde"
      />

      <MapPreview3D title="3D Map Vorschau der Strecke" points={rennsteigPreviewPoints} />

      <p>
        Download des Original-GPX:
        <a class="inline-link" href="/rennsteig-race.gpx" download>rennsteig-race.gpx</a>
      </p>

      <h2>Organisation</h2>
      <div class="faq-list">
        {#each raceOrga as item}
          <article class="faq-item">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        {/each}
      </div>

      <div class="split-list">
        <section>
          <h3>Übernachtungsmöglichkeiten</h3>
          <div class="faq-list">
            {#each accommodations as place}
              <article class="faq-item">
                <h4>{place.area}</h4>
                <p>{place.text}</p>
              </article>
            {/each}
          </div>

          <h3>Camping / Unterkunft</h3>
          <ul class="text-list compact">
            {#each camping as item}
              <li>{item}</li>
            {/each}
          </ul>
        </section>

        <section>
          <h3>Verpflegungsstationen</h3>
          <div class="faq-list">
            {#each aidStations as station}
              <article class="faq-item">
                <h4>{station.name}</h4>
                <p><strong>Typ:</strong> {station.type}</p>
                <p>{station.hint}</p>
              </article>
            {/each}
          </div>

          <h3>Food / H2O</h3>
          <ul class="text-list compact">
            {#each foodAndWater as item}
              <li>{item}</li>
            {/each}
          </ul>
        </section>
      </div>

      <h3>Resources</h3>
      <ul class="text-list compact">
        {#each resources as item}
          <li>{item}</li>
        {/each}
      </ul>

      <h2>FAQ</h2>
      <div class="faq-list">
        {#each faqItems as item}
          <article class="faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        {/each}
      </div>

      <h2>Photo Gallery</h2>
      <div class="gallery-grid">
        {#each gallery as frame}
          <figure class={`gallery-frame ${frame.tone}`}>
            <figcaption>{frame.title}</figcaption>
          </figure>
        {/each}
      </div>

      <p class="terms">
        Terms of use: Die Route ist eine Planungsgrundlage. Vor der Fahrt aktuelle Bedingungen,
        Sperrungen und Wetterlage prufen und die Strecke auf eigenes Risiko befahren.
      </p>
    </article>

    <aside class="sidebar">
      <section class="contributor-card">
        <p class="card-kicker">CONTRIBUTED BY</p>
        <h3>{contributor.name}</h3>
        <p class="role">{contributor.role}</p>
        <p>{contributor.bio}</p>
      </section>

      <section class="quick-card">
        <h3>Startpunkte</h3>
        {#each startPoints as option}
          <article class="quick-item">
            <h4>{option.name}</h4>
            <p>{option.reason}</p>
            <p><strong>Logistik:</strong> {option.logistics}</p>
          </article>
        {/each}
      </section>

      <section class="quick-card">
        <h3>Quick Actions</h3>
        <a class="ghost-btn" href="/checkin">Check-in starten</a>
        <a class="ghost-btn" href="/mitglieder">Mitglieder LiveTracking</a>
        <a class="ghost-btn" href="/guide">Route Guide</a>
      </section>
    </aside>
  </section>
</main>

<style>
  :global(body) {
    background:
      radial-gradient(circle at 14% -2%, rgba(161, 190, 138, 0.22), transparent 34%),
      radial-gradient(circle at 94% 8%, rgba(205, 157, 92, 0.18), transparent 35%),
      #efe7d7;
    color: #2f2a21;
  }

  main {
    max-width: 72rem;
    margin: 0 auto;
    padding: 0.8rem 1rem 2rem;
    display: grid;
    gap: 1.2rem;
  }

  .hero {
    border: 1px solid #beb295;
    border-radius: 0.85rem;
    background: rgba(243, 236, 223, 0.88);
    padding: 1.1rem;
    display: grid;
    gap: 0.8rem;
  }

  .meta-line {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.11em;
    font-weight: 700;
    color: #6f644f;
  }

  h1,
  h2,
  h3,
  h4,
  p {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: 'Fraunces', 'Iowan Old Style', 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  h1 {
    font-size: clamp(1.7rem, 3.2vw, 2.7rem);
    line-height: 1;
  }

  .dek {
    max-width: 70ch;
    line-height: 1.45;
    color: #4c4437;
  }

  .hero-art {
    margin: 0;
    min-height: 13rem;
    border-radius: 0.7rem;
    border: 1px solid #bbac8d;
    overflow: hidden;
    background: #d8ccb4;
  }

  .hero-art img {
    display: block;
    width: 100%;
    min-height: 13rem;
    max-height: 24rem;
    object-fit: cover;
    object-position: center;
  }

  .route-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .route-stats article {
    border-top: 1px solid #cabf9f;
    padding-top: 0.5rem;
  }

  .label {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: #716653;
    font-weight: 700;
    text-transform: uppercase;
  }

  .value {
    font-size: 1.03rem;
    font-weight: 700;
    color: #29241d;
  }

  .article-grid {
    display: grid;
    gap: 1rem;
  }

  .narrative,
  .sidebar {
    display: grid;
    gap: 1rem;
  }

  .narrative {
    border: 1px solid #c9bb9b;
    border-radius: 0.85rem;
    background: rgba(250, 246, 238, 0.88);
    padding: 1rem;
  }

  .narrative > p {
    line-height: 1.55;
    color: #433c31;
  }

  .scale-grid {
    display: grid;
    gap: 0.6rem;
  }

  .scale-card {
    border: 1px solid #d0c4a6;
    border-radius: 0.7rem;
    padding: 0.7rem;
    background: rgba(245, 240, 231, 0.92);
    display: grid;
    gap: 0.2rem;
  }

  .scale-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7f715a;
    font-weight: 700;
  }

  .scale-value {
    font-size: 1rem;
    font-weight: 700;
    color: #2e281f;
  }

  .scale-detail {
    font-size: 0.84rem;
    color: #5c5344;
  }

  .text-list {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.45rem;
    color: #4f473a;
  }

  .compact {
    gap: 0.35rem;
  }

  .stage-list {
    display: grid;
    gap: 0.55rem;
  }

  .stage-list article {
    border-left: 3px solid #ad9366;
    padding: 0.25rem 0 0.25rem 0.7rem;
    display: grid;
    gap: 0.15rem;
  }

  .split-list {
    display: grid;
    gap: 0.8rem;
  }

  .faq-list {
    display: grid;
    gap: 0.55rem;
  }

  .faq-item {
    border: 1px dashed #ccb693;
    border-radius: 0.65rem;
    background: rgba(245, 238, 227, 0.9);
    padding: 0.65rem;
    display: grid;
    gap: 0.25rem;
  }

  .inline-link {
    color: #6a4526;
    font-weight: 700;
  }

  .gallery-grid {
    display: grid;
    gap: 0.55rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery-frame {
    margin: 0;
    border-radius: 0.75rem;
    border: 1px solid #bfae8b;
    min-height: 8.6rem;
    display: flex;
    align-items: end;
    padding: 0.65rem;
    position: relative;
    overflow: hidden;
  }

  .gallery-frame::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0.06));
  }

  .gallery-frame figcaption {
    position: relative;
    color: #f8f4ea;
    font-weight: 700;
    font-size: 0.83rem;
    z-index: 1;
  }

  .tone-a {
    background: linear-gradient(130deg, #728f6f, #3f6144);
  }

  .tone-b {
    background: linear-gradient(130deg, #9b835f, #6f5a3d);
  }

  .tone-c {
    background: linear-gradient(130deg, #5d7d84, #35545a);
  }

  .tone-d {
    background: linear-gradient(130deg, #9b744f, #5f442f);
  }

  .terms {
    font-size: 0.8rem;
    line-height: 1.45;
    color: #706551;
    border-top: 1px solid #d2c7ac;
    padding-top: 0.8rem;
  }

  .sidebar {
    align-content: start;
  }

  .contributor-card,
  .quick-card {
    border: 1px solid #cabd9f;
    border-radius: 0.8rem;
    background: rgba(247, 241, 230, 0.92);
    padding: 0.85rem;
    display: grid;
    gap: 0.45rem;
  }

  .card-kicker {
    font-size: 0.69rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #756952;
  }

  .role {
    color: #645945;
    font-weight: 700;
    font-size: 0.82rem;
  }

  .quick-item {
    border-top: 1px dashed #d2c4a5;
    padding-top: 0.5rem;
    display: grid;
    gap: 0.2rem;
  }

  .ghost-btn {
    text-decoration: none;
    color: #2f281f;
    border: 1px solid #b9a47c;
    border-radius: 999px;
    padding: 0.42rem 0.68rem;
    width: fit-content;
    background: rgba(240, 230, 211, 0.85);
    font-size: 0.86rem;
    font-weight: 700;
  }

  .ghost-btn:hover {
    background: #b27f45;
    color: #fff8ed;
    border-color: transparent;
  }

  @media (min-width: 760px) {
    .route-stats {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .scale-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .split-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 980px) {
    .article-grid {
      grid-template-columns: minmax(0, 2fr) minmax(17rem, 1fr);
      align-items: start;
    }

    .sidebar {
      position: sticky;
      top: 5.4rem;
    }
  }
</style>
