import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../lib/server'
import { TIER, STATUS, d, eur } from '../../lib/format'
import { JobRequestsTable, UpcomingJobsTable, ActivePlansTable } from './dashboard-tables'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const [{ data: mems }, { data: jobs }, { count: custCount }, { count: propCount }] = await Promise.all([
    sb.from('memberships').select('*, properties(address_line, municipality, customer_id, customers(full_name))'),
    sb.from('jobs').select('*, properties(address_line, municipality, customer_id, customers(full_name))').order('scheduled_for'),
    sb.from('customers').select('*', { count:'exact', head:true }),
    sb.from('properties').select('*', { count:'exact', head:true }),
  ])
  const active = (mems||[]).filter(m => m.status === 'active')
  const mrr = active.reduce((s,m) => s + Number(m.monthly_price_ex_vat || 0), 0)
  const now = new Date()
  const requests = (jobs||[]).filter(j => j.status === 'enquiry')
    .sort((a,b) => Number(b.urgent) - Number(a.urgent) || new Date(a.requested_date || 0) - new Date(b.requested_date || 0))
  const upcoming = (jobs||[]).filter(j => j.status === 'scheduled').slice(0,6)
  const soon = active
    .filter(m => m.anniversary_date && (new Date(m.anniversary_date) - now) / 86400000 < 120)
    .sort((a,b) => new Date(a.anniversary_date) - new Date(b.anniversary_date))

  return (
    <>
      <div className="head">
        <div><h1>Pārskats</h1><div className="sub">AP Komforts — {new Date().toLocaleDateString('lv-LV')}</div></div>
      </div>

      <div className="grid g4">
        <div className="card stat"><div className="n">{custCount ?? 0}</div><div className="l">Klienti</div></div>
        <div className="card stat"><div className="n">{propCount ?? 0}</div><div className="l">Īpašumi</div></div>
        <div className="card stat"><div className="n">{active.length}</div><div className="l">Aktīvi plāni</div></div>
        <div className="card stat"><div className="n">{eur(mrr)}</div><div className="l">Mēneša ieņēmumi (bez PVN)</div></div>
      </div>

      {requests.length > 0 && (
        <div className="card sec" style={{ borderColor: 'var(--acc)' }}>
          <div className="head" style={{ marginBottom: 12 }}>
            <h2 className="sec" style={{ margin: 0 }}>Klientu pieprasījumi</h2>
            <div className="right small muted">Jāpiešķir speciālists un jāapstiprina laiks</div>
          </div>
          <JobRequestsTable requests={requests} />
        </div>
      )}

      <div className="grid g2 sec">
        <div className="card">
          <h2>Nākamie darbi</h2>
          <UpcomingJobsTable upcoming={upcoming} />
        </div>
        <div className="card">
          <h2>Atjaunošana tuvojas</h2>
          <p className="small muted" style={{marginTop:-6,marginBottom:12}}>
            Atgādinājums jāsūta 60–30 dienas pirms termiņa.</p>
          {soon.length ? soon.map(m => (
            <Link key={m.id} href={`/birojs/ipasumi/${m.property_id}`} style={{display:'block',padding:'9px 0',borderBottom:'1px solid #EFEADC'}}>
              <div style={{fontWeight:600,color:'var(--ink)'}}>{m.properties?.customers?.full_name}</div>
              <div className="small muted">{m.properties?.municipality} · {TIER[m.tier]}</div>
              <div className="small" style={{color:'var(--acc)',marginTop:2}}>{d(m.anniversary_date)}</div>
            </Link>
          )) : <p className="muted small">Nav tuvāko atjaunošanu.</p>}
        </div>
      </div>

      <div className="card sec">
        <h2>Aktīvie plāni</h2>
        <ActivePlansTable active={active} />
      </div>
    </>
  )
}
