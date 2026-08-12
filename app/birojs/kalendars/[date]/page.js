import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { JOB, JOB_STATUS, QUOTE_STATUS, TIER, eur } from '../../../../lib/format'
import { dateKeyInRiga, timeLabelInRiga, shiftDateKey, quoteCalendarColor, quoteOccupiedDays } from '../../../../lib/calendar'

export const dynamic = 'force-dynamic'
const COLOR_LABEL = { green: 'Apstiprināta', orange: 'Gaida apstiprinājumu', red: 'Nav apstiprināta — sākas drīz' }
const COLOR_PILL = { green: 'p-active', orange: 'p-pending', red: 'p-declined' }

export default async function KalendaraDiena({ params }) {
  const { date } = await params
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const [{ data: jobs }, { data: quotes }] = await Promise.all([
    sb.from('jobs').select(`*, properties(id, address_line, municipality, customer_id, customers(full_name, phone))`).neq('status', 'cancelled'),
    sb.from('quotes').select('id, quote_number, contact_name, contact_phone, status, total, target_start_date, duration_days, agreed_start_date, customer_id')
      .in('status', ['draft', 'sent', 'accepted']),
  ])

  const dayJobs = (jobs || [])
    .filter(j => (j.scheduled_for ? dateKeyInRiga(j.scheduled_for) : j.requested_date) === date)
    .sort((a, b) => {
      const ta = a.scheduled_for ? new Date(a.scheduled_for).getTime() : Infinity
      const tb = b.scheduled_for ? new Date(b.scheduled_for).getTime() : Infinity
      return ta - tb
    })

  const today = dateKeyInRiga(new Date().toISOString())
  const dayQuotes = (quotes || [])
    .filter(q => quoteOccupiedDays(q).includes(date))
    .map(q => ({ ...q, color: quoteCalendarColor(q, today) }))

  const monthKey = date.slice(0, 7)
  const label = new Intl.DateTimeFormat('lv-LV', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Riga',
  }).format(new Date(date + 'T12:00:00Z'))

  return (
    <>
      <div className="head">
        <div><h1 style={{ textTransform: 'capitalize' }}>{label}</h1>
          <div className="sub">
            {dayJobs.length ? `${dayJobs.length} darbi` : 'Nav darbu'}{dayQuotes.length ? ` · ${dayQuotes.length} tāmes` : ''} šajā dienā
          </div></div>
        <div className="right" style={{ display: 'flex', gap: 8 }}>
          <Link href={`/birojs/tames/jauna?date=${date}`} className="btn">+ Jauna tāme šai dienai</Link>
          <Link href={`/birojs/kalendars/${shiftDateKey(date, -1)}`} className="btn ghost">← Iepr. diena</Link>
          <Link href={`/birojs/kalendars?month=${monthKey}`} className="btn ghost">Mēnesis</Link>
          <Link href={`/birojs/kalendars/${shiftDateKey(date, 1)}`} className="btn ghost">Nāk. diena →</Link>
        </div>
      </div>

      {dayQuotes.length > 0 && (
        <div className="card sec">
          <h2 className="sec" style={{ marginBottom: 12 }}>Tāmes</h2>
          {dayQuotes.map(q => {
            const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']
            return (
              <div key={q.id} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #EFEADC', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    <Link href={`/birojs/tames/${q.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{q.contact_name}</Link>
                    {' · '}<span className="small muted">{q.quote_number}</span>
                  </div>
                  <div className="small muted" style={{ marginTop: 2 }}>
                    {eur(q.total)} · {q.duration_days} {q.duration_days === 1 ? 'diena' : 'dienas'}
                    {q.contact_phone && <> · {q.contact_phone}</>}
                  </div>
                </div>
                <span className={'pill ' + s[1]}>{s[0]}</span>
                {q.color && <span className={'pill ' + COLOR_PILL[q.color]}>{COLOR_LABEL[q.color]}</span>}
                <Link href={`/birojs/tames/${q.id}`} className="btn ghost small" style={{ whiteSpace: 'nowrap' }}>Skatīt tāmi →</Link>
              </div>
            )
          })}
        </div>
      )}

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Darbi</h2>
        {dayJobs.length ? dayJobs.map(j => {
          const s = JOB_STATUS[j.status] || ['—', 'p-pending']
          return (
            <div key={j.id} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid #EFEADC' }}>
              <div style={{ minWidth: 76, paddingTop: 2 }}>
                {j.scheduled_for
                  ? <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{timeLabelInRiga(j.scheduled_for)}</div>
                  : <span className="pill p-pending">Pieprasīts</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  {JOB[j.kind]}
                  {j.urgent && <span className="pill p-declined" style={{ marginLeft: 6 }}>Steidzams</span>}
                  {j.out_of_hours && <span className="pill p-oo" style={{ marginLeft: 6 }}>ĀDL</span>}
                  {j.requested_membership_tier && <span className="pill p-tier" style={{ marginLeft: 6 }}>+ {TIER[j.requested_membership_tier]}</span>}
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>
                  {j.properties?.customer_id ? (
                    <Link href={`/birojs/klienti/${j.properties.customer_id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>
                      {j.properties.customers?.full_name}</Link>
                  ) : (j.properties?.customers?.full_name || '—')}
                  {' · '}
                  <Link href={`/birojs/ipasumi/${j.properties?.id}`} className="muted">
                    {j.properties?.address_line}, {j.properties?.municipality}</Link>
                </div>
                {j.properties?.customers?.phone && (
                  <a href={`tel:${j.properties.customers.phone.split(' ').join('')}`}
                    className="small" style={{ color: 'var(--ink)', fontWeight: 600, display: 'inline-block', marginTop: 4 }}>
                    {j.properties.customers.phone}</a>
                )}
                {j.requested_notes && <div className="small muted" style={{ marginTop: 4 }}>{j.requested_notes}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className={'pill ' + s[1]}>{s[0]}</span>
                <Link href={`/birojs/ipasumi/${j.properties?.id}#job-${j.id}`} className="btn ghost small" style={{ whiteSpace: 'nowrap' }}>
                  Skatīt darbu →
                </Link>
              </div>
            </div>
          )
        }) : <p className="muted small">Nav ieplānotu vai pieprasītu darbu.</p>}
      </div>
    </>
  )
}
