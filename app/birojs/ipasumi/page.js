import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { TIER, STATUS, KIND, d } from '../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function Ipasumi() {
  const sb = await supabaseServer()
  const { data } = await sb.from('properties')
    .select('*, customers(id, full_name, phone), equipment(kind, manufacturer, model, installed_year), memberships(tier,status,signed_on,anniversary_date)')
    .order('municipality')
  return (
    <>
      <div className="head"><div><h1>Īpašumi</h1>
        <div className="sub">{data?.length || 0} īpašumi · iekārtas, plāni un platība</div></div>
        <div className="right"><Link href="/birojs/klienti/jauns" className="btn">+ Jauns klients</Link></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Adrese</th><th>Novads</th><th>Platība</th><th>Klients</th><th>Iekārta</th><th>Plāns</th><th>Parakstīts</th></tr></thead>
          <tbody>{(data||[]).map(p => {
            const m = (p.memberships||[])[0]
            const s = m ? (STATUS[m.status] || ['—','p-pending']) : null
            const eq = (p.equipment||[]).filter(e => e.kind !== 'cylinder')[0]
            return (
              <tr key={p.id}>
                <td><Link href={`/birojs/ipasumi/${p.id}`} style={{fontWeight:600,color:'var(--ink)'}}>{p.address_line}</Link>
                  <div className="small muted">{p.property_type}</div></td>
                <td className="small">{p.municipality}</td>
                <td className="small">{p.floor_area_m2 ? p.floor_area_m2 + ' m²' : '—'}</td>
                <td className="small">
                  {p.customers?.id ? (
                    <Link href={`/birojs/klienti/${p.customers.id}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.customers.full_name}</Link>
                  ) : (p.customers?.full_name || '—')}
                  <div className="muted">{p.customers?.phone}</div>
                </td>
                <td className="small">{eq ? <>{eq.manufacturer} {eq.model}<div className="muted">{KIND[eq.kind]} · {eq.installed_year}</div></> : '—'}</td>
                <td>{m ? <><span className="pill p-tier">{TIER[m.tier]}</span>{' '}<span className={'pill ' + s[1]}>{s[0]}</span></> : '—'}</td>
                <td className="small">{d(m?.signed_on)}</td>
              </tr>)})}
          </tbody></table>
      </div>
    </>
  )
}
