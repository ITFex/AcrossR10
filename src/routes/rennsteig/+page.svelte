<script>
  import LeafletRennsteigMap from '$lib/components/LeafletRennsteigMap.svelte';
  import { locale } from '$lib/stores/i18n';

  const copy = {
    de: {
      metaLine: 'Schmiedefeld am Rennsteig · Thüringer Wald',
      title: 'Burg Elgersburg – Gasthaus Mönchhof Runde',
      intro:
        'Eine Radtour von rund 48 km ab Schmiedefeld am Rennsteig durch den Thüringer Wald. Die Runde führt vorbei an der historischen Burg Elgersburg, dem Ritzebühler Teich und dem Gasthaus Mönchhof – mit rund 790 Höhenmetern Aufstieg und einem Höchstpunkt von ca. 907 m auf dem Rennsteig.',
      imageAlt: 'Waldweg am Rennsteig im Thüringer Wald',
      metricAria: 'Tourenkennzahlen',
      routeStats: [
        { label: 'DISTANZ', value: '~48 km' },
        { label: 'TYP', value: 'Rundtour' },
        { label: 'START / ZIEL', value: 'Schmiedefeld am Rennsteig' },
        { label: 'AUFSTIEG', value: '~790 m' },
        { label: 'HÖHENPUNKT', value: '~907 m' },
        { label: 'UNTERGRUND', value: 'Forstweg, Schotter, Asphalt' },
        { label: 'CHARAKTER', value: 'Mittelschwer' },
        { label: 'QUELLE', value: 'Komoot · Tour 3066404238' }
      ],
      sectionCharacter: 'Streckencharakter',
      characterText:
        'Die Runde startet in Schmiedefeld am Rennsteig und erkundet den Thüringer Wald in einem abwechslungsreichen Streckenmix aus Forst- und Schotterwegen sowie asphaltierten Abschnitten. Markante Ziele sind die historische Burg Elgersburg mit ihrem Blick über das Ilmtal, der naturnahe Ritzebühler Teich und das Gasthaus Mönchhof als idealer Einkehrstopp.',
      routeScale: [
        {
          label: 'HÖHENPROFIL',
          value: '464–907 M HÖHE',
          detail: 'Der Aufstieg zur Burg Elgersburg und zurück auf den Rennsteig bringt die größten Höhendifferenzen der Tour.'
        },
        {
          label: 'STRECKENFÜHRUNG',
          value: 'RUNDTOUR',
          detail: 'Start und Ziel sind identisch in Schmiedefeld am Rennsteig. Die Tour ist in einer Richtung konzipiert.'
        },
        {
          label: 'UNTERGRUND',
          value: 'MIX',
          detail: 'Forst- und Schotterwege wechseln sich mit asphaltierten Passagen ab. Gravel oder MTB empfohlen.'
        },
        {
          label: 'KONDITION',
          value: 'MITTEL',
          detail: 'Ca. 790 Höhenmeter Aufstieg auf 48 km – für Hobbyradfahrer mit guter Grundkondition machbar.'
        }
      ],
      sectionHighlights: 'Highlights',
      highlights: [
        'Historische Burg Elgersburg im Ilmtal – markanter Aussichtspunkt und kulturelles Highlight der Tour.',
        'Ritzebühler Teich: ruhiger Rastpunkt inmitten des Thüringer Waldes.',
        'Gasthaus Mönchhof als natürlicher Einkehrstopp zur Streckenmitte.',
        'Passage entlang des Laurabahn-Radwegs zwischen Allzunah und Bahnhof Rennsteig.',
        'Aussichtspunkte auf Schmiedefeld am Rennsteig beim Abschluss der Runde.'
      ],
      sectionMustKnow: 'Wichtig zu wissen',
      mustKnow: [
        'Die Tour ist als Rundtour angelegt – Start und Ziel befinden sich beide in Schmiedefeld am Rennsteig.',
        'Für die gemischten Wege aus Forstweg, Schotter und Asphalt empfiehlt sich ein Gravel- oder MTB-Setup.',
        'Das Gasthaus Mönchhof bietet unterwegs eine Einkehrmöglichkeit – Öffnungszeiten vorab prüfen.',
        'Aktuelle Wegezustände, besonders auf Forst- und Schotterwegen, vor der Abfahrt kontrollieren.'
      ],
      sectionSegments: 'Abschnitte',
      profileLabel: 'Profil',
      tipLabel: 'Tipp',
      stageNotes: [
        {
          title: 'Schmiedefeld → Burg Elgersburg',
          profile: 'Über den Laurabahn-Radweg und den Ritzebühler Teich zur Burg Elgersburg – mit stetigem Anstieg auf rund 907 m Höhe am Rennsteig.',
          hint: 'Ausreichend Wasser und Energie für den Aufstieg mitnehmen.'
        },
        {
          title: 'Burg Elgersburg → Gasthaus Mönchhof',
          profile: 'Abwechslungsreicher Mittelteil über die Kernzone Jüchnitzgrund zum Gasthaus Mönchhof.',
          hint: 'Das Gasthaus Mönchhof eignet sich gut für eine ausgiebige Pause und Verpflegung.'
        },
        {
          title: 'Gasthaus Mönchhof → Schmiedefeld',
          profile: 'Rückkehr über Waldwege, Wegkreuzung Bierfleck und Aussichtspunkte auf Schmiedefeld.',
          hint: 'Die letzten Kilometer genießen: schöne Aussichtspunkte auf Schmiedefeld am Rennsteig warten.'
        }
      ],
      sectionOrientation: 'Orientierung & Planung',
      orientationText:
        'Der hinterlegte GPX-Track (Komoot-Tour 3066404238) begleitet die gesamte Strecke und kann zur Navigation genutzt werden. AcrossR10 zeigt die Route auf der interaktiven Karte; für aktuelle Wegbedingungen bitte direkt auf Komoot oder vor Ort prüfen.',
      sectionLeafletMap: 'Streckenkarte',
      sectionLeafletMapText:
        'Interaktive Karte mit dem GPX-Track der Tour (Burg Elgersburg – Gasthaus Mönchhof Runde), inklusive Start-/Zielmarkierung und allen Wegpunkten.',
      officialLinksLabel: 'Links',
      officialLinkMain: 'Komoot · Tour 3066404238',
      officialLinkMap: 'OpenStreetMap Region',
      officialLinkPlanner: 'Radroutenplaner Thüringen',
      sectionPlanning: 'Planung',
      planningNotes: [
        {
          title: 'Anreise',
          text: 'Schmiedefeld am Rennsteig liegt im Thüringer Wald. Mit der Bahn: bis Ilmenau oder Rottenbach, danach ca. 10–15 km per Rad oder PKW. Mit PKW: direkte Anreise, Parkmöglichkeiten in Schmiedefeld.'
        },
        {
          title: 'Tourendauer',
          text: 'Die ~48 km und ~790 Höhenmeter sind als Tagestour konzipiert. Bei gemäßigtem Tempo sind etwa 4–6 Stunden Fahrzeit einzuplanen.'
        },
        {
          title: 'Navigation',
          text: 'Der GPX-Track (Komoot-Tour 3066404238) ist die verlässlichste Orientierungshilfe. Vor Ort gibt es ergänzend Wandermarkierungen.'
        },
        {
          title: 'Fahrzeugwahl',
          text: 'Gravel, MTB oder robustes Trekkingrad empfohlen wegen der Schotter- und Forstwegabschnitte.'
        }
      ],
      sectionAccommodations: 'Übernachtungsmöglichkeiten',
      accommodations: [
        {
          area: 'Hotels & Pensionen',
          text: 'In Schmiedefeld und Ilmenau stehen Hotels und Pensionen für die An- und Abreise zur Verfügung.'
        },
        {
          area: 'Gasthaus Mönchhof',
          text: 'Direkt auf der Strecke gelegen – Unterkunftsmöglichkeiten ggf. direkt beim Gasthaus anfragen.'
        },
        {
          area: 'Ferienwohnungen',
          text: 'In der Region rund um Schmiedefeld und am Rennsteig stehen verschiedene Ferienwohnungen zur Verfügung.'
        }
      ],
      sectionCamping: 'Camping / Unterkunft',
      camping: [
        'Unterkunft in Schmiedefeld oder Ilmenau vorab buchen, besonders in der Hauptsaison.',
        'Bei Radreise auf sicheren Fahrradabstellraum und Trocknungsmöglichkeiten achten.',
        'Camping nur auf ausgewiesenen Plätzen in der Region einplanen.'
      ],
      sectionResourcesPlan: 'Planungsressourcen',
      typeLabel: 'Typ',
      planningResources: [
        {
          name: 'Komoot · Tour 3066404238',
          type: 'GPX-Quelle & Tourendetails',
          hint: 'Die originale Komoot-Tour mit Track, Wegpunkten und Nutzerinfos zur Burg Elgersburg – Gasthaus Mönchhof Runde.'
        },
        {
          name: 'Radroutenplaner Thüringen',
          type: 'Planungstool',
          hint: 'Für Anschlussstrecken, Höhenprofil und regionale Radwege rund um den Rennsteig.'
        },
        {
          name: 'OpenStreetMap',
          type: 'Kartenmaterial',
          hint: 'Aktuelles Kartenmaterial für die Region im Thüringer Wald und rund um Schmiedefeld.'
        }
      ],
      sectionFood: 'Verpflegung',
      foodAndWater: [
        'Gasthaus Mönchhof: natürlicher Einkehrstopp auf der Streckenmitte – Öffnungszeiten vorab prüfen.',
        'Auf Forst- und Waldabschnitten ausreichend Wasser und Snacks mitnehmen.',
        'In Schmiedefeld und Ilmenau gibt es Möglichkeiten zur Vorab-Verpflegung.'
      ],
      sectionMoreResources: 'Weitere Ressourcen',
      resources: [
        'Komoot Tour 3066404238 – originaler GPX-Track und Tourendetails',
        'Radroutenplaner Thüringen für Anschlussstrecken und Höhenprofil',
        'Aktuelle Wetterinfos für den Thüringer Wald vor dem Start prüfen'
      ],
      sectionFaq: 'FAQ',
      faqItems: [
        {
          q: 'Wie lang ist die Tour?',
          a: 'Die Burg Elgersburg – Gasthaus Mönchhof Runde beträgt rund 48 km (Komoot-Tour 3066404238).'
        },
        {
          q: 'Wo startet und endet die Tour?',
          a: 'Start und Ziel sind in Schmiedefeld am Rennsteig. Es handelt sich um eine Rundtour.'
        },
        {
          q: 'Wie viele Höhenmeter hat die Tour?',
          a: 'Die Tour hat rund 790 Höhenmeter Aufstieg, mit dem höchsten Punkt bei ca. 907 m auf dem Rennsteig.'
        },
        {
          q: 'Welche Fahrradtypen sind geeignet?',
          a: 'Wegen der gemischten Untergründe (Forstweg, Schotter, Asphalt) empfiehlt sich ein Gravel-, MTB- oder robustes Trekkingrad.'
        }
      ],
      sectionGallery: 'Impressionen',
      gallery: [
        { title: 'Burg Elgersburg im Ilmtal', tone: 'tone-a' },
        { title: 'Ritzebühler Teich im Thüringer Wald', tone: 'tone-b' },
        { title: 'Gasthaus Mönchhof', tone: 'tone-c' },
        { title: 'Blick auf Schmiedefeld am Rennsteig', tone: 'tone-d' }
      ],
      terms:
        'Hinweis: Diese Seite basiert auf dem Komoot-Track 3066404238. Für aktuelle Wegbedingungen, Sperrungen und Detailnavigation bitte die offiziellen Quellen vor der Abfahrt prüfen.',
      contributedBy: 'Beigetragen von',
      contributor: {
        name: 'AcrossR10 Editorial Team',
        role: 'Routenredaktion',
        bio: 'Zusammenfassung der Tourendaten zur Burg Elgersburg – Gasthaus Mönchhof Runde auf Grundlage des Komoot-Tracks 3066404238.'
      },
      sectionStartPoints: 'Startpunkt',
      logisticsLabel: 'Logistik',
      startPoints: [
        {
          name: 'Schmiedefeld am Rennsteig',
          reason: 'Einziger Start- und Endpunkt dieser Rundtour im Thüringer Wald.',
          logistics: 'Per Bahn bis Ilmenau (ca. 10 km entfernt). Per PKW direkt nach Schmiedefeld am Rennsteig, Parkmöglichkeiten vorhanden.'
        }
      ],
      sectionQuickActions: 'Schnellzugriff',
      actionOfficial: 'Tour auf Komoot',
      actionPlanner: 'Radroutenplaner',
      actionCheckin: 'AcrossR10 Check-in'
    },
    en: {
      metaLine: 'Schmiedefeld am Rennsteig · Thuringian Forest',
      title: 'Burg Elgersburg – Gasthaus Mönchhof Loop',
      intro:
        'A ~48 km cycling loop starting from Schmiedefeld am Rennsteig through the Thuringian Forest. The route passes the historic Burg Elgersburg, Ritzebühler Teich and Gasthaus Mönchhof, with around 790 m of climbing and a high point of ~907 m on the Rennsteig ridge.',
      imageAlt: 'Forest trail on the Rennsteig in the Thuringian Forest',
      metricAria: 'Tour metrics',
      routeStats: [
        { label: 'DISTANCE', value: '~48 km' },
        { label: 'TYPE', value: 'Loop' },
        { label: 'START / FINISH', value: 'Schmiedefeld am Rennsteig' },
        { label: 'CLIMBING', value: '~790 m' },
        { label: 'HIGH POINT', value: '~907 m' },
        { label: 'SURFACE', value: 'Forest trail, gravel, asphalt' },
        { label: 'CHARACTER', value: 'Moderate to demanding' },
        { label: 'SOURCE', value: 'Komoot · Tour 3066404238' }
      ],
      sectionCharacter: 'Route character',
      characterText:
        'The loop starts in Schmiedefeld am Rennsteig and explores the Thuringian Forest on a varied mix of forest trails, gravel paths and paved sections. Key highlights are the historic Burg Elgersburg with views over the Ilm valley, the scenic Ritzebühler Teich and Gasthaus Mönchhof as a natural mid-route refreshment stop.',
      routeScale: [
        {
          label: 'ELEVATION PROFILE',
          value: '464–907 M ALTITUDE',
          detail: 'The climb towards Burg Elgersburg and back onto the Rennsteig ridge involves the largest elevation differences.'
        },
        {
          label: 'ROUTE TYPE',
          value: 'LOOP',
          detail: 'Start and finish are at the same point in Schmiedefeld am Rennsteig. The tour is designed as a one-direction loop.'
        },
        {
          label: 'SURFACE MIX',
          value: 'MIXED',
          detail: 'Forest trails and gravel alternate with paved sections. Gravel or MTB recommended.'
        },
        {
          label: 'FITNESS',
          value: 'MEDIUM',
          detail: 'Around 790 m of climbing over 48 km – manageable for recreational cyclists with a solid base.'
        }
      ],
      sectionHighlights: 'Highlights',
      highlights: [
        'Historic Burg Elgersburg in the Ilm valley – a striking viewpoint and cultural highlight of the tour.',
        'Ritzebühler Teich: a peaceful rest stop in the heart of the Thuringian Forest.',
        'Gasthaus Mönchhof as a natural mid-route refreshment stop.',
        'Passage along the Laurabahn cycle path between Allzunah and Bahnhof Rennsteig.',
        'Viewpoints overlooking Schmiedefeld am Rennsteig on the final stretch.'
      ],
      sectionMustKnow: 'Must know',
      mustKnow: [
        'This is a loop tour – start and finish are both in Schmiedefeld am Rennsteig.',
        'The mixed surfaces (forest trail, gravel, asphalt) make a gravel or MTB setup advisable.',
        'Gasthaus Mönchhof offers a mid-route refreshment stop – check opening hours in advance.',
        'Check current trail conditions, especially on forest and gravel sections, before setting off.'
      ],
      sectionSegments: 'Sections',
      profileLabel: 'Profile',
      tipLabel: 'Tip',
      stageNotes: [
        {
          title: 'Schmiedefeld → Burg Elgersburg',
          profile: 'Via the Laurabahn cycle path and Ritzebühler Teich to Burg Elgersburg – with a steady climb to around 907 m on the Rennsteig.',
          hint: 'Bring enough water and food for the climb.'
        },
        {
          title: 'Burg Elgersburg → Gasthaus Mönchhof',
          profile: 'Varied mid-section through the Jüchnitzgrund nature zone to Gasthaus Mönchhof.',
          hint: 'Gasthaus Mönchhof is a great spot for a longer break and refuelling.'
        },
        {
          title: 'Gasthaus Mönchhof → Schmiedefeld',
          profile: 'Return via forest trails, Wegkreuzung Bierfleck and viewpoints over Schmiedefeld.',
          hint: 'Enjoy the final stretch: the viewpoints overlooking Schmiedefeld am Rennsteig are worth the effort.'
        }
      ],
      sectionOrientation: 'Orientation & planning',
      orientationText:
        'The embedded GPX track (Komoot tour 3066404238) covers the full route and can be used for navigation. AcrossR10 shows the route on the interactive map; for current trail conditions please check Komoot directly or assess on the ground.',
      sectionLeafletMap: 'Route map',
      sectionLeafletMapText:
        'Interactive map with the GPX track of the tour (Burg Elgersburg – Gasthaus Mönchhof loop), including start/finish markers and all waypoints.',
      officialLinksLabel: 'Links',
      officialLinkMain: 'Komoot · Tour 3066404238',
      officialLinkMap: 'OpenStreetMap region',
      officialLinkPlanner: 'Thuringia bike route planner',
      sectionPlanning: 'Planning',
      planningNotes: [
        {
          title: 'Getting there',
          text: 'Schmiedefeld am Rennsteig is in the Thuringian Forest. By train: to Ilmenau or Rottenbach, then ~10–15 km by bike or car. By car: direct access with parking available in Schmiedefeld.'
        },
        {
          title: 'Tour duration',
          text: 'The ~48 km and ~790 m of climbing are designed as a day tour. Allow around 4–6 hours of riding time at a comfortable pace.'
        },
        {
          title: 'Navigation',
          text: 'The GPX track (Komoot tour 3066404238) is the most reliable navigation aid. On-site hiking signs provide additional orientation.'
        },
        {
          title: 'Bike choice',
          text: 'Gravel, MTB or a robust touring bike recommended due to gravel and forest-trail sections.'
        }
      ],
      sectionAccommodations: 'Accommodation options',
      accommodations: [
        {
          area: 'Hotels & guesthouses',
          text: 'Hotels and guesthouses in Schmiedefeld and Ilmenau are available for arrival and departure.'
        },
        {
          area: 'Gasthaus Mönchhof',
          text: 'Located directly on the route – enquire at the Gasthaus for accommodation options.'
        },
        {
          area: 'Holiday apartments',
          text: 'Various holiday apartments are available in the area around Schmiedefeld and the Rennsteig.'
        }
      ],
      sectionCamping: 'Camping / lodging',
      camping: [
        'Book accommodation in Schmiedefeld or Ilmenau in advance, especially in peak season.',
        'Look for secure bike storage and drying facilities when booking.',
        'Plan camping only at designated sites in the region.'
      ],
      sectionResourcesPlan: 'Planning resources',
      typeLabel: 'Type',
      planningResources: [
        {
          name: 'Komoot · Tour 3066404238',
          type: 'GPX source & tour details',
          hint: 'The original Komoot tour with track, waypoints and user information for the Burg Elgersburg – Gasthaus Mönchhof loop.'
        },
        {
          name: 'Thuringia bike route planner',
          type: 'Planning tool',
          hint: 'Useful for connecting routes, elevation profiles and regional cycling paths around the Rennsteig.'
        },
        {
          name: 'OpenStreetMap',
          type: 'Map data',
          hint: 'Current map data for the Thuringian Forest region around Schmiedefeld.'
        }
      ],
      sectionFood: 'Food & water',
      foodAndWater: [
        'Gasthaus Mönchhof: natural mid-route stop – check opening hours in advance.',
        'Bring sufficient water and snacks for forest and trail sections.',
        'Stock up on supplies in Schmiedefeld or Ilmenau before setting off.'
      ],
      sectionMoreResources: 'Additional resources',
      resources: [
        'Komoot tour 3066404238 – original GPX track and tour details',
        'Thuringia bike route planner for connecting routes and elevation profiles',
        'Check current weather for the Thuringian Forest before your ride'
      ],
      sectionFaq: 'FAQ',
      faqItems: [
        {
          q: 'How long is the tour?',
          a: 'The Burg Elgersburg – Gasthaus Mönchhof loop is approximately 48 km (Komoot tour 3066404238).'
        },
        {
          q: 'Where does the tour start and finish?',
          a: 'Both start and finish are in Schmiedefeld am Rennsteig. It is a loop tour.'
        },
        {
          q: 'How much climbing does the tour involve?',
          a: 'Around 790 m of climbing, with the highest point at approximately 907 m on the Rennsteig ridge.'
        },
        {
          q: 'Which bike types are suitable?',
          a: 'Due to the mixed surfaces (forest trail, gravel, asphalt), a gravel bike, MTB or robust touring bike is recommended.'
        }
      ],
      sectionGallery: 'Impressions',
      gallery: [
        { title: 'Burg Elgersburg in the Ilm valley', tone: 'tone-a' },
        { title: 'Ritzebühler Teich in the Thuringian Forest', tone: 'tone-b' },
        { title: 'Gasthaus Mönchhof', tone: 'tone-c' },
        { title: 'View over Schmiedefeld am Rennsteig', tone: 'tone-d' }
      ],
      terms:
        'Note: This page is based on Komoot track 3066404238. For current trail conditions, closures and detailed navigation, please check official sources before setting off.',
      contributedBy: 'Contributed by',
      contributor: {
        name: 'AcrossR10 Editorial Team',
        role: 'Route editorial',
        bio: 'Summary of tour data for the Burg Elgersburg – Gasthaus Mönchhof loop based on Komoot track 3066404238.'
      },
      sectionStartPoints: 'Start point',
      logisticsLabel: 'Logistics',
      startPoints: [
        {
          name: 'Schmiedefeld am Rennsteig',
          reason: 'The only start and finish point of this loop tour in the Thuringian Forest.',
          logistics: 'By train to Ilmenau (~10 km away). By car directly to Schmiedefeld am Rennsteig, parking available.'
        }
      ],
      sectionQuickActions: 'Quick actions',
      actionOfficial: 'Tour on Komoot',
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
        <a class="inline-link" href="https://www.komoot.de/tour/3066404238" target="_blank" rel="noreferrer"
          >{t.officialLinkMain}</a
        >,
        <a
          class="inline-link"
          href="https://www.openstreetmap.org/#map=11/50.65/10.85"
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
        <a class="ghost-btn" href="https://www.komoot.de/tour/3066404238" target="_blank" rel="noreferrer">{t.actionOfficial}</a>
        <a class="ghost-btn" href="https://www.radroutenplaner.thueringen.de/" target="_blank" rel="noreferrer">{t.actionPlanner}</a>
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
