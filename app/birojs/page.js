import Link from 'next/link'
import { supabaseServer } from '../../lib/server'
import { TIER, STATUS, JOB, d, dt, eur } from '../../lib/format'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const sb = await supabaseServer()
  const [{ data: mems }, { data: jobs }, { count: custCount }, { count: propCount }] = await Promise.all([
    sb.from('memberships').select('*, properties(address_line, municipality, customers(full_name))'),
    sb.from('jobs').select('*, properties(address_line, municipality, customers(full_name))').order('scheduled_for'),
    sb.from('customers').select('*', { count:'exact', head:true }),
    sb.from('properties').select('*', { count:'exact', head:true }),
  ])
  const active = (mems||[]).filter(m => m.status === 'active')
  const mrr = active.reduce((s,m) => s + Number(m.monthly_price_ex_vat || 0), 0)
  const now = new Date()
  const upcoming = (jobs||[]).filter(j => j.status === 'scheduled').slice(0,6)
  const soon = active
    .filter(m => m.anniversary_date && (new Date(m.anniversary_date) - now) / 86400000 < 120)
    .sort((a,b) => new Date(a.anniversary_date) - new Date(b.anniversary_date))

  return (
    <>
      <div className="head">
        <div><h1>Pārskats</h1><div className="sub">AP Komfort — {new Date().toLocaleDateString('lv-LV')}</div></div>
      </div>

      <div className="grid g4">
        <div className="card stat"><div className="n">{custCount ?? 0}</div><div className="l">Klienti</div></div>
        <div className="card stat"><div className="n">{propCount ?? 0}</div><div className="l">Īpašumi</div></div>
        <div className="card stat"><div className="n">{active.length}</div><div className="l">Aktīvi plāni</div></div>
        <div className="card stat"><div className="n">{eur(mrr)}</div><div className="l">Mēneša ieņēmumi (bez PVN)</div></div>
      </div>

      <div className="grid g2 sec">
        <div className="card">
          <h2>Nākamie darbi</h2>
          <table><thead><tr><th>Datums</th><th>Veids</th><th>Klients</th><th>Adrese</th></tr></thead>
            <tbody>{upcoming.length ? upcoming.map(j => (
              <tr key={j.id}>
                <td>{dt(j.scheduled_for)}</td>
                <td>{JOB[j.kind]}</td>
                <td>{j.properties?.customers?.full_name}</td>
                <td className="muted small">{j.properties?.address_line}, {j.properties?.municipality}</td>
              </tr>)) : <tr><td colSpan="4" className="muted">Nav ieplānotu darbu.</td></tr>}
            </tbody></table>
        </div>
        <div className="card">
          <h2>Atjaunošana tuvojas</h2>
          <p className="small muted" style={{marginTop:-6,marginBottom:12}}>
            Atgādinājums jāsūta 60–30 dienas pirms termiņa.</p>
          {soon.length ? soon.map(m => (
            <div key={m.id} style={{padding:'9px 0',borderBottom:'1px solid #EFEADC'}}>
              <div style={{fontWeight:600,color:'var(--ink)'}}>{m.properties?.customers?.full_name}</div>
              <div className="small muted">{m.properties?.municipality} · {TIER[m.tier]}</div>
              <div className="small" style={{color:'var(--acc)',marginTop:2}}>{d(m.anniversary_date)}</div>
            </div>
          )) : <p className="muted small">Nav tuvāko atjaunošanu.</p>}
        </div>
      </div>

      <div className="card sec">
        <h2>Aktīvie plāni</h2>
        <table><thead><tr><th>Klients</th><th>Īpašums</th><th>Plāns</th><th>Cena / mēn.</th><th>Parakstīts</th><th>Atjaunošana</th></tr></thead>
          <tbody>{active.map(m => (
            <tr key={m.id}>
              <td style={{fontWeight:600}}>{m.properties?.customers?.full_name}</td>
              <td className="small">{m.properties?.address_line}, {m.properties?.municipality}</td>
              <td><span className="pill p-tier">{TIER[m.tier]}</span></td>
              <td>{eur(m.monthly_price_ex_vat)}</td>
              <td className="small">{d(m.signed_on)}</td>
              <td className="small">{d(m.anniversary_date)}</td>
            </tr>))}
          </tbody></table>
      </div>
    </>
  )
}
