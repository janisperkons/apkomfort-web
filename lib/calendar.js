const RIGA_TZ = 'Europe/Riga'

// Jobs are stored as UTC timestamps but the calendar must bucket them onto
// the day they fall on in Riga local time, not the server's (UTC) day —
// otherwise anything scheduled after ~21:00 Riga time lands on the wrong cell.
export function dateKeyInRiga(isoString) {
  if (!isoString) return null
  return new Intl.DateTimeFormat('en-CA', { timeZone: RIGA_TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(isoString))
}

export function timeLabelInRiga(isoString) {
  if (!isoString) return null
  return new Intl.DateTimeFormat('lv-LV', { timeZone: RIGA_TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(isoString))
}

export function currentMonthKey() {
  return dateKeyInRiga(new Date().toISOString()).slice(0, 7)
}

function pad2(n) { return String(n).padStart(2, '0') }
function toKey(y, m, d) { return `${y}-${pad2(m)}-${pad2(d)}` }

// Monday-first grid of the given YYYY-MM month, padded with adjacent-month
// days so every row has 7 cells.
export function buildMonthGrid(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1))
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const firstWeekday = firstOfMonth.getUTCDay() // 0=Sun..6=Sat
  const leadingDays = (firstWeekday + 6) % 7 // shift so Monday=0

  const cells = []
  for (let i = leadingDays; i > 0; i--) {
    const d = new Date(Date.UTC(year, month - 1, 1 - i))
    cells.push({ key: toKey(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()), inMonth: false, day: d.getUTCDate() })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: toKey(year, month, day), inMonth: true, day })
  }
  while (cells.length % 7 !== 0) {
    const [ly, lm, ld] = cells[cells.length - 1].key.split('-').map(Number)
    const d = new Date(Date.UTC(ly, lm - 1, ld + 1))
    cells.push({ key: toKey(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()), inMonth: false, day: d.getUTCDate() })
  }
  return cells
}

export function shiftMonthKey(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1 + delta, 1))
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`
}

export function shiftDateKey(dateKey, delta) {
  const [y, m, day] = dateKey.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1, day + delta))
  return toKey(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
}

function daysBetweenKeys(fromKey, toDateKey) {
  const [y1, m1, d1] = fromKey.split('-').map(Number)
  const [y2, m2, d2] = toDateKey.split('-').map(Number)
  const a = Date.UTC(y1, m1 - 1, d1)
  const b = Date.UTC(y2, m2 - 1, d2)
  return Math.round((b - a) / 86400000)
}

// Traffic-light color for a tāme's presence on the calendar: green once
// accepted, otherwise orange — escalating to red once its start date is
// within 2 days (or already passed) and it's still not approved.
export function quoteCalendarColor(quote, todayKey) {
  if (quote.status === 'accepted') return 'green'
  const startKey = quote.target_start_date
  if (!startKey) return null
  return daysBetweenKeys(todayKey, startKey) <= 2 ? 'red' : 'orange'
}

// The date keys a tāme occupies on the calendar — its accepted start date
// once confirmed, otherwise the target date dad/client proposed — spanning
// duration_days so multi-day jobs block out the whole run, not just day one.
export function quoteOccupiedDays(quote) {
  const startKey = quote.status === 'accepted' ? quote.agreed_start_date : quote.target_start_date
  if (!startKey) return []
  const days = Math.max(1, Number(quote.duration_days) || 1)
  const keys = []
  for (let i = 0; i < days; i++) keys.push(i === 0 ? startKey : shiftDateKey(startKey, i))
  return keys
}
