import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { TIER, STATUS, d } from '../../../lib/format'

export const dynamic = 'force-dynamic'
const TYPE = { private:'Privātpersona', landlord:'Izīrētājs', commercial:'Komercklients' }

export default async function Klienti() {
  const sb = await supabaseServer()
  const { data } = await sb.from('customers')
    .select('*, properties(id, address_line, municipality, floor_area_m2, memberships(tier,status,signed_on))')
    .order('full_name')
  return (
    <>
      <div className="head"><div><h1>Klienti</h1>
        <div className="sub">{data?.length || 0} klienti · visi kontakti un īpašumi</div></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Vārds</th><th>Veids</th><th>Telefons</th><th>E-pasts</th><th>Val.</th><th>Īpašumi</th></tr></thead>
          <tbody>
            {(data||[]).map(c => (
              <tr key={c.id}>
                <td style={{fontWeight:600,color:'var(--ink)'}}>{c.full_name}
                  {c.notes && <div className="small muted" style={{fontWeight:400,marginTop:2}}>{c.notes}</div>}</td>
                <td className="small">{TYPE[c.customer_type]}</td>
                <td><a href={`tel:${(c.phone||'').split(' ').join('')}`} style={{color:'var(--ink)',fontWeight:600}}>{c.phone || '—'}</a></td>
                <td className="small"><a href={`mailto:${c.email}`} className="muted">{c.email || '—'}</a></td>
                <td className="small muted">{(c.language||'lv').toUpperCase()}</td>
                <td>
                  {(c.properties||[]).map(p => (
                    <div key={p.id} style={{marginBottom:5}}>
                      <Link href={`/birojs/ipasumi/${p.id}`} style={{color:'var(--ink)',fontWeight:600,fontSize:13.5}}>
                        {p.address_line}, {p.municipality}</Link>
                      {p.floor_area_m2 ? <span className="small muted"> · {p.floor_area_m2} m²</span> : null}
                      {(p.memberships||[]).map((m,i) => {
                        const s = STATUS[m.status] || ['—','p-pending']
                        return <span key={i} style={{marginLeft:8}}>
                          <span className="pill p-tier">{TIER[m.tier]}</span>{' '}
                          <span className={'pill ' + s[1]}>{s[0]}</span></span>
                      })}
                    </div>))}
                </td>
              </tr>))}
          </tbody></table>
      </div>
    </>
  )
}
