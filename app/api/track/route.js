import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from '../../../lib/config'

const COUNTRY_NAMES = {
  LV: 'Latvija', LT: 'Lietuva', EE: 'Igaunija', RU: 'Krievija', BY: 'Baltkrievija',
  PL: 'Polija', DE: 'Vācija', GB: 'Lielbritānija', IE: 'Īrija', FR: 'Francija',
  ES: 'Spānija', PT: 'Portugāle', IT: 'Itālija', NL: 'Nīderlande', BE: 'Beļģija',
  LU: 'Luksemburga', CH: 'Šveice', AT: 'Austrija', SE: 'Zviedrija', NO: 'Norvēģija',
  DK: 'Dānija', FI: 'Somija', IS: 'Islande', UA: 'Ukraina', MD: 'Moldova',
  CZ: 'Čehija', SK: 'Slovākija', HU: 'Ungārija', RO: 'Rumānija', BG: 'Bulgārija',
  GR: 'Grieķija', HR: 'Horvātija', SI: 'Slovēnija', RS: 'Serbija', CY: 'Kipra',
  MT: 'Malta', TR: 'Turcija', IL: 'Izraēla', AE: 'AAE', SA: 'Saūda Arābija',
  US: 'ASV', CA: 'Kanāda', MX: 'Meksika', BR: 'Brazīlija', AR: 'Argentīna',
  AU: 'Austrālija', NZ: 'Jaunzēlande', JP: 'Japāna', KR: 'Dienvidkoreja', CN: 'Ķīna',
  IN: 'Indija', SG: 'Singapūra', TH: 'Taizeme',
  ZA: 'Dienvidāfrika', EG: 'Ēģipte', NG: 'Nigērija', KE: 'Kenija',
}

function countryName(code) {
  if (!code) return null
  return COUNTRY_NAMES[code] || code
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch { body = {} }

  const countryCode = request.headers.get('x-vercel-ip-country')
  const cityRaw = request.headers.get('x-vercel-ip-city')
  const region = request.headers.get('x-vercel-ip-country-region')

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY)
  await sb.from('page_views').insert({
    path: body.path || '/',
    referrer: body.referrer || null,
    device_type: body.device_type || null,
    browser: body.browser || null,
    country: countryName(countryCode),
    city: cityRaw ? decodeURIComponent(cityRaw) : null,
    region: region || null,
  })

  return new Response(null, { status: 204 })
}
