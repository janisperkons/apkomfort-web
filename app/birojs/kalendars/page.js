import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import { JOB, JOB_STATUS, TIER, dt, eur } from '../../../lib/format'
import { dateKeyInRiga, timeLabelInRiga, currentMonthKey, buildMonthGrid, shiftMonthKey } from '../../../lib/calendar'

export const dynamic = 'force-dynamic'
const WEEKDAYS = ['Pi', 'O', 'T', 'C', 'Pk', 'S', 'Sv']

export default async function Kalendars({ searchParams }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const sp = await searchParams
  const view = sp?.view === 'list' ? 'list' : 'calendar'

  const { data: jobs } = await sb.from('jobs')
    .select('*, properties(id, address_line, municipality, customer_id, customers(full_name, phone))')
    .neq('status', 'cancelled')

  if (view === 'list') {
    const sorted = [...(jobs || [])].sort((a, b) =>
      new Date(b.completed_at || b.scheduled_for || b.requested_date || 0) - new Date(a.completed_at || a.scheduled_for || a.requested_date || 0))
    const done = sorted.filter(j => j.status === 'completed')
    const rev = done.reduce((s, j) => s + Number(j.labour_charged_ex_vat || 0) + Number(j.parts_charged_ex_vat || 0), 0)

    return (
      <>
        <div className="head">
          <div><h1>Darbu kalendārs</h1>
            <div className="sub">{sorted.length} ieraksti · {done.length} pabeigti · {eur(rev)} izrakstīts (bez PVN)</div></div>
          <div className="right" style={{ display: 'flex', gap: 8 }}>
            <Link href="/birojs/kalendars" className="btn ghost">Kalendārs</Link>
            <Link href="/birojs/kalendars?view=list" className="btn">Saraksts</Link>
          </div>
        </div>
        <div className="card">
          <table>
            <thead><tr><th>Datums</th><th>Veids</th><th>Klients</th><th>Adrese</th><th>Statuss</th><th>Darbs</th><th>Detaļas</th></tr></thead>
            <tbody>{sorted.map(j => {
              const s = JOB_STATUS[j.status] || ['—', 'p-pending']
              return (
                <tr key={j.id}>
                  <td className="small">{dt(j.completed_at || j.scheduled_for)}</td>
                  <td>{JOB[j.kind]}
                    {j.out_of_hours && <span className="pill p-oo" style={{ marginLeft: 6 }}>ĀDL</span>}
                    {j.urgent && <span className="pill p-declined" style={{ marginLeft: 6 }}>Steidzams</span>}
                    {j.requested_membership_tier && <span className="pill p-tier" style={{ marginLeft: 6 }}>+ {TIER[j.requested_membership_tier]}</span>}
                  </td>
                  <td className="small">
                    {j.properties?.customer_id ? (
                      <Link href={`/birojs/klienti/${j.properties.customer_id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{j.properties.customers?.full_name}</Link>
                    ) : (j.properties?.customers?.full_name || '—')}
                  </td>
                  <td className="small">
                    <Link href={`/birojs/ipasumi/${j.properties?.id}#job-${j.id}`} style={{ color: 'var(--ink)' }}>
                      {j.properties?.address_line}, {j.properties?.municipality}</Link>
                  </td>
                  <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
                  <td className="small">{eur(j.labour_charged_ex_vat)}</td>
                  <td className="small">{eur(j.parts_charged_ex_vat)}</td>
                </tr>)
            })}
            </tbody></table>
        </div>
      </>
    )
  }

  const monthKey = /^\d{4}-\d{2}$/.test(sp?.month || '') ? sp.month : currentMonthKey()

  const byDay = {}
  for (const j of (jobs || [])) {
    const key = j.scheduled_for ? dateKeyInRiga(j.scheduled_for) : (j.requested_date || null)
    if (!key) continue
    ;(byDay[key] ||= []).push(j)
  }
  for (const key in byDay) {
    byDay[key].sort((a, b) => {
      const ta = a.scheduled_for ? new Date(a.scheduled_for).getTime() : Infinity
      const tb = b.scheduled_for ? new Date(b.scheduled_for).getTime() : Infinity
      return ta - tb
    })
  }

  const cells = buildMonthGrid(monthKey)
  const [year, month] = monthKey.split('-').map(Number)
  const monthLabel = new Intl.DateTimeFormat('lv-LV', { month: 'long', year: 'numeric', timeZone: 'Europe/Riga' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
  const today = dateKeyInRiga(new Date().toISOString())

  return (
    <>
      <div className="head">
        <div><h1>Darbu kalendārs</h1><div className="sub">Ieplānotie un pieprasītie darbi pa dienām</div></div>
        <div className="right" style={{ display: 'flex', gap: 8 }}>
          <Link href="/birojs/kalendars" className="btn">Kalendārs</Link>
          <Link href="/birojs/kalendars?view=list" className="btn ghost">Saraksts</Link>
          <Link href={`/birojs/kalendars?month=${shiftMonthKey(monthKey, -1)}`} className="btn ghost">← Iepr.</Link>
          <Link href={`/birojs/kalendars?month=${currentMonthKey()}`} className="btn ghost">Šodien</Link>
          <Link href={`/birojs/kalendars?month=${shiftMonthKey(monthKey, 1)}`} className="btn ghost">Nāk. →</Link>
        </div>
      </div>

      <h2 style={{ textTransform: 'capitalize' }}>{monthLabel}</h2>

      <div className="cal-grid">
        {WEEKDAYS.map(w => <div key={w} className="cal-wd">{w}</div>)}
        {cells.map(c => {
          const dayJobs = byDay[c.key] || []
          const isToday = c.key === today
          return (
            <Link key={c.key} href={`/birojs/kalendars/${c.key}`}
              className={'cal-day' + (c.inMonth ? '' : ' out') + (isToday ? ' today' : '')}>
              <div className="cal-daynum">{c.day}</div>
              {dayJobs.length > 0 && <div className="cal-dot" />}
              <div className="cal-chips">
                {dayJobs.slice(0, 3).map(j => (
                  <div key={j.id} className={'cal-chip' + (!j.scheduled_for ? ' requested' : '')}>
                    {j.scheduled_for ? timeLabelInRiga(j.scheduled_for) + ' ' : ''}
                    {j.properties?.customers?.full_name || JOB[j.kind]}
                  </div>
                ))}
                {dayJobs.length > 3 && <div className="cal-more">+{dayJobs.length - 3} vairāk</div>}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
