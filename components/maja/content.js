// Single source of truth for the interactive house: zone geometry (in the
// hero image's 1600x900 coordinate space), all Latvian service copy, and the
// system colour coding. Consumed by the client experience AND the server-side
// SEO layer, so it must stay pure data — no browser imports.

export const SYSTEM_COLORS = {
  cold: '#6aa8c9',
  hot: '#c97a6a',
  heating: '#d99a55',
  drainage: '#7d8894',
  rain: '#9cc3d4',
  irrigation: '#7fb58a',
}

// Zone polygons are drawn in the same 1600x900 space as the hero SVG overlay
// (preserveAspectRatio="xMidYMid slice" keeps them glued to the photo at any
// viewport). `anchor` is where the label chip sits.
export const ZONES = [
  {
    id: 'katlu-telpa',
    label: 'Katlu telpa un apkures sistēmas',
    short: 'Katlu telpa',
    system: 'heating',
    poly: '400,500 620,490 625,700 405,705',
    anchor: [512, 480],
    lead: 'Mājas sirds — pārdomāta katlu telpa, kas klusi dara savu darbu.',
    points: [
      'Apkures sistēmu izbūve un modernizācija',
      'Katlu telpas ar precīzu cauruļvadu montāžu',
      'Sūkņi, kolektori un vadības automātika',
      'Apkures sistēmu remonts un apkope',
    ],
  },
  {
    id: 'vannas-istaba',
    label: 'Vannas istabas un santehnika',
    short: 'Vannas istaba',
    system: 'hot',
    poly: '640,360 870,340 872,470 642,480',
    anchor: [755, 340],
    lead: 'Nevainojama santehnika — redzamā daļa ir tikai sākums.',
    points: [
      'Pilna vannas istabu santehnikas izbūve',
      'Slēptie rāmji, skalojamās kastes un pieslēgumi',
      'Dušas, vannas, izlietnes un maisītāji',
    ],
  },
  {
    id: 'siltas-gridas',
    label: 'Siltās grīdas',
    short: 'Siltās grīdas',
    system: 'heating',
    poly: '590,640 1180,620 1185,720 592,745',
    anchor: [880, 660],
    lead: 'Komforts, efektivitāte un vienmērīgs siltums visā telpā.',
    points: [
      'Loki ieklāti precīzi pirms grīdas seguma',
      'Kolektors ar atsevišķu regulēšanu katrai telpai',
      'Savietojamas ar katlu vai siltumsūkni',
    ],
  },
  {
    id: 'radiatori',
    label: 'Radiatoru apkures sistēmas',
    short: 'Radiatori',
    system: 'heating',
    poly: '1140,300 1260,290 1262,480 1142,490',
    anchor: [1200, 285],
    lead: 'Pārbaudīta klasika — ātrs siltums ar precīzu regulēšanu.',
    points: [
      'Radiatoru sistēmu projektēšana un montāža',
      'Turpgaitas un atgaitas cauruļvadi bez kompromisiem',
      'Esošu sistēmu pārbūve un balansēšana',
    ],
  },
  {
    id: 'siltumsuknis',
    label: 'Gaiss–ūdens siltumsūkņi',
    short: 'Siltumsūknis',
    system: 'heating',
    poly: '1275,590 1395,585 1398,700 1278,705',
    anchor: [1336, 575],
    lead: 'Mūsdienīga apkure ar zemām ikmēneša izmaksām.',
    points: [
      'Gaiss–ūdens siltumsūkņu uzstādīšana',
      'Hidrauliskie pieslēgumi un apkures sadale',
      'Savietojami ar siltajām grīdām un radiatoriem',
    ],
  },
  {
    id: 'kanalizacija',
    label: 'Kanalizācijas sistēmas',
    short: 'Kanalizācija',
    system: 'drainage',
    poly: '980,760 1280,730 1420,800 1030,860',
    anchor: [1180, 790],
    lead: 'Neredzama, bet izšķiroša — pareizi izbūvēta kanalizācija.',
    points: [
      'Iekšējā un ārējā kanalizācija',
      'Stāvvadi un notekūdeņu sistēmas',
      'Pazemes cauruļvadi un apskates akas',
    ],
  },
  {
    id: 'lietus-udens',
    label: 'Lietus ūdens novadīšana',
    short: 'Lietus ūdens',
    system: 'rain',
    poly: '590,420 940,240 1330,190 1345,270 950,320 600,470',
    anchor: [960, 235],
    lead: 'Katrs piliens tur, kur tam jābūt — prom no mājas pamatiem.',
    points: [
      'Notekas, teknes un lietus ūdens cauruļvadi',
      'Pazemes lietus ūdens novadīšana',
      'Risinājumi, kas pasargā pamatus un fasādi',
    ],
  },
  {
    id: 'laistisana',
    label: 'Dārza laistīšanas sistēmas',
    short: 'Laistīšana',
    system: 'irrigation',
    poly: '10,600 250,590 260,780 15,800',
    anchor: [130, 585],
    lead: 'Zaļš dārzs bez ikdienas rūpēm.',
    points: [
      'Automātiskās laistīšanas sistēmas un zonas',
      'Vārsti, sprinkleri un dārza krāni',
      'Pieslēgums mājas ūdensapgādei',
    ],
  },
  {
    id: 'virtuve',
    label: 'Virtuves santehnika',
    short: 'Virtuve',
    system: 'cold',
    poly: '620,500 760,495 762,660 622,665',
    anchor: [690, 490],
    lead: 'Virtuve, kurā viss pieslēgts tā, kā nākas.',
    points: [
      'Izlietnes, maisītāji un ūdens pieslēgumi',
      'Trauku mazgājamās mašīnas pieslēgumi',
      'Kanalizācijas pieslēgumi bez smakām un noplūdēm',
    ],
  },
  {
    id: 'udensapgade',
    label: 'Ūdensapgādes sistēmas',
    short: 'Ūdensapgāde',
    system: 'cold',
    poly: '60,800 520,730 640,780 220,890 65,880',
    anchor: [330, 800],
    lead: 'No ievada līdz tālākajam krānam — stabils spiediens un tīrs ūdens.',
    points: [
      'Ūdensvada izbūve un ievadi',
      'Aukstā un karstā ūdens sistēmas',
      'Cauruļvadu nomaiņa un bojājumu remonts',
    ],
  },
]

// The office is the contact hotspot — deliberately not in ZONES: it gets a
// warm treatment (talk to us), not the technical X-ray (what we do).
export const OFFICE = {
  id: 'birojs',
  label: 'Sazināties ar mums',
  poly: '905,505 1090,495 1092,700 908,705',
  anchor: [1000, 488],
  lead: 'Pastāstiet par savu projektu, un mēs ar jums sazināsimies.',
}

export const PHONE_DISPLAY = '+371 26 275 983'
export const PHONE_HREF = 'tel:+37126275983'

// Zone → enquiry-form service option, so "Pieteikt konsultāciju" inside a
// service panel lands in the office form with the right selection.
export const ZONE_TO_SERVICE = {
  'katlu-telpa': 'Apkure',
  'vannas-istaba': 'Vannas istabas',
  'siltas-gridas': 'Siltās grīdas',
  radiatori: 'Apkure',
  siltumsuknis: 'Siltumsūkņi',
  kanalizacija: 'Kanalizācija',
  'lietus-udens': 'Lietus ūdens sistēmas',
  laistisana: 'Dārza laistīšanas sistēmas',
  virtuve: 'Virtuves santehnika',
  udensapgade: 'Ūdensapgāde',
}

// Service options for the office enquiry form — mirrors the zones on the
// house plus the catch-all.
export const FORM_SERVICES = [
  'Apkure',
  'Siltās grīdas',
  'Siltumsūkņi',
  'Ūdensapgāde',
  'Kanalizācija',
  'Vannas istabas',
  'Virtuves santehnika',
  'Lietus ūdens sistēmas',
  'Dārza laistīšanas sistēmas',
  'Cits',
]
