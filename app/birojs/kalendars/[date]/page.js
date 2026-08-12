import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { JOB, JOB_STATUS, TIER } from '../../../../lib/format'
import { dateKeyInRiga, timeLabelInRiga, shiftDateKey } from '../../../../lib/calendar'

export const dynamic = 'force-dynamic'

export default async function KalendaraDiena({ params }) {
  const { date } = await params
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const { data: jobs } = await sb.from('jobs')
    .select(`*, properties(id, address_line, municipality, customer_id, customers(full_name, phone))`)
    .neq('status', 'cancelled')

  const dayJobs = (jobs || [])
    .filter(j => (j.scheduled_for ? dateKeyInRiga(j.scheduled_for) : j.requested_date) === date)
    .sort((a, b) => {
      const ta = a.scheduled_for ? new Date(a.scheduled_for).getTime() : Infinity
      const tb = b.scheduled_for ? new Date(b.scheduled_for).getTime() : Infinity
      return ta - tb
    })

  const monthKey = date.slice(0, 7)
  const label = new Intl.DateTimeFormat('lv-LV', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Riga',
  }).format(new Date(date + 'T12:00:00Z'))

  return (
    <>
      <div className="head">
        <div><h1 style={{ textTransform: 'capitalize' }}>{label}</h1>
          <div className="sub">{dayJobs.length ? `${dayJobs.length} darbi šajā dienā` : 'Nav darbu šajā dienā'}</div></div>
        <div className="right" style={{ display: 'flex', gap: 8 }}>
          <Link href={`/birojs/kalendars/${shiftDateKey(date, -1)}`} className="btn ghost">← Iepr. diena</Link>
          <Link href={`/birojs/kalendars?month=${monthKey}`} className="btn ghost">Mēnesis</Link>
          <Link href={`/birojs/kalendars/${shiftDateKey(date, 1)}`} className="btn ghost">Nāk. diena →</Link>
        </div>
      </div>

      <div className="card">
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
              <div><span className={'pill ' + s[1]}>{s[0]}</span></div>
            </div>
          )
        }) : <p className="muted small">Šajā dienā nav ieplānotu vai pieprasītu darbu.</p>}
      </div>
    </>
  )
}
