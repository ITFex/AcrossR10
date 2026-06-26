<script>
  import LeafletRennsteigMap from '$lib/components/LeafletRennsteigMap.svelte';
  import { locale } from '$lib/stores/i18n';

  const copy = {
    de: {
      metaLine: 'Standort Thüringen, Deutschland',
      title: 'Rennsteig-Radwanderweg',
      intro:
        'Der Rennsteig-Radwanderweg ist ein rund 195 km langes Radangebot in der Region. Er führt von Hörschel bei Eisenach bis nach Blankenstein, verläuft teilweise direkt auf dem Rennsteig und weicht abschnittsweise auf parallele Routen aus.',
      imageAlt: 'Rennsteig-Strecke im Wald',
      metricAria: 'Routenmetriken',
      routeStats: [
        { label: 'LÄNGE', value: '195 km' },
        { label: 'START / ZIEL', value: 'Hörschel bis Blankenstein' },
        { label: 'WEGBELAG', value: 'Asphalt, Schotter, Waldweg' },
        { label: 'MARKIERUNG', value: 'Grünes R mit Radfahrer' },
        { label: 'ANREISE', value: 'DB nach Eisenach, Oberhof, Blankenstein' },
        { label: 'PARKEN', value: 'Wanderparkplätze entlang der Route' },
        { label: 'CHARAKTER', value: 'Teilweise anspruchsvoll' },
        { label: 'RICHTUNG', value: 'In beide Richtungen fahrbar' }
      ],
      sectionCharacter: 'Streckencharakter',
      characterText:
        'Die Route verbindet landschaftliche Abschnitte des Thüringer Waldes mit interessanten Einblicken in Städte und Gemeinden entlang des Rennsteigs. Wer sich Zeit für Abstecher nimmt, findet unterwegs zusätzliche Sehenswürdigkeiten und touristische Angebote.',
      routeScale: [
        {
          label: 'HÖHENPROFIL',
          value: 'ANSPRUCHSVOLL IM WESTEN UND OSTEN',
          detail: 'Die ersten rund 30 km bei Eisenach und die letzten rund 15 km vor Blankenstein sind deutlich steiler.'
        },
        {
          label: 'ROUTENFÜHRUNG',
          value: 'NAH AM RENNSTEIG',
          detail: 'Der Radwanderweg verläuft teilweise direkt auf dem Rennsteig und weicht abschnittsweise auf parallele Routen aus.'
        },
        {
          label: 'UNTERGRUND',
          value: 'MIX',
          detail: 'Abschnitte auf Waldwegen, Schotter und Straßen wechseln sich über die gesamte Strecke ab.'
        },
        {
          label: 'KONDITION',
          value: 'GUT',
          detail: 'Für die teilweise bergigen bis stark ansteigenden Abschnitte ist solide Ausdauer sinnvoll.'
        }
      ],
      sectionHighlights: 'Highlights',
      highlights: [
        '195 km durch den Thüringer Wald mit Landschaft, Aussichtspunkten und Ortsgeschichte entlang der Route.',
        'Teilstrecken direkt auf dem Rennsteig, dazwischen parallele Führungen für den Radverkehr.',
        'Abstecher zu Sehenswürdigkeiten in Städten und Gemeinden entlang der Hauptroute lohnen sich.',
        'Die Route kann komplett oder abschnittsweise geplant und in beide Richtungen gefahren werden.'
      ],
      sectionMustKnow: 'Wichtig zu wissen',
      mustKnow: [
        'Die grün-schwarze Markierung mit dem R und Radfahrer weist den Streckenverlauf des Rennsteig-Radweges.',
        'Die Strecke ist touristischer Radwanderweg, nicht durchgehend identisch mit dem Wander-Rennsteig.',
        'Wegen wechselnder Untergründe und bergiger Passagen sind Tourenrad, Gravel oder MTB je nach Fahrstil sinnvoll.',
        'Vor der Fahrt aktuelle Wetterlage, Wegezustand und mögliche Sperrungen prüfen.'
      ],
      sectionSegments: 'Abschnitte',
      profileLabel: 'Profil',
      tipLabel: 'Tipp',
      stageNotes: [
        {
          title: 'Westabschnitt: Hörschel bis Inselsberg/Oberhof',
          profile: 'Kräftiger Auftakt mit den größten Höhendifferenzen im Bereich Eisenach.',
          hint: 'Für diesen Abschnitt Zeit, Reserven und wetterfeste Ausrüstung einplanen.'
        },
        {
          title: 'Mittelteil: Oberhof bis Neuhaus am Rennweg',
          profile: 'Längerer Mittelteil mit typischem Mix aus Waldwegen, Schotter und Straßen.',
          hint: 'Etappenorte und Einkehrmöglichkeiten für Pausen oder Übernachtung nutzen.'
        },
        {
          title: 'Ostteil: Neuhaus bis Blankenstein',
          profile: 'Zum Schluss nochmals profilierter mit markanten Anstiegen und Abfahrten vor dem Ziel.',
          hint: 'Die letzten Kilometer nicht unterschätzen und ausreichend Reserven behalten.'
        }
      ],
      sectionOrientation: 'Orientierung & Planung',
      orientationText:
        'Die offizielle Beschilderung begleitet die Strecke, dennoch ist für die konkrete Etappenplanung eine digitale Karte sinnvoll. AcrossR10 zeigt die Route nur schematisch; die verbindlichen Tourist-Informationen stehen auf der offiziellen Rennsteig-Seite.',
      sectionLeafletMap: 'Rennsteig Karte',
      sectionLeafletMapText:
        'Interaktive Leaflet-Karte mit der hinterlegten Radtour (GPX), inklusive Start-/Zielmarkierung und Wegpunkten.',
      officialLinksLabel: 'Offizielle Links',
      officialLinkMain: 'Rennsteig.de / Radweg',
      officialLinkMap: 'Karte zur Routenplanung',
      officialLinkPlanner: 'Radroutenplaner Thüringen',
      sectionPlanning: 'Planung',
      planningNotes: [
        {
          title: 'Anreise',
          text: 'Die offizielle Übersicht nennt Eisenach, Oberhof und Blankenstein als gut erreichbare Bahnstationen für Start, Teilabschnitt oder Rückreise.'
        },
        {
          title: 'Etappenlogik',
          text: 'Die 195 km lassen sich als Mehrtagestour oder in ausgewählten Teilsegmenten planen, je nach Kondition und Tagesziel.'
        },
        {
          title: 'Beschilderung',
          text: 'Die Route ist markiert, verläuft aber nicht immer direkt auf dem Rennsteig. Eine digitale Planungskarte bleibt deshalb sinnvoll.'
        },
        {
          title: 'Fahrzeugwahl',
          text: 'Wegen Asphalt-, Schotter- und Waldweganteilen eignen sich robuste Reiserad-, Trekking-, Gravel- oder MTB-Setups.'
        }
      ],
      sectionAccommodations: 'Übernachtungsmöglichkeiten',
      accommodations: [
        {
          area: 'Hotels',
          text: 'Direkt über das Unterkunftsverzeichnis der Region am Rennsteig recherchierbar.'
        },
        {
          area: 'Pensionen und Gasthöfe',
          text: 'Sinnvoll für Etappenorte, wenn mehrere Tagesabschnitte geplant sind.'
        },
        {
          area: 'Ferienwohnungen, Ferienhäuser und Camping',
          text: 'Die offizielle Rennsteig-Seite verlinkt passende Kategorien für verschiedene Reiseformen.'
        }
      ],
      sectionCamping: 'Camping / Unterkunft',
      camping: [
        'Unterkunft vorab entlang der gewünschten Etappenorte reservieren, besonders in der Hauptsaison.',
        'Bei Radreise-Planung auf sicheren Fahrradabstellraum und Trocknungsmöglichkeiten achten.',
        'Camping nur auf zulässigen Plätzen oder freigegebenen Flächen einplanen.'
      ],
      sectionResourcesPlan: 'Planungsressourcen',
      typeLabel: 'Typ',
      planningResources: [
        {
          name: 'Karte zur Routenplanung',
          type: 'Offizielle Detailkarte',
          hint: 'Direkter Link des Tourismusportals zur thematischen Routenplanung für den Rennsteig-Radweg.'
        },
        {
          name: 'Radroutenplaner Thüringen',
          type: 'Planungstool',
          hint: 'Geeignet für Etappenplanung, Höhenprofil und Anschlussstrecken.'
        },
        {
          name: 'Rennsteig.de / Radweg',
          type: 'Offizielle Übersicht',
          hint: 'Enthält Kurzübersicht, Charakter der Strecke und weiterführende Hinweise.'
        }
      ],
      sectionFood: 'Verpflegung',
      foodAndWater: [
        'Versorgung in größeren Orten und touristischen Zentren aktiv einplanen.',
        'Auf langen Waldpassagen ausreichend Wasser und Verpflegung mitnehmen.',
        'Öffnungszeiten vor einer Mehrtagestour prüfen, besonders unter der Woche.'
      ],
      sectionMoreResources: 'Weitere Ressourcen',
      resources: [
        'Offizielle Rennsteig-Informationen zur Route und zu Unterkünften',
        'Radroutenplaner Thüringen für Detailnavigation und Anschlussrouten',
        'Aktuelle Wetter-, Anreise- und Sperrungsinfos vor dem Start'
      ],
      sectionFaq: 'FAQ',
      faqItems: [
        {
          q: 'Wie lang ist der Rennsteig-Radwanderweg?',
          a: 'Die offizielle Rennsteig-Seite beschreibt den Radwanderweg mit insgesamt 195 km.'
        },
        {
          q: 'Wo beginnt und endet die Route?',
          a: 'Die Hauptroute beginnt in Hörschel bei Eisenach und endet in Blankenstein. Sie kann auch in Gegenrichtung gefahren werden.'
        },
        {
          q: 'Wie ist die Strecke markiert?',
          a: 'Der Streckenverlauf ist mit einem grünen R und schwarzem Radfahrer markiert.'
        },
        {
          q: 'Welchen Schwierigkeitsgrad hat die Route?',
          a: 'Sie gilt als teilweise anspruchsvoll, besonders wegen der höhenintensiven Randabschnitte und des wechselnden Untergrunds.'
        }
      ],
      sectionGallery: 'Impressionen',
      gallery: [
        { title: 'Waldkammlinien am Rennsteig', tone: 'tone-a' },
        { title: 'Offene Abschnitte im Thüringer Wald', tone: 'tone-b' },
        { title: 'Etappenorte und Rastpunkte', tone: 'tone-c' },
        { title: 'Ankunft in Blankenstein', tone: 'tone-d' }
      ],
      terms:
        'Hinweis: Diese Seite fasst touristische Basisdaten zusammen. Für aktuelle Bedingungen, Sperrungen und Detailnavigation bitte die offiziellen Quellen vor Fahrtbeginn prüfen.',
      contributedBy: 'Beigetragen von',
      contributor: {
        name: 'AcrossR10 Editorial Team',
        role: 'Routenredaktion',
        bio: 'Zusammenfassung der touristischen Basisinformationen zum Rennsteig-Radwanderweg auf Grundlage der offiziellen Rennsteig-Quelle.'
      },
      sectionStartPoints: 'Startpunkte',
      logisticsLabel: 'Logistik',
      startPoints: [
        {
          name: 'Hörschel / Eisenach',
          reason: 'Klassischer Startpunkt am westlichen Beginn des Rennsteigs.',
          logistics: 'Anreise per DB bis Eisenach, danach kurzer Transfer nach Hörschel.'
        },
        {
          name: 'Oberhof',
          reason: 'Zentraler Einstieg für Teilabschnitte, Pausen oder Etappenplanung.',
          logistics: 'Per Bahn erreichbar und mit guter touristischer Infrastruktur vor Ort.'
        },
        {
          name: 'Blankenstein',
          reason: 'Östlicher Endpunkt der Gesamtstrecke und sinnvoll für einen Start in Gegenrichtung.',
          logistics: 'DB-Anschluss und Rückreiseoptionen für Zielankunft oder Gegenstart.'
        }
      ],
      sectionQuickActions: 'Schnellzugriff',
      actionOfficial: 'Offizielle Radweg-Seite',
      actionPlanner: 'Radroutenplaner',
      actionCheckin: 'AcrossR10 Check-in'
    },
    en: {
      metaLine: 'Location Thuringia, Germany',
      title: 'Rennsteig Cycle Route',
      intro:
        'The Rennsteig cycle route is a roughly 195 km route in the region. It runs from Hörschel near Eisenach to Blankenstein, partly directly on the Rennsteig ridge and partly on parallel routes.',
      imageAlt: 'Rennsteig route in the forest',
      metricAria: 'Route metrics',
      routeStats: [
        { label: 'DISTANCE', value: '195 km' },
        { label: 'START / FINISH', value: 'Hörschel to Blankenstein' },
        { label: 'SURFACE', value: 'Asphalt, gravel, forest trail' },
        { label: 'SIGNAGE', value: 'Green R with cyclist symbol' },
        { label: 'ARRIVAL', value: 'Rail to Eisenach, Oberhof, Blankenstein' },
        { label: 'PARKING', value: 'Hiker parking spots along the route' },
        { label: 'CHARACTER', value: 'Partly demanding' },
        { label: 'DIRECTION', value: 'Rideable both directions' }
      ],
      sectionCharacter: 'Route character',
      characterText:
        'The route combines scenic sections of the Thuringian Forest with historical towns and villages along the Rennsteig. If you take detours, you will find additional sights and local highlights.',
      routeScale: [
        {
          label: 'ELEVATION PROFILE',
          value: 'DEMANDING IN WEST AND EAST',
          detail: 'The first ~30 km near Eisenach and the final ~15 km before Blankenstein are steeper.'
        },
        {
          label: 'ROUTE GUIDANCE',
          value: 'CLOSE TO RENNSTEIG',
          detail: 'The cycle route partly follows the Rennsteig directly and partly uses parallel paths.'
        },
        {
          label: 'SURFACE MIX',
          value: 'MIXED',
          detail: 'Forest trails, gravel and paved roads alternate along the route.'
        },
        {
          label: 'FITNESS',
          value: 'GOOD',
          detail: 'Solid endurance is recommended for hilly and steep sections.'
        }
      ],
      sectionHighlights: 'Highlights',
      highlights: [
        '195 km through the Thuringian Forest with scenery, viewpoints and local history.',
        'Some sections directly on the Rennsteig, others on suitable parallel bike routes.',
        'Detours to sights in nearby towns and villages are worth planning in.',
        'The route can be ridden in one go or in selected segments, in both directions.'
      ],
      sectionMustKnow: 'Must know',
      mustKnow: [
        'The green-black route sign with an R and cyclist marks the cycle route.',
        'This is a dedicated cycle touring route and not always identical to the hiking Rennsteig.',
        'Due to mixed surfaces and hilly sections, trekking, gravel or MTB setups are recommended.',
        'Check weather, surface conditions and possible closures before riding.'
      ],
      sectionSegments: 'Sections',
      profileLabel: 'Profile',
      tipLabel: 'Tip',
      stageNotes: [
        {
          title: 'West section: Hörschel to Inselsberg/Oberhof',
          profile: 'Strong opening with the largest elevation differences near Eisenach.',
          hint: 'Plan enough time, reserves and weatherproof gear for this segment.'
        },
        {
          title: 'Middle section: Oberhof to Neuhaus am Rennweg',
          profile: 'Long central part with a typical mix of forest paths, gravel and roads.',
          hint: 'Use stage towns for breaks, food stops and overnight stays.'
        },
        {
          title: 'East section: Neuhaus to Blankenstein',
          profile: 'More profile again toward the end with notable climbs and descents.',
          hint: 'Do not underestimate the final kilometers and keep reserves.'
        }
      ],
      sectionOrientation: 'Orientation & planning',
      orientationText:
        'The official signage supports navigation, but digital map planning remains useful for detailed stages. AcrossR10 shows a schematic overview; authoritative information is on the official Rennsteig website.',
      sectionLeafletMap: 'Rennsteig map',
      sectionLeafletMapText:
        'Interactive Leaflet map with the included bike tour GPX, including start/finish markers and waypoints.',
      officialLinksLabel: 'Official links',
      officialLinkMain: 'Rennsteig.de / Cycle route',
      officialLinkMap: 'Route planning map',
      officialLinkPlanner: 'Thuringia bike route planner',
      sectionPlanning: 'Planning',
      planningNotes: [
        {
          title: 'Arrival',
          text: 'The official overview names Eisenach, Oberhof and Blankenstein as useful rail access points for start, partial stages and return travel.'
        },
        {
          title: 'Stage logic',
          text: 'The 195 km can be planned as a multi-day tour or in selected sections depending on fitness and daily goals.'
        },
        {
          title: 'Signage',
          text: 'The route is marked but does not always run directly on the Rennsteig trail; a planning map is recommended.'
        },
        {
          title: 'Bike choice',
          text: 'Because of asphalt, gravel and forest-track sections, robust touring, trekking, gravel or MTB setups are suitable.'
        }
      ],
      sectionAccommodations: 'Accommodation options',
      accommodations: [
        {
          area: 'Hotels',
          text: 'Available through the region’s official accommodation directory.'
        },
        {
          area: 'Guesthouses and inns',
          text: 'Useful in stage towns when planning multiple riding days.'
        },
        {
          area: 'Apartments, holiday homes and camping',
          text: 'The official Rennsteig page links suitable categories for different travel styles.'
        }
      ],
      sectionCamping: 'Camping / lodging',
      camping: [
        'Reserve accommodation along your planned stage towns, especially in peak season.',
        'For bike trips, look for secure bike storage and drying options.',
        'Plan camping only on approved campsites or officially allowed areas.'
      ],
      sectionResourcesPlan: 'Planning resources',
      typeLabel: 'Type',
      planningResources: [
        {
          name: 'Route planning map',
          type: 'Official detailed map',
          hint: 'Direct tourism-portal link for thematic planning of the Rennsteig cycle route.'
        },
        {
          name: 'Thuringia bike route planner',
          type: 'Planning tool',
          hint: 'Useful for stage planning, elevation profiles and connecting routes.'
        },
        {
          name: 'Rennsteig.de / Cycle route',
          type: 'Official overview',
          hint: 'Contains key facts, route character and further information.'
        }
      ],
      sectionFood: 'Food & water',
      foodAndWater: [
        'Actively plan resupply in larger towns and tourist centers.',
        'Carry sufficient water and food on longer forest sections.',
        'Check opening hours before multi-day rides, especially on weekdays.'
      ],
      sectionMoreResources: 'Additional resources',
      resources: [
        'Official Rennsteig information for route and accommodation',
        'Thuringia bike route planner for detailed navigation and connectors',
        'Current weather, travel and closure information before start'
      ],
      sectionFaq: 'FAQ',
      faqItems: [
        {
          q: 'How long is the Rennsteig cycle route?',
          a: 'The official Rennsteig page states a total route length of 195 km.'
        },
        {
          q: 'Where does the route start and end?',
          a: 'The main route starts in Hörschel near Eisenach and ends in Blankenstein. It can also be ridden in reverse.'
        },
        {
          q: 'How is the route marked?',
          a: 'A green R with a black cyclist symbol marks the route guidance.'
        },
        {
          q: 'How difficult is the route?',
          a: 'It is partly demanding, especially due to elevation-heavy edge sections and mixed surfaces.'
        }
      ],
      sectionGallery: 'Impressions',
      gallery: [
        { title: 'Forest ridge lines on Rennsteig', tone: 'tone-a' },
        { title: 'Open sections in Thuringian Forest', tone: 'tone-b' },
        { title: 'Stage towns and break points', tone: 'tone-c' },
        { title: 'Arrival in Blankenstein', tone: 'tone-d' }
      ],
      terms:
        'Note: This page summarizes core tourist information. For current conditions, closures and detailed navigation, please check official sources before riding.',
      contributedBy: 'Contributed by',
      contributor: {
        name: 'AcrossR10 Editorial Team',
        role: 'Route editorial',
        bio: 'Summary of the official Rennsteig cycle-route baseline information for orientation and planning.'
      },
      sectionStartPoints: 'Start points',
      logisticsLabel: 'Logistics',
      startPoints: [
        {
          name: 'Hörschel / Eisenach',
          reason: 'Classic start at the western beginning of Rennsteig.',
          logistics: 'Rail to Eisenach, then short transfer to Hörschel.'
        },
        {
          name: 'Oberhof',
          reason: 'Central access point for partial stages, breaks or tour planning.',
          logistics: 'Reachable by rail with good local tourism infrastructure.'
        },
        {
          name: 'Blankenstein',
          reason: 'Eastern endpoint and useful for starting in reverse direction.',
          logistics: 'Rail connection with return-travel options.'
        }
      ],
      sectionQuickActions: 'Quick actions',
      actionOfficial: 'Official route page',
      actionPlanner: 'Route planner',
      actionCheckin: 'AcrossR10 check-in'
    }
  };

  $: t = copy[$locale] ?? copy.de;

</script>

<main>
  <header class="hero">
    <p class="meta-line">{t.metaLine}</p>
    <h1>{t.title}</h1>
    <p class="dek">{t.intro}</p>
    <figure class="hero-art">
      <img
        src="/42BD92FD-A239-43C8-809F-06FAD4024551_1_105_c.jpeg"
        alt={t.imageAlt}
        loading="eager"
      />
    </figure>
    <div class="route-stats" aria-label={t.metricAria}>
      {#each t.routeStats as metric}
        <article>
          <p class="label">{metric.label}</p>
          <p class="value">{metric.value}</p>
        </article>
      {/each}
    </div>
  </header>

  <section class="article-grid">
    <article class="narrative">
      <h2>{t.sectionCharacter}</h2>
      <p>{t.characterText}</p>

      <div class="scale-grid">
        {#each t.routeScale as scale}
          <article class="scale-card">
            <p class="scale-label">{scale.label}</p>
            <p class="scale-value">{scale.value}</p>
            <p class="scale-detail">{scale.detail}</p>
          </article>
        {/each}
      </div>

      <h2>{t.sectionHighlights}</h2>
      <ul class="text-list">
        {#each t.highlights as item}
          <li>{item}</li>
        {/each}
      </ul>

      <h2>{t.sectionMustKnow}</h2>
      <ul class="text-list">
        {#each t.mustKnow as note}
          <li>{note}</li>
        {/each}
      </ul>

      <h2>{t.sectionSegments}</h2>
      <div class="stage-list">
        {#each t.stageNotes as stage}
          <article>
            <h3>{stage.title}</h3>
            <p><strong>{t.profileLabel}:</strong> {stage.profile}</p>
            <p><strong>{t.tipLabel}:</strong> {stage.hint}</p>
          </article>
        {/each}
      </div>

      <h2>{t.sectionOrientation}</h2>
      <p>{t.orientationText}</p>

      <LeafletRennsteigMap
        title={t.sectionLeafletMap}
        description={t.sectionLeafletMapText}
        gpxPath="/rennsteig-race.gpx"
      />

      <p>
        {t.officialLinksLabel}:
        <a class="inline-link" href="https://www.rennsteig.de/radweg" target="_blank" rel="noreferrer"
          >{t.officialLinkMain}</a
        >,
        <a
          class="inline-link"
          href="https://radservice.radroutenplaner.thueringen.de/rrp/th/cgi?view=584075,5585369,692965,5652338&showThematicRoute=Rennsteig-Radweg"
          target="_blank"
          rel="noreferrer">{t.officialLinkMap}</a
        >
        und
        <a
          class="inline-link"
          href="https://www.radroutenplaner.thueringen.de/"
          target="_blank"
          rel="noreferrer">{t.officialLinkPlanner}</a
        >.
      </p>

      <h2>{t.sectionPlanning}</h2>
      <div class="faq-list">
        {#each t.planningNotes as item}
          <article class="faq-item">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        {/each}
      </div>

      <div class="split-list">
        <section>
          <h3>{t.sectionAccommodations}</h3>
          <div class="faq-list">
            {#each t.accommodations as place}
              <article class="faq-item">
                <h4>{place.area}</h4>
                <p>{place.text}</p>
              </article>
            {/each}
          </div>

          <h3>{t.sectionCamping}</h3>
          <ul class="text-list compact">
            {#each t.camping as item}
              <li>{item}</li>
            {/each}
          </ul>
        </section>

        <section>
          <h3>{t.sectionResourcesPlan}</h3>
          <div class="faq-list">
            {#each t.planningResources as station}
              <article class="faq-item">
                <h4>{station.name}</h4>
                <p><strong>{t.typeLabel}:</strong> {station.type}</p>
                <p>{station.hint}</p>
              </article>
            {/each}
          </div>

          <h3>{t.sectionFood}</h3>
          <ul class="text-list compact">
            {#each t.foodAndWater as item}
              <li>{item}</li>
            {/each}
          </ul>
        </section>
      </div>

      <h3>{t.sectionMoreResources}</h3>
      <ul class="text-list compact">
        {#each t.resources as item}
          <li>{item}</li>
        {/each}
      </ul>

      <h2>{t.sectionFaq}</h2>
      <div class="faq-list">
        {#each t.faqItems as item}
          <article class="faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        {/each}
      </div>

      <h2>{t.sectionGallery}</h2>
      <div class="gallery-grid">
        {#each t.gallery as frame}
          <figure class={`gallery-frame ${frame.tone}`}>
            <figcaption>{frame.title}</figcaption>
          </figure>
        {/each}
      </div>

      <p class="terms">{t.terms}</p>
    </article>

    <aside class="sidebar">
      <section class="contributor-card">
        <p class="card-kicker">{t.contributedBy}</p>
        <h3>{t.contributor.name}</h3>
        <p class="role">{t.contributor.role}</p>
        <p>{t.contributor.bio}</p>
      </section>

      <section class="quick-card">
        <h3>{t.sectionStartPoints}</h3>
        {#each t.startPoints as option}
          <article class="quick-item">
            <h4>{option.name}</h4>
            <p>{option.reason}</p>
            <p><strong>{t.logisticsLabel}:</strong> {option.logistics}</p>
          </article>
        {/each}
      </section>

      <section class="quick-card">
        <h3>{t.sectionQuickActions}</h3>
        <a class="ghost-btn" href="https://www.rennsteig.de/radweg">{t.actionOfficial}</a>
        <a class="ghost-btn" href="https://www.radroutenplaner.thueringen.de/">{t.actionPlanner}</a>
        <a class="ghost-btn" href="/checkin">{t.actionCheckin}</a>
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
