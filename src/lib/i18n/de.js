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
    navEvent:   'Das Event',
    navRoute:   'Strecke & GPX',
    navRegion:  'Region',
    navFaq:     'FAQ',
    navContact: 'Kontakt',
  },
  lang: { switchTo: 'English' },
  auth: {
    login: 'Anmelden',
    logout: 'Abmelden',
  },
};

export default de;
