// Single source of truth for the V2 experience: services (Latvian copy),
// scenes (camera angles of the one approved house), zone geometry per scene,
// and underground markers. Consumed by the client experience AND the
// server-side SEO layer — pure data, no browser imports.

export const PHONE_DISPLAY = '+371 26 275 983'
export const PHONE_HREF = 'tel:+37126275983'

// ---------------------------------------------------------------------------
// Services — the business content. Zones and markers reference these by id.
// ---------------------------------------------------------------------------
export const SERVICES = {
  'katlu-telpa': {
    label: 'Katlu telpa un apkures sistēmas',
    lead: 'Mājas sirds — pārdomāta katlu telpa, kas klusi dara savu darbu.',
    points: [
      'Apkures sistēmu izbūve un modernizācija',
      'Katlu telpas ar precīzu cauruļvadu montāžu',
      'Sūkņi, kolektori un vadības automātika',
      'Apkures sistēmu remonts un apkope',
    ],
    formService: 'Apkure',
    interior: '/maja/int-katlu-telpa.jpg',
  },
  'vannas-istaba': {
    label: 'Vannas istabas un santehnika',
    lead: 'Nevainojama santehnika — redzamā daļa ir tikai sākums.',
    points: [
      'Pilna vannas istabu santehnikas izbūve',
      'Slēptie rāmji, skalojamās kastes un pieslēgumi',
      'Dušas, vannas, izlietnes un maisītāji',
    ],
    formService: 'Vannas istabas',
    interior: '/maja/int-vanna.jpg',
  },
  'siltas-gridas': {
    label: 'Siltās grīdas',
    lead: 'Komforts, efektivitāte un vienmērīgs siltums visā telpā.',
    points: [
      'Loki ieklāti precīzi pirms grīdas seguma',
      'Kolektors ar atsevišķu regulēšanu katrai telpai',
      'Savietojamas ar katlu vai siltumsūkni',
    ],
    formService: 'Siltās grīdas',
    interior: '/maja/int-siltas-gridas.jpg',
  },
  radiatori: {
    label: 'Radiatoru apkures sistēmas',
    lead: 'Pārbaudīta klasika — ātrs siltums ar precīzu regulēšanu.',
    points: [
      'Radiatoru sistēmu projektēšana un montāža',
      'Turpgaitas un atgaitas cauruļvadi bez kompromisiem',
      'Esošu sistēmu pārbūve un balansēšana',
    ],
    formService: 'Apkure',
    interior: '/maja/int-dzivojama.jpg',
  },
  siltumsuknis: {
    label: 'Gaiss–ūdens siltumsūkņi',
    lead: 'Mūsdienīga apkure ar zemām ikmēneša izmaksām.',
    points: [
      'Gaiss–ūdens siltumsūkņu uzstādīšana',
      'Hidrauliskie pieslēgumi un apkures sadale',
      'Savietojami ar siltajām grīdām un radiatoriem',
    ],
    formService: 'Siltumsūkņi',
  },
  kanalizacija: {
    label: 'Kanalizācijas sistēmas',
    lead: 'Neredzama, bet izšķiroša — pareizi izbūvēta kanalizācija.',
    points: [
      'Iekšējā un ārējā kanalizācija',
      'Stāvvadi un notekūdeņu sistēmas',
      'Pazemes cauruļvadi, tvertnes un apskates akas',
    ],
    formService: 'Kanalizācija',
    backdrop: '/maja/scene-pazeme-2560.jpg',
  },
  'lietus-udens': {
    label: 'Lietus ūdens novadīšana',
    lead: 'Katrs piliens tur, kur tam jābūt — prom no mājas pamatiem.',
    points: [
      'Notekas, teknes un lietus ūdens cauruļvadi',
      'Pazemes lietus ūdens tvertnes un novadīšana',
      'Risinājumi, kas pasargā pamatus un fasādi',
    ],
    formService: 'Lietus ūdens sistēmas',
    backdrop: '/maja/scene-pazeme-2560.jpg',
  },
  laistisana: {
    label: 'Dārza laistīšanas sistēmas',
    lead: 'Zaļš dārzs bez ikdienas rūpēm.',
    points: [
      'Automātiskās laistīšanas sistēmas un zonas',
      'Vārsti, sprinkleri un dārza krāni',
      'Pieslēgums mājas ūdensapgādei',
    ],
    formService: 'Dārza laistīšanas sistēmas',
  },
  virtuve: {
    label: 'Virtuves santehnika',
    lead: 'Virtuve, kurā viss pieslēgts tā, kā nākas.',
    points: [
      'Izlietnes, maisītāji un ūdens pieslēgumi',
      'Trauku mazgājamās mašīnas pieslēgumi',
      'Kanalizācijas pieslēgumi bez smakām un noplūdēm',
    ],
    formService: 'Virtuves santehnika',
    interior: '/maja/int-virtuve.jpg',
  },
  udensapgade: {
    label: 'Ūdensapgādes sistēmas',
    lead: 'No ievada līdz tālākajam krānam — stabils spiediens un tīrs ūdens.',
    points: [
      'Ūdensvada izbūve un ievadi',
      'Aukstā un karstā ūdens sistēmas',
      'Cauruļvadu nomaiņa un bojājumu remonts',
    ],
    formService: 'Ūdensapgāde',
    backdrop: '/maja/scene-pazeme-2560.jpg',
  },
  birojs: {
    label: 'Sazināties ar mums',
    lead: 'Pastāstiet par savu projektu, un mēs ar jums sazināsimies.',
    points: [],
    formService: '',
    interior: '/maja/int-birojs.jpg',
    isOffice: true,
  },
}

// ---------------------------------------------------------------------------
// Scenes — camera angles of the one house. Zone polygons live in each
// scene's own 1600x900 image space (SVG preserveAspectRatio slice keeps them
// glued to the photo). Scroll steps through scenes; hover opens the interior
// behind the wall; markers are the underground scene's discreet callouts.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    key: 'fasade',
    src: '/maja/scene-fasade-1600.jpg',
    src2x: '/maja/scene-fasade-2560.jpg',
    caption: 'Fasāde no piebraucamā ceļa',
    tagline: 'Atklājiet, kas slēpjas aiz sienām',
    zones: [
      { serviceId: 'katlu-telpa', poly: '400,500 620,490 625,700 405,705', anchor: [512, 480] },
      { serviceId: 'vannas-istaba', poly: '640,360 870,340 872,470 642,480', anchor: [755, 340] },
      { serviceId: 'virtuve', poly: '620,500 760,495 762,660 622,665', anchor: [690, 490] },
      { serviceId: 'radiatori', poly: '1140,300 1260,290 1262,480 1142,490', anchor: [1200, 285] },
      { serviceId: 'birojs', poly: '905,505 1090,495 1092,700 908,705', anchor: [1000, 488] },
      { serviceId: 'siltumsuknis', poly: '1275,590 1395,585 1398,700 1278,705', anchor: [1336, 575] },
    ],
    markers: [],
  },
  {
    key: 'sani',
    src: '/maja/scene-sani-1600.jpg',
    src2x: '/maja/scene-sani-2560.jpg',
    caption: 'No dārza puses',
    zones: [
      { serviceId: 'birojs', poly: '675,510 985,505 985,745 675,748', anchor: [830, 495] },
      { serviceId: 'vannas-istaba', poly: '950,258 1122,250 1124,470 952,472', anchor: [1035, 240] },
      { serviceId: 'siltumsuknis', poly: '1165,605 1308,600 1310,748 1168,750', anchor: [1236, 588] },
    ],
    markers: [],
  },
  {
    key: 'gaiss',
    src: '/maja/scene-gaiss-1600.jpg',
    src2x: '/maja/scene-gaiss-2560.jpg',
    caption: 'Īpašums no augšas',
    zones: [
      { serviceId: 'lietus-udens', poly: '520,430 700,290 1075,225 1300,340 1300,385 880,505 522,478', anchor: [905, 268] },
      { serviceId: 'laistisana', poly: '890,690 1540,680 1545,855 895,860', anchor: [1215, 668] },
      { serviceId: 'udensapgade', poly: '70,645 885,640 890,865 75,870', anchor: [450, 628] },
    ],
    markers: [],
  },
  {
    key: 'pazeme',
    pos: 'center 100%',
    svgAlign: 'xMidYMax slice',
    src: '/maja/scene-pazeme-1600.jpg',
    src2x: '/maja/scene-pazeme-2560.jpg',
    caption: 'Zem zemes — ārējie tīkli',
    zones: [],
    markers: [
      { serviceId: 'kanalizacija', x: 605, y: 795 },
      { serviceId: 'lietus-udens', x: 1275, y: 795 },
      { serviceId: 'udensapgade', x: 1095, y: 742 },
    ],
  },
]

// Service options for the office enquiry form.
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
