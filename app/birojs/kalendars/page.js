import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import { JOB } from '../../../lib/format'
import { dateKeyInRiga, timeLabelInRiga, currentMonthKey, buildMonthGrid, shiftMonthKey } from '../../../lib/calendar'

export const dynamic = 'force-dynamic'
const WEEKDAYS = ['Pi', 'O', 'T', 'C', 'Pk', 'S', 'Sv']

export default async function Kalendars({ searchParams }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const sp = await searchParams
  const monthKey = /^\d{4}-\d{2}$/.test(sp?.month || '') ? sp.month : currentMonthKey()

  const { data: jobs } = await sb.from('jobs')
    .select('id, kind, status, scheduled_for, requested_date, properties(customer_id, customers(full_name))')
    .neq('status', 'cancelled')

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
        <div><h1>Kalendārs</h1><div className="sub">Ieplānotie un pieprasītie darbi pa dienām</div></div>
        <div className="right" style={{ display: 'flex', gap: 8 }}>
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
