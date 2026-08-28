/** @type {import('./types').Messages} */
const de = {
  hero: {
    eyebrow: 'Gravel-Challenge Thüringer Wald',
    title: '10× über den Rennsteig mit dem Gravelbike',
    sub: 'Von Hörschel bis Blankenstein – immer wieder. 170 km, 3.200 Hm, Schotter, Wald und Aussichten, die entschädigen.',
    ctaGpx: 'GPX herunterladen',
    ctaFaq: 'Häufige Fragen',
  },
  stats: [
    { value: '170 km',   label: 'Streckenlänge' },
    { value: '3.200 hm', label: 'Höhenmeter' },
    { value: '10×',      label: 'Querungen' },
    { value: '~900 m',   label: 'höchster Punkt' },
  ],
  event: {
    heading: 'Was ist AcrossR10?',
    body: [
      'AcrossR10 ist eine persönliche Gravel-Challenge: den Rennsteig – den historischen Kammweg des Thüringer Waldes von Hörschel im Westen bis Blankenstein im Osten – zehnmal mit dem Gravelbike überqueren.',
      'Der Rennsteig ist kein gewöhnlicher Radweg. Rund 170 km verläuft er entlang des Gebirgskamms, meist auf unbefestigten Forstwegen, historischen Grenzpfaden und grobem Schotter. Er trennte einst Franken von Thüringen – heute trennt er Genuss- von Gelegenheitsfahrern.',
      'Die zehn Querungen werden nicht an einem Tag absolviert. Sie verteilen sich über die Saison, können in beliebiger Richtung gefahren werden und laden dazu ein, die Region in ihrer ganzen Vielfalt zu entdecken: von der Wartburg bis zum Schwarzatal, von Bierstädten bis zu stillen Tälern.',
    ],
  },
  route: {
    heading: 'Die Strecke',
    meta: [
      { icon: '📍', value: '170 km',   label: 'Länge' },
      { icon: '⛰️', value: '3.200 hm', label: 'Aufstieg' },
      { icon: '🪨', value: '~60 %',    label: 'Schotter' },
    ],
    desc: 'Start in Hörschel am Fuß der Wartburg, Anstieg auf den Rennsteigkamm, vorbei an Oberhof und Masserberg bis nach Blankenstein an der Saale. Der Track folgt so nah wie möglich dem historischen Rennsteig-Pfad.',
    download: 'GPX herunterladen',
    downloadHint: 'Kompatibel mit Garmin, Wahoo, Komoot und allen gängigen Apps.',
    elevTitle: 'Höhenprofil (schematisch)',
    segments: [
      { name: 'Hörschel → Ruhla',        km: '~35 km' },
      { name: 'Ruhla → Oberhof',          km: '~45 km' },
      { name: 'Oberhof → Masserberg',     km: '~40 km' },
      { name: 'Masserberg → Blankenstein', km: '~50 km' },
    ],
  },
  region: {
    heading: 'Die Region',
    intro: 'Der Rennsteig durchquert eine der abwechslungsreichsten Mittelgebirgslandschaften Deutschlands. Was dich erwartet:',
    cards: [
      {
        icon: '🌲',
        title: 'Thüringer Wald',
        body: 'Fichtenforst, Buchenmischwälder und Moore wechseln sich ab. Im Herbst leuchtet der Wald in allen Rotabstufungen, im Winter liegt oft noch Schnee, wenn die Täler längst grün sind.',
      },
      {
        icon: '🏰',
        title: 'Wartburg',
        body: 'Start der Route in Sichtweite der Wartburg – UNESCO-Weltkulturerbe und Ort, an dem Martin Luther 1521 das Neue Testament übersetzte. Lohnt einen Abstecher vor dem Start.',
      },
      {
        icon: '🎿',
        title: 'Oberhof',
        body: 'Deutschlands bekanntester Wintersportort liegt direkt an der Route. Im Sommer sind die breiten Forststraßen rund um Oberhof prime Gravel-Terrain – und das Biathlonstadion einen Blick wert.',
      },
      {
        icon: '🌊',
        title: 'Schwarzatal',
        body: 'Im mittleren Teil quert die Route das wildromantische Schwarzatal. Steile Hänge, rauschende Bäche und Felsformationen wie die Hohe Warte machen diesen Abschnitt zu einem Highlight.',
      },
      {
        icon: '🍺',
        title: 'Thüringer Küche',
        body: 'Thüringer Bratwurst, Klöße und Rostbrätel sind Pflicht. In Kleinbrauereien zwischen Hildburghausen und Sonneberg gibt es regionale Biere, die nach einem langen Tag auf dem Rennsteig besonders gut schmecken.',
      },
      {
        icon: '📖',
        title: 'Geschichte',
        body: 'Der Rennsteig diente Jahrhunderte als Grenzweg zwischen Thüringen und Franken. Grenzsteine, historische Rastplätze und alte Forstbeschriftungen machen jede Fahrt zu einer Zeitreise.',
      },
    ],
  },
  faq: {
    heading: 'Häufige Fragen',
    intro: 'Alles, was du vor der ersten Querung wissen solltest.',
    items: [
      {
        q: 'Welches Bike brauche ich?',
        a: 'Ein Gravelbike mit mindestens 40 mm breiten Reifen ist ideal. Schlauchlos empfohlen, da der Schotter stellenweise grob ist. MTBs gehen natürlich auch, aber das Gravelbike macht den Rennsteig erst wirklich interessant.',
      },
      {
        q: 'Wie schwer ist der Rennsteig für Gravelbike-Einsteiger?',
        a: 'Der Rennsteig ist kein Anfängertrack. Die kontinuierliche Distanz (170 km), die Höhenmeter und die Schotterstrecken setzen Grundkondition voraus. Als Faustregel: Wer komfortabel 100-km-Touren fährt, kann den Rennsteig anpacken. Für die 10-fache Querung empfiehlt sich eine schrittweise Steigerung über die Saison.',
      },
      {
        q: 'Gibt es eine offizielle Zeitvorgabe?',
        a: 'Nein. AcrossR10 ist eine persönliche Challenge ohne Wertung, Zeitlimits oder Pflichttermine. Du fährst, wann es dir passt – Hauptsache, die Querung ist vollständig von Hörschel bis Blankenstein (oder umgekehrt).',
      },
      {
        q: 'Kann ich die Route auch in Etappen aufteilen?',
        a: 'Ja, und das empfehlen wir sogar. Der Rennsteig lässt sich prima in vier Tagesetappen zu je 40–50 km fahren. Übernachtungsmöglichkeiten gibt es in Ruhla, Oberhof, Masserberg und Lehesten. Reservierungen vor allem im Sommer empfehlenswert.',
      },
      {
        q: 'Wo kann ich mir den GPX-Track öffnen?',
        a: 'Der GPX-Track funktioniert mit jeder gängigen App: Komoot, Strava, RideWithGPS, Garmin Connect, Wahoo oder Brouter. Auf dem Gerät einfach importieren – der Track enthält Wegpunkte und Höhendaten.',
      },
      {
        q: 'Gibt es Wasserversorgung auf der Strecke?',
        a: 'Auf dem Kamm sind die Versorgungsmöglichkeiten dünn. Plane mindestens 1,5 Liter Trinkvolumen ein und nutze die Gasthöfe in Oberhof, Masserberg und Neustadt am Rennsteig als Versorgungspunkte. Bäche auf dem Rennsteig sind kein zuverlässiger Trinkwasserersatz.',
      },
      {
        q: 'Ist die Route das ganze Jahr befahrbar?',
        a: 'Die beste Zeit ist Mai bis Oktober. Im Winter liegt auf dem Kamm oft Schnee und Forstwege können gesperrt oder tiefgefroren sein. Frühling und Herbst bieten oft das schönste Licht, aber auch die nässesten Wege.',
      },
      {
        q: 'Wie dokumentiere ich meine Querungen?',
        a: 'Mit der AcrossR10-App auf dieser Seite: Wenn du dich in der Nähe eines der Checkpoint-POIs befindest, kannst du einchecken. Das Datum und die Uhrzeit werden lokal gespeichert. Eine Strava-Integration und ein persönliches Logbuch sind in Planung.',
      },
    ],
  },
  contact: {
    heading: 'Dabei sein oder Fragen?',
    body: 'Für Anmeldungen, Routenfragen oder wenn du deine eigene AcrossR10-Geschichte teilen möchtest – schreib uns einfach.',
    cta: 'E-Mail schreiben',
    email: 'kontakt@wideride.de',
  },
  footer: {
    copy: '© 2026 AcrossR10 · Eine Initiative von wideride.de',
    toTop: '↑ Nach oben',
  },
  nav: {
    navEvent:       'Das Event',
    navRoute:       'Strecke & GPX',
    navRegion:      'Region',
    navFaq:         'FAQ',
    navContact:     'Kontakt',
    navMembers:     'Mein Bereich',
    navLeaderboard: 'Bestenliste',
  },
  lang: { switchTo: 'English' },
  auth: {
    login: 'Anmelden',
    logout: 'Abmelden',
  },
  leaderboard: {
    eyebrow: 'Ewige Bestenliste',
    pageTitle: 'Bestenliste',
    pageIntro: 'Alle registrierten Teilnehmerinnen und Teilnehmer, die den Rennsteig 10-mal erfolgreich überquert haben – sortiert nach Geschlecht und Altersklasse.',
    filters: { all: 'Alle', M: 'Männlich', W: 'Weiblich', D: 'Divers' },
    ageClasses: {
      u30:  'AK U30 (unter 30)',
      ak30: 'AK 30 (30–39)',
      ak40: 'AK 40 (40–49)',
      ak50: 'AK 50 (50–59)',
      ak60: 'AK 60+ (60 und älter)',
    },
    colRank:      'Rang',
    colName:      'Name',
    colGender:    'Gesch.',
    colCrossings: 'Querungen',
    colDate:      'Datum',
    empty:        'Noch keine Einträge in dieser Kategorie.',
    hint:         'Nur Teilnehmer, die der öffentlichen Anzeige zugestimmt haben, erscheinen hier.',
  },
  members: {
    greeting: 'Willkommen zurück',
    pageTitle: 'Mein AcrossR10-Bereich',
    pageIntro: 'Dein persönlicher Bereich – Querungen dokumentieren, Regeln nachlesen, Verpflegungspunkte planen.',
    progress: {
      heading: 'Meine Querungen',
      intro: 'Trage hier deine absolvierten Querungen ein. Ziel: 10 vollständige Fahrten von Hörschel bis Blankenstein (oder zurück).',
      crossingLabel: 'Querung',
      notDone: 'Noch ausstehend',
      done: 'Absolviert',
      markDone: 'Eintragen',
      markUndone: 'Rückgängig',
      summary: (done, total) => `${done} von ${total} Querungen absolviert`,
    },
    profile: {
      heading: 'Bestenliste & Profil',
      intro: 'Trage dein Profil ein, um in der Bestenliste zu erscheinen, sobald du alle 10 Querungen absolviert hast.',
      genderLabel: 'Geschlecht',
      genderOptions: { M: 'Männlich', W: 'Weiblich', D: 'Divers' },
      birthYearLabel: 'Geburtsjahr',
      publicLabel: 'In der Bestenliste anzeigen',
      save: 'Profil speichern',
      saving: 'Wird gespeichert …',
      edit: 'Profil bearbeiten',
      cancel: 'Abbrechen',
      errorGender: 'Bitte wähle ein Geschlecht aus.',
      errorYear: 'Bitte gib ein gültiges Geburtsjahr ein.',
      errorSave: 'Speichern fehlgeschlagen. Bitte versuche es erneut.',
      completedBanner: 'Glückwunsch – du hast alle 10 Querungen absolviert!',
      leaderboardLink: 'Zur Bestenliste',
    },
    catering: {
      heading: 'Verpflegung unterwegs',
      intro: 'Auf dem Rennsteigkamm sind Möglichkeiten zur Versorgung rar. Diese Punkte eignen sich als verlässliche Stopps:',
      points: [
        {
          name: 'Hörschel (Start / Ziel)',
          km: '0 km',
          icon: '🏁',
          details: 'Bäckerei, Tankstelle, kleiner Supermarkt. Idealer Ausgangspunkt für Proviant-Auffüllung vor der Tour.',
        },
        {
          name: 'Gasthof Ruhla',
          km: '~35 km',
          icon: '🍽️',
          details: 'Traditionsgasthof im Tal. Warme Küche, Thüringer Bratwurst, Getränke. Empfehlenswert als erster Stopp.',
        },
        {
          name: 'Oberhof – Ortszentrum',
          km: '~80 km',
          icon: '🏪',
          details: 'Supermärkte, Bäckereien, mehrere Restaurants. Größter Versorgungspunkt auf der Strecke. Unbedingt nutzen!',
        },
        {
          name: 'Masserberg / Neustadt a. Rennsteig',
          km: '~120 km',
          icon: '🥪',
          details: 'Kleiner Ort mit Gasthof und Kiosk. Letzte verlässliche Versorgung vor dem langen Endabschnitt nach Blankenstein.',
        },
        {
          name: 'Blankenstein (Ziel / Start)',
          km: '~170 km',
          icon: '🏁',
          details: 'Gasthof und kleines Café direkt am Zielpunkt. Perfekt für die Einkehr nach der Querung.',
        },
      ],
      waterNote: '💧 Trinkwasser-Tipp: Plane mindestens 1,5 l Tragekapazität ein. Bäche auf dem Kamm sind kein zuverlässiger Trinkwasserersatz.',
    },
    stvo: {
      heading: 'StVO & Regeln auf dem Rennsteig',
      intro: 'Das Radfahren auf Forstwegen unterliegt besonderen Regeln. Hier das Wichtigste im Überblick:',
      rules: [
        {
          icon: '🚧',
          title: 'Gesperrte Forstwege',
          body: 'Wege mit dem Schild „Radfahren verboten“ oder „Kein Durchgang“ dürfen nicht befahren werden. Während Holzeinschlag oder nach Sturm können weitere Wege temporär gesperrt sein – Absperrungen immer respektieren.',
        },
        {
          icon: '🐾',
          title: 'Wildtiere & Naturschutz',
          body: 'Der Rennsteig durchquert teils Naturschutzgebiete. Wege nicht verlassen, keinen Lärm machen und Wildtiere nicht aufscheuchen. Hunde an die Leine, besonders in der Brut- und Setzzeit (März–Juli).',
        },
        {
          icon: '🔆',
          title: 'Beleuchtungspflicht',
          body: 'Bei Dämmerung und Dunkelheit gilt Beleuchtungspflicht (§ 67 StVZO). Vorderlicht weiß, Rücklicht rot, beides fest montiert. Stirnlampe zählt nicht als Fahrradlicht.',
        },
        {
          icon: '🔔',
          title: 'Klingel & Überholabstand',
          body: 'Klingel ist Pflicht (§ 65 StVZO). Beim Überholen von Fußgängern und Wanderern ausreichend Abstand (mind. 1,5 m) halten und ankündigen. Auf engen Forststraßen gilt gegenseitige Rücksichtnahme.',
        },
        {
          icon: '🪖',
          title: 'Helm & Schutzausrüstung',
          body: 'Helmpflicht gibt es in Deutschland für Erwachsene nicht, wird aber dringend empfohlen. Auf dem Schotter und in den langen Abfahrten ist ein Helm absolut sinnvoll. Handschuhe und eine gut sitzende Brille schützen zusätzlich.',
        },
        {
          icon: '🚨',
          title: 'Notruf & Erste Hilfe',
          body: 'Europäischer Notruf: 112. Im Thüringer Wald kann der Mobilfunkempfang auf dem Kamm lückenhaft sein. Informiere jemanden über deine geplante Route. Erste-Hilfe-Set im Rucksack ist Pflicht.',
        },
      ],
    },
    tips: {
      heading: 'Persönliche Tipps & Packliste',
      intro: 'Unsere Empfehlungen für eine sichere und angenehme Querung:',
      items: [
        { icon: '🧰', text: 'Flickzeug, CO₂-Kartuschen oder Pumpe, Kettenöl und Multitool immer dabei.' },
        { icon: '🧴', text: 'Sonnencreme und Insektenschutz – besonders im Hochsommer auf dem Kamm.' },
        { icon: '🌧️', text: 'Regenponcho oder Hardshell: Das Wetter auf dem Kamm kann schnell umschlagen.' },
        { icon: '📱', text: 'Powerbank einpacken – GPS-Nutzung entleert den Akku schneller als gedacht.' },
        { icon: '💳', text: 'Bargeld mitnehmen: In kleineren Gasthöfen und Kiosken gibt es oft kein Kartenterminal.' },
        { icon: '🗺️', text: 'Offline-Karte herunterladen (Komoot, OSM). Mobilfunk auf dem Kamm nicht verlässlich.' },
      ],
    },
  },
};

export default de;
