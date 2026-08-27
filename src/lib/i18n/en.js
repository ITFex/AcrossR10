/** @type {import('./types').Messages} */
const en = {
  hero: {
    eyebrow: 'Gravel Challenge Thuringian Forest',
    title: '10× Across the Rennsteig by Gravel Bike',
    sub: 'From Hörschel to Blankenstein – over and over. 170 km, 3,200 m elevation, gravel, forest and views worth every climb.',
    ctaGpx: 'Download GPX',
    ctaFaq: 'FAQ',
  },
  stats: [
    { value: '170 km',    label: 'Distance' },
    { value: '3,200 m',   label: 'Elevation gain' },
    { value: '10×',       label: 'Crossings' },
    { value: '~900 m',    label: 'Highest point' },
  ],
  event: {
    heading: 'What is AcrossR10?',
    body: [
      'AcrossR10 is a personal gravel challenge: crossing the Rennsteig – the historic ridge path of the Thuringian Forest from Hörschel in the west to Blankenstein in the east – ten times by gravel bike.',
      'The Rennsteig is no ordinary bike path. For around 170 km it runs along the mountain ridge, mostly on unpaved forest tracks, historic boundary trails and rough gravel. It once separated Franconia from Thuringia – today it separates casual riders from committed ones.',
      'The ten crossings are not completed in a single day. They are spread across the season, can be ridden in either direction, and invite you to explore the region in all its variety: from the Wartburg to the Schwarzatal, from beer towns to quiet valleys.',
    ],
  },
  route: {
    heading: 'The Route',
    meta: [
      { icon: '📍', value: '170 km',   label: 'Distance' },
      { icon: '⛰️', value: '3,200 m',  label: 'Ascent' },
      { icon: '🪨', value: '~60 %',    label: 'Gravel' },
    ],
    desc: 'Starting in Hörschel at the foot of the Wartburg, climbing to the Rennsteig ridge, past Oberhof and Masserberg to Blankenstein on the Saale. The track follows the historic Rennsteig path as closely as possible.',
    download: 'Download GPX',
    downloadHint: 'Compatible with Garmin, Wahoo, Komoot and all common apps.',
    elevTitle: 'Elevation profile (schematic)',
    segments: [
      { name: 'Hörschel → Ruhla',        km: '~35 km' },
      { name: 'Ruhla → Oberhof',          km: '~45 km' },
      { name: 'Oberhof → Masserberg',     km: '~40 km' },
      { name: 'Masserberg → Blankenstein', km: '~50 km' },
    ],
  },
  region: {
    heading: 'The Region',
    intro: 'The Rennsteig crosses one of Germany\'s most diverse upland landscapes. Here\'s what awaits you:',
    cards: [
      {
        icon: '🌲',
        title: 'Thuringian Forest',
        body: 'Spruce forests, beech woodlands and moors alternate. In autumn the forest glows in every shade of red; in winter snow often lingers on the ridge long after the valleys below are green.',
      },
      {
        icon: '🏰',
        title: 'Wartburg Castle',
        body: 'The route starts within sight of the Wartburg – UNESCO World Heritage Site and the place where Martin Luther translated the New Testament in 1521. Worth a detour before setting off.',
      },
      {
        icon: '🎿',
        title: 'Oberhof',
        body: 'Germany\'s best-known winter sports resort sits right on the route. In summer, the broad forest roads around Oberhof are prime gravel terrain – and the biathlon stadium is worth a look.',
      },
      {
        icon: '🌊',
        title: 'Schwarzatal',
        body: 'In the middle section the route crosses the wildly romantic Schwarzatal valley. Steep slopes, rushing streams and rock formations like the Hohe Warte make this one of the route\'s highlights.',
      },
      {
        icon: '🍺',
        title: 'Thuringian Cuisine',
        body: 'Thuringian bratwurst, dumplings and Rostbrätel are mandatory. Small breweries between Hildburghausen and Sonneberg serve regional beers that taste particularly good after a long day on the Rennsteig.',
      },
      {
        icon: '📖',
        title: 'History',
        body: 'The Rennsteig served for centuries as a boundary path between Thuringia and Franconia. Boundary stones, historic rest stops and old forestry markings make every ride a journey through time.',
      },
    ],
  },
  faq: {
    heading: 'Frequently Asked Questions',
    intro: 'Everything you need to know before your first crossing.',
    items: [
      {
        q: 'What bike do I need?',
        a: 'A gravel bike with at least 40 mm wide tyres is ideal. Tubeless is recommended as the gravel can be rough in places. MTBs work too, of course, but the gravel bike is what makes the Rennsteig really interesting.',
      },
      {
        q: 'How hard is the Rennsteig for gravel beginners?',
        a: 'The Rennsteig is not a beginner track. The full distance (170 km), the elevation and the gravel sections require a solid base fitness. Rule of thumb: if you can comfortably ride 100 km tours, you can tackle the Rennsteig. For the 10-crossing challenge, build up gradually over the season.',
      },
      {
        q: 'Is there an official time limit?',
        a: 'No. AcrossR10 is a personal challenge with no rankings, time limits or mandatory dates. Ride when it suits you – the only requirement is a complete crossing from Hörschel to Blankenstein (or vice versa).',
      },
      {
        q: 'Can I split the route into stages?',
        a: 'Yes, and we actually recommend it. The Rennsteig splits nicely into four day stages of 40–50 km each. Accommodation is available in Ruhla, Oberhof, Masserberg and Lehesten. Book ahead especially in summer.',
      },
      {
        q: 'How do I open the GPX track?',
        a: 'The GPX track works with any common app: Komoot, Strava, RideWithGPS, Garmin Connect, Wahoo or Brouter. Simply import it on your device – the track includes waypoints and elevation data.',
      },
      {
        q: 'Where can I find water on the route?',
        a: 'Water sources on the ridge are sparse. Plan for at least 1.5 litres of carrying capacity and use the inns in Oberhof, Masserberg and Neustadt am Rennsteig as resupply points. Streams on the Rennsteig are not a reliable drinking water source.',
      },
      {
        q: 'Is the route rideable year round?',
        a: 'The best time is May to October. In winter the ridge often has snow and forest roads can be closed or frozen. Spring and autumn offer the most beautiful light, but also the muddiest trails.',
      },
      {
        q: 'How do I log my crossings?',
        a: 'Using the AcrossR10 app on this page: when you are near one of the checkpoint POIs you can check in. The date and time are stored locally. A Strava integration and a personal logbook are in the pipeline.',
      },
    ],
  },
  contact: {
    heading: 'Want to join or have questions?',
    body: 'For sign-ups, route questions or if you want to share your own AcrossR10 story – just write to us.',
    cta: 'Send an email',
    email: 'contact@wideride.de',
  },
  footer: {
    copy: '© 2026 AcrossR10 · An initiative by wideride.de',
    toTop: '↑ Back to top',
  },
  nav: {
    navEvent:   'The Event',
    navRoute:   'Route & GPX',
    navRegion:  'Region',
    navFaq:     'FAQ',
    navContact: 'Contact',
  },
  lang: { switchTo: 'Deutsch' },
  auth: {
    login: 'Sign in',
    logout: 'Sign out',
  },
};

export default en;
