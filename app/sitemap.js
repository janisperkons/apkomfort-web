const BASE = 'https://apkomforts.com'

const ROUTES = [
  '/',
  '/apkopes-plani/',
  '/komforta-klubs/',
  '/kalkulators/',
  '/apkures-katlu-apkope/',
  '/gazes-katlu-apkope/',
  '/siltumsuknu-apkope/',
  '/granulu-katlu-apkope/',
  '/santehnikas-darbi/',
  '/apkures-remonts/',
  '/avarijas-izsaukums/',
  '/gazes-katla-apkope-obligata/',
  '/valsts-atbalsts-siltumsuknim/',
  '/apkures-katla-nomaina/',
  '/par-mums/',
  '/biezak-uzdotie-jautajumi/',
  '/kontakti/',
  '/apkures-serviss-marupe/',
  '/apkures-serviss-adazi/',
  '/apkures-serviss-kekava/',
  '/apkures-serviss-ropazi/',
  '/apkures-serviss-salaspils/',
  '/apkures-serviss-jurmala/',
  '/apkures-serviss-olaine/',
  '/apkures-serviss-babite/',
]

export default function sitemap() {
  const lastModified = new Date()
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/kalkulators/' ? 0.9 : 0.7,
  }))
}
