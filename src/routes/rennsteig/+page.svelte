<script>
  const rennsteigFacts = [
    { label: 'Länge (gesamt)', value: '169,3 km' },
    { label: 'Region', value: 'Thüringer Wald, Schiefergebirge, Frankenwald' },
    { label: 'Klassische Richtung', value: 'Hörschel → Blankenstein' },
    { label: 'Empfohlene Bike-Tage', value: '2-4 Etappen' }
  ];

  const rennsteigStartOptions = [
    {
      name: 'Hörschel (bei Eisenach)',
      reason: 'Traditioneller Einstieg mit Symbolstart am Rennsteigbeginn.',
      logistics: 'Bahnhofsnähe in Eisenach, kurze Anfahrt zum Startpunkt.'
    },
    {
      name: 'Oberhof',
      reason: 'Zentraler Einstieg mit vielen Unterkünften und Bike-freundlicher Infrastruktur.',
      logistics: 'Gute Erreichbarkeit über A71 und Regionalverkehr.'
    },
    {
      name: 'Neuhaus am Rennweg',
      reason: 'Starker Hub für Mittelabschnitte mit flexiblen Rundtour-Optionen.',
      logistics: 'Parken im Ort, mehrere Einstiegspunkte in kurzer Distanz.'
    }
  ];

  const rennsteigEtappen = [
    {
      title: 'Westabschnitt: Hörschel → Oberhof',
      profile: 'Langer Anstieg, stetiger Höhengewinn, fordernde Forstwege.',
      hint: 'Früh starten und Verpflegung für längere Distanz mitnehmen.'
    },
    {
      title: 'Mittelteil: Oberhof -> Neuhaus am Rennweg',
      profile: 'Abwechslungsreiche Kammwege, offene Landschaft und Waldwechsel.',
      hint: 'Bei Nebel Navigation auf Trackbasis nutzen.'
    },
    {
      title: 'Ostteil: Neuhaus -> Blankenstein',
      profile: 'Flüssigeres Terrain mit schnellen Abschnitten und Ortsdurchfahrten.',
      hint: 'Auf touristischen Teilstücken frühzeitig Geschwindigkeit anpassen.'
    }
  ];

  const rennsteigSeasonTips = [
    'Mai bis Oktober ist in der Regel die verlässlichste Bike-Saison am Rennsteig.',
    'Nach Starkregen einzelne Waldwege meiden oder defensiv fahren.',
    'Im Herbst mit nassem Laub und eingeschränkter Sicht in den Wäldern rechnen.',
    'Wasserpunkte und Einkehr sind nicht auf jeder Etappe eng getaktet verfügbar.'
  ];

  const rennsteigSafetyChecklist = [
    'Offline-Karte und GPX-Track auf dem Gerät und als Backup gespeichert',
    'Wetterschutzschicht, da Bedingungen entlang des Kamms schnell wechseln',
    'Lichtanlage auch tagsüber dabeihaben (Nebel- und Waldpassagen)',
    'Notfallnummern und Standortfreigabe vor längeren Solotouren abstimmen'
  ];

  const arrivalOptions = [
    'Anreise mit dem Auto über A4, A71 und A73; von den Abfahrten führen Landstraßen in die Rennsteig-Orte.',
    'Die A71 quert den Thüringer Wald durch den Rennsteigtunnel (7.916 m Länge).',
    'Viele Orte entlang des Kamms haben Bahnhöfe oder Shuttle-Anbindungen, etwa über die Erfurter Bahn und den Rennsteig-Shuttle.',
    'Für flexible Rückfahrten lohnt sich die Kombination aus Bahn und Bus (z. B. regionale Verkehrsverbünde in Thüringen).'
  ];

  const hikingAndBikeFormats = [
    {
      title: 'Etappenweise Touren',
      text: 'Klassisch in mehreren Tagesabschnitten von Hörschel bis Blankenstein mit Übernachtungen entlang der Strecke.'
    },
    {
      title: 'Wandern ohne Gepäck',
      text: 'Mehrere Anbieter organisieren Gepäcktransfer zwischen den Unterkünften.'
    },
    {
      title: 'Rundtour mit Basislager',
      text: 'Ein fester Standort (z. B. Oberhof oder Neuhaus) eignet sich gut für sternförmige Tagesausfahrten.'
    }
  ];

  const winterHighlights = [
    'Rennsteig-Skiwanderweg: rund 140 km (Ascherbrück bei Ruhla bis Brennersgrün bei Lehesten), je nach Schneelage gespurt.',
    'Thüringer Schneetelefon mit Infos zu Schneehöhen, geöffneten Loipen und Liften: 0800 7236488.',
    'Zusätzliche Winteraktivitäten: Schneeschuhwandern, Rodeln, Snowtubing und Winterwanderungen.',
    'Viele Orte bieten saisonale Unterkünfte und Winterpakete für kurze und längere Aufenthalte.'
  ];

  const infrastructureFacts = [
    'Auf rennsteig.de werden über 300 Unterkünfte gelistet (u. a. Hotels, Pensionen, Ferienwohnungen, Ferienhäuser, Campingplätze).',
    'Es gibt eigene Bereiche zu Etappenplanung, Karten, Wetter, Regionen/Orten und Reiseberichten.',
    'Für die Planung hilfreich: Etappenübersicht mit acht Hauptetappen für die klassische Wanderroute.'
  ];
</script>

<main>
  <header class="panel rennsteig-panel">
    <h1>Rennsteig in Thüringen</h1>
    <p>
      Ausgebauter Planungsbereich für Touren rund um den Rennsteig mit zusätzlichen Informationen zu
      Verlauf, Etappen, Anreise, Infrastruktur und Winterbetrieb.
    </p>
  </header>

  <section class="panel rennsteig-panel">
    <h2>Rennsteig-Fakten</h2>
    <div class="stats-grid">
      {#each rennsteigFacts as fact}
        <article class="stat-card stat-card-strong">
          <p class="stat-label">{fact.label}</p>
          <p class="stat-value">{fact.value}</p>
        </article>
      {/each}
    </div>

    <h3>Geeignete Startpunkte</h3>
    <div class="info-grid">
      {#each rennsteigStartOptions as option}
        <article class="info-card info-card-strong">
          <h4>{option.name}</h4>
          <p>{option.reason}</p>
          <p><strong>Logistik:</strong> {option.logistics}</p>
        </article>
      {/each}
    </div>

    <h3>Anreise kompakt</h3>
    <ul class="guidelines-list">
      {#each arrivalOptions as option}
        <li>{option}</li>
      {/each}
    </ul>

    <h3>Abschnitte mit Charakter</h3>
    <div class="faq-list">
      {#each rennsteigEtappen as stage}
        <article class="faq-item faq-item-strong">
          <h4>{stage.title}</h4>
          <p><strong>Profil:</strong> {stage.profile}</p>
          <p><strong>Tipp:</strong> {stage.hint}</p>
        </article>
      {/each}
    </div>

    <h3>Saison und Bedingungen</h3>
    <ul class="guidelines-list">
      {#each rennsteigSeasonTips as tip}
        <li>{tip}</li>
      {/each}
    </ul>

    <h3>Tourformate</h3>
    <div class="faq-list">
      {#each hikingAndBikeFormats as format}
        <article class="faq-item faq-item-strong">
          <h4>{format.title}</h4>
          <p>{format.text}</p>
        </article>
      {/each}
    </div>

    <h3>Winter am Rennsteig</h3>
    <ul class="guidelines-list">
      {#each winterHighlights as winterItem}
        <li>{winterItem}</li>
      {/each}
    </ul>

    <h3>Infrastruktur und Planung</h3>
    <ul class="guidelines-list">
      {#each infrastructureFacts as infra}
        <li>{infra}</li>
      {/each}
    </ul>

    <h3>Sicherheits-Check vor dem Start</h3>
    <ul class="guidelines-list">
      {#each rennsteigSafetyChecklist as check}
        <li>{check}</li>
      {/each}
    </ul>

    <p class="source-note">
      Quellenhinweis: Die zusätzlichen Fakten wurden auf Basis öffentlich verfügbarer Informationen von
      rennsteig.de (u. a. Bereiche „Anreise“, „Wandern“, „Winter“) zusammengefasst.
    </p>
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

  .rennsteig-panel {
    border: 1px solid #3f6f4f;
    background:
      linear-gradient(160deg, rgba(18, 42, 29, 0.92), rgba(15, 23, 42, 0.94)),
      radial-gradient(circle at 10% 10%, rgba(134, 239, 172, 0.18), transparent 36%);
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

  .stat-card-strong {
    border-color: #3d7550;
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

  .info-card-strong {
    border-color: #3d7550;
    background: rgba(13, 32, 22, 0.5);
  }

  .guidelines-list {
    margin: 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.45rem;
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

  .faq-item-strong {
    border-color: #4e8e65;
    background: rgba(13, 30, 21, 0.58);
  }

  .source-note {
    margin-top: 0.4rem;
    font-size: 0.86rem;
    line-height: 1.45;
    color: #c8e6d2;
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
