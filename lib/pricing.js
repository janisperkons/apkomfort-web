// AP Komfort — membership price calculator engine.
// Mirrors "01 Business Case / AP Komfort - Pricing Engine" exactly (DEC-003, DEC-004, DEC-024).
// Every figure here is the admin's rate card — if it looks wrong, the rate card is wrong, not the formula.

export const SYSTEM_TYPES = [
  { value: 'gas_combi', label: 'Gāzes katls — combi', base: 10 },
  { value: 'gas_cylinder', label: 'Gāzes katls — ar cilindru', base: 11 },
  { value: 'electric', label: 'Elektriskais katls', base: 9 },
  { value: 'pellet', label: 'Granulu vai cietā kurināmā katls', base: 13 },
  { value: 'hp_air_air', label: 'Siltumsūknis — gaiss-gaiss', base: 9 },
  { value: 'hp_air_water', label: 'Siltumsūknis — gaiss-ūdens', base: 14 },
  { value: 'hp_ground', label: 'Siltumsūknis — grunts', base: 16 },
]

export const SYSTEM_AGES = [
  { value: 'under_5', label: 'Līdz 5 gadiem', multiplier: 0.95, years: 3 },
  { value: '5_10', label: '5–10 gadi', multiplier: 1, years: 8 },
  { value: '11_15', label: '11–15 gadi', multiplier: 1.15, years: 13 },
  { value: 'over_15', label: 'Vairāk par 15 gadiem', multiplier: 1.3, years: 18 },
  { value: 'not_sure', label: 'Nezinu', multiplier: 1.1, years: 12 },
]

export const PROPERTY_SIZES = [
  { value: 'under_100', label: 'Līdz 100 m²', multiplier: 0.95 },
  { value: '100_200', label: '100–200 m²', multiplier: 1 },
  { value: '201_300', label: '201–300 m²', multiplier: 1.15 },
  { value: 'over_300', label: 'Virs 300 m²', multiplier: 1.3 },
]

export const SERVICE_HISTORIES = [
  { value: 'within_12m', label: 'Apkopts pēdējo 12 mēnešu laikā', multiplier: 0.95, flag: false },
  { value: '1_3y', label: 'Apkopts pirms 1–3 gadiem', multiplier: 1, flag: false },
  { value: 'over_3y', label: 'Vairāk par 3 gadiem, nekad vai nezinu', multiplier: 1.15, flag: true },
]

const FLOOR = 8
const CEILING = 35
const BAND = 0.1
const STEP = 0.5
const TIER2_RATIO = 1.5
const TIER3_RATIO = 2.5
const TIER3_MAX_AGE_YEARS = 10

const round = (n) => Math.round(n / STEP) * STEP

function find(list, value) {
  return list.find((o) => o.value === value)
}

// Ballpark from question 1 alone — base price, no multipliers yet.
export function ballpark(systemTypeValue) {
  const type = find(SYSTEM_TYPES, systemTypeValue)
  if (!type) return null
  return band(round(clamp(type.base)))
}

function clamp(n) {
  return Math.min(Math.max(n, FLOOR), CEILING)
}

function band(price) {
  return { from: round(price * (1 - BAND)), to: round(price * (1 + BAND)) }
}

// Full four-question calculation. Any answer may be omitted (progressive disclosure) —
// missing answers default to the neutral multiplier of 1.
export function calculate({ systemType, systemAge, propertySize, serviceHistory }) {
  const type = find(SYSTEM_TYPES, systemType)
  if (!type) return null

  const age = find(SYSTEM_AGES, systemAge)
  const size = find(PROPERTY_SIZES, propertySize)
  const history = find(SERVICE_HISTORIES, serviceHistory)

  const raw = type.base * (age?.multiplier ?? 1) * (size?.multiplier ?? 1) * (history?.multiplier ?? 1)
  const overCeiling = raw > CEILING
  const tier1 = round(clamp(raw))

  const tier3Gated = age ? age.years > TIER3_MAX_AGE_YEARS : false
  const flagged = Boolean(age?.value === 'over_15' || history?.flag)

  const tier2 = round(tier1 * TIER2_RATIO)
  const tier3 = round(tier1 * TIER3_RATIO)

  return {
    overCeiling,
    tier1: band(tier1),
    tier2: band(tier2),
    tier3: tier3Gated ? null : band(tier3),
    tier3Gated,
    flagged,
  }
}

export const monthly = (n) => `${n.toFixed(2).replace('.', ',')} €`
export const yearly = (n) => `${Math.round(n * 12)} €`

// Which tier to mark as the match, and why — grounded in the same signals the
// engine already computes (age gate, service-history flag), not an arbitrary default.
export function recommendTier({ tier3Gated, flagged }) {
  if (tier3Gated) {
    return {
      tier: 'tier2',
      reason:
        'Jūsu sistēmas vecums nozīmē biežāku uzmanību — Komforts plāns iekļauj līdz 3 izsaukumiem gadā ar prioritāti un bez papildu maksas.',
    }
  }
  if (flagged) {
    return {
      tier: 'tier2',
      reason:
        'Sistēmai ilgstoši nav bijusi apkope. Komforts plāns iekļauj līdz 3 izsaukumiem gadā, kas sedz to, kas var atklāties pirmajā vizītē.',
    }
  }
  return {
    tier: 'tier3',
    reason:
      'Jūsu sistēma ir labi kopta — Komforts Pilns plāns iekļauj arī rezerves daļu segumu līdz €150 gadā, kamēr sistēma ir šajā stāvoklī.',
  }
}
