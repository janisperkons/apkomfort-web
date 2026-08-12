import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { TIER, STATUS, KIND, INVOICE_STATUS, d, eur } from '../../../../lib/format'
import EditCustomer from '../../ipasumi/[id]/edit-customer'
import EditEquipment from '../../ipasumi/[id]/edit-equipment'
import AddEquipmentForm from '../../ipasumi/[id]/add-equipment-form'
import PhotoGallery from '../../ipasumi/[id]/photo-gallery'
import StaffPhotoUpload from '../../ipasumi/[id]/staff-photo-upload'

export const dynamic = 'force-dynamic'
const TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

export default async function KlientsDetail({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: c } = await sb.from('customers')
    .select(`*, properties(id, address_line, municipality, property_type, floor_area_m2,
             memberships(tier, status, signed_on), equipment(*, equipment_photos(*)))`)
    .eq('id', id).single()
  if (!c) notFound()

  const { data: comms } = await sb.from('communications')
    .select('*').eq('customer_id', id).order('occurred_at', { ascending: false })

  const { data: invoices } = await sb.from('invoices')
    .select('*').eq('customer_id', id).order('created_at', { ascending: false })

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Klients</div>
          <h1>{c.customer_type === 'commercial' && c.company_name ? c.company_name : c.full_name}</h1>
          <div className="sub">{TYPE[c.customer_type]} · {(c.properties || []).length} īpašumi</div>
        </div>
        <div className="right"><Link href="/birojs/klienti" className="btn ghost">← Visi klienti</Link></div>
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Kontaktinformācija</h3>
          <dl className="kv">
            {c.customer_type === 'commercial' && c.company_name && (
              <><dt>Uzņēmums</dt><dd style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.company_name}</dd></>
            )}
            <dt>{c.customer_type === 'commercial' ? 'Kontaktpersona' : 'Vārds'}</dt><dd style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.full_name}</dd>
            <dt>Veids</dt><dd>{TYPE[c.customer_type]}</dd>
            {c.customer_type === 'commercial' && c.registration_number && (
              <><dt>Reģ. numurs</dt><dd>{c.registration_number}</dd></>
            )}
            {c.customer_type === 'commercial' && c.legal_address && (
              <><dt>Juridiskā adrese</dt><dd>{c.legal_address}</dd></>
            )}
            {c.customer_type === 'commercial' && c.vat_number && (
              <><dt>PVN numurs</dt><dd>{c.vat_number}</dd></>
            )}
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

      <div className="sec">
        <div className="head" style={{ marginBottom: 12 }}>
          <h2 className="sec" style={{ margin: 0 }}>Rēķini</h2>
          <div className="right">
            <Link href={`/birojs/klienti/${id}/rekini/jauns`} className="btn ghost">+ Jauns rēķins</Link>
          </div>
        </div>
        <div className="card">
          {(invoices || []).length ? (invoices || []).map(inv => {
            const s = INVOICE_STATUS[inv.status] || ['—', 'p-pending']
            return (
              <Link key={inv.id} href={`/birojs/rekini/${inv.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EFEADC' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Rēķins Nr. {inv.invoice_number}</div>
                  <div className="small muted">{d(inv.issue_date)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={'pill ' + s[1]}>{s[0]}</span>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</div>
                </div>
              </Link>
            )
          }) : <p className="muted small">Vēl nav izrakstītu rēķinu.</p>}
        </div>
      </div>

      {(c.properties || []).map(p => (
        <div key={p.id} className="sec">
          <h2 className="sec" style={{ marginBottom: 12 }}>
            Iekārtas — {p.address_line}, {p.municipality}
          </h2>
          <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {(p.equipment || []).map(e => (
              <div className="card" key={e.id}>
                <h3>{e.manufacturer} {e.model}</h3>
                <dl className="kv" style={{ marginTop: 10 }}>
                  <dt>Veids</dt><dd>{KIND[e.kind]}</dd>
                  <dt>Uzstādīts</dt><dd>{e.installed_year || '—'}{e.output_kw ? ` · ${e.output_kw} kW` : ''}</dd>
                </dl>
                <div className="small" style={{ marginTop: 14, fontWeight: 600, color: 'var(--ink)' }}>Fotogrāfijas</div>
                <PhotoGallery photos={e.equipment_photos} />
                {!(e.equipment_photos || []).length && <p className="small muted" style={{ marginTop: 6 }}>Vēl nav attēlu.</p>}
                <StaffPhotoUpload propertyId={p.id} equipmentId={e.id} />
                <EditEquipment equipment={e} />
              </div>
            ))}
          </div>
          {!(p.equipment || []).length && <p className="muted small" style={{ marginBottom: 14 }}>Šim īpašumam vēl nav pievienotas iekārtas.</p>}
          <div style={{ marginTop: 14 }}><AddEquipmentForm propertyId={p.id} /></div>
        </div>
      ))}

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
