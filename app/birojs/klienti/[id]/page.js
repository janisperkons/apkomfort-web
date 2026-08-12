import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { TIER, STATUS, d } from '../../../../lib/format'
import EditCustomer from '../../ipasumi/[id]/edit-customer'

export const dynamic = 'force-dynamic'
const TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

export default async function KlientsDetail({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: c } = await sb.from('customers')
    .select(`*, properties(id, address_line, municipality, property_type, floor_area_m2, memberships(tier, status, signed_on))`)
    .eq('id', id).single()
  if (!c) notFound()

  const { data: comms } = await sb.from('communications')
    .select('*').eq('customer_id', id).order('occurred_at', { ascending: false })

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Klients</div>
          <h1>{c.full_name}</h1>
          <div className="sub">{TYPE[c.customer_type]} · {(c.properties || []).length} īpašumi</div>
        </div>
        <div className="right"><Link href="/birojs/klienti" className="btn ghost">← Visi klienti</Link></div>
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Kontaktinformācija</h3>
          <dl className="kv">
            <dt>Vārds</dt><dd style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.full_name}</dd>
            <dt>Veids</dt><dd>{TYPE[c.customer_type]}</dd>
            <dt>Telefons</dt><dd><a href={`tel:${(c.phone || '').split(' ').join('')}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.phone || '—'}</a></dd>
            <dt>E-pasts</dt><dd><a href={`mailto:${c.email}`}>{c.email || '—'}</a></dd>
            <dt>Valoda</dt><dd>{(c.language || 'lv').toUpperCase()}</dd>
            <dt>Klients kopš</dt><dd>{d(c.created_at)}</dd>
          </dl>
          {c.notes && <div className="note small" style={{ marginTop: 14 }}>{c.notes}</div>}
          <div style={{ marginTop: 12 }}><EditCustomer customer={c} /></div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Īpašumi</h3>
          {(c.properties || []).length ? (c.properties || []).map(p => {
            const m = (p.memberships || [])[0]
            const s = m ? (STATUS[m.status] || ['—', 'p-pending']) : null
            return (
              <Link key={p.id} href={`/birojs/ipasumi/${p.id}`}
                style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #EFEADC' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.address_line}, {p.municipality}</div>
                <div className="small muted">
                  {p.property_type}{p.floor_area_m2 ? ` · ${p.floor_area_m2} m²` : ''}
                  {m && <> · <span className="pill p-tier">{TIER[m.tier]}</span>{' '}
                    <span className={'pill ' + s[1]}>{s[0]}</span></>}
                </div>
              </Link>
            )
          }) : <p className="muted small">Nav īpašumu.</p>}
        </div>
      </div>

      {(comms || []).length > 0 && (
        <>
          <h2 className="sec">Sarakste un zvani</h2>
          <div className="card"><table>
            <thead><tr><th>Datums</th><th>Veids</th><th>Kopsavilkums</th></tr></thead>
            <tbody>{comms.map(cm => (
              <tr key={cm.id}><td className="small">{d(cm.occurred_at)}</td>
                <td className="small">{cm.kind === 'call' ? 'Zvans' : cm.kind}</td><td>{cm.summary}</td></tr>))}
            </tbody></table></div>
        </>
      )}
    </>
  )
}
