import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { TIER, STATUS, KIND, JOB, COND, d, dt, eur } from '../../../../lib/format'
import PhotoGallery from './photo-gallery'
import ConfirmVisit from './confirm-visit'
import EditCustomer from './edit-customer'
import EditProperty from './edit-property'
import EditEquipment from './edit-equipment'
import AddEquipmentForm from './add-equipment-form'
import EditMembership from './edit-membership'
import JobActions from './job-actions'
import SendVisitEmail from './send-visit-email'
import EquipmentIssues, { ResolveFault } from './equipment-issues'
import LogCommunication from './log-communication'
import StaffPhotoUpload from './staff-photo-upload'
import LocationMap from '../../../../components/LocationMap'

export const dynamic = 'force-dynamic'
const TYPE = { private:'Privātpersona', landlord:'Izīrētājs', commercial:'Komercklients' }

export default async function Ipasums({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: p } = await sb.from('properties')
    .select(`*, customers(*), memberships(*), profiles:assigned_engineer(full_name),
             equipment(*, faults(*), exclusions(*), equipment_photos(*), equipment_service_history(*)),
             jobs(*, equipment(manufacturer, model))`)
    .eq('id', id).single()
  if (!p) notFound()

  const { data: engineers } = await sb.from('profiles').select('id, full_name').order('full_name')

  const { data: comms } = await sb.from('communications')
    .select('*').eq('property_id', id).order('occurred_at', { ascending:false })

  const m = (p.memberships||[])[0]
  const s = m ? (STATUS[m.status] || ['—','p-pending']) : null
  const jobs = (p.jobs||[]).sort((a,b) =>
    new Date(b.completed_at || b.scheduled_for) - new Date(a.completed_at || a.scheduled_for))
  const allEx = (p.equipment||[]).flatMap(e => (e.exclusions||[]).map(x => ({...x, eq:e})))

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Īpašums</div>
          <h1>{p.address_line}</h1>
          <div className="sub">{p.municipality}{p.postcode ? ', ' + p.postcode : ''} · {p.property_type}
            {p.floor_area_m2 ? ` · ${p.floor_area_m2} m²` : ''}{p.bedrooms ? ` · ${p.bedrooms} guļamistabas` : ''}</div>
        </div>
        <div className="right"><Link href="/birojs/ipasumi" className="btn ghost">← Visi īpašumi</Link></div>
      </div>

      {p.access_notes && <div className="note" style={{marginBottom:16}}><b>Piekļuve:</b> {p.access_notes}</div>}

      {p.lat != null && p.lng != null ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <LocationMap lat={p.lat} lng={p.lng} readOnly height={260} />
        </div>
      ) : (
        <p className="small muted" style={{ marginBottom: 16 }}>Klients vēl nav atzīmējis precīzu atrašanās vietu kartē.</p>
      )}

      <EditProperty property={p} engineers={engineers||[]} />

      <div className="grid g3">
        <div className="card">
          <h3 style={{marginBottom:12}}>Klients</h3>
          <dl className="kv">
            {p.customers?.customer_type === 'commercial' && p.customers?.company_name && (
              <><dt>Uzņēmums</dt><dd style={{fontWeight:600,color:'var(--ink)'}}>{p.customers.company_name}</dd></>
            )}
            <dt>{p.customers?.customer_type === 'commercial' ? 'Kontaktpersona' : 'Vārds'}</dt><dd style={{fontWeight:600,color:'var(--ink)'}}>{p.customers?.full_name}</dd>
            <dt>Veids</dt><dd>{TYPE[p.customers?.customer_type]}</dd>
            {p.customers?.customer_type === 'commercial' && p.customers?.registration_number && (
              <><dt>Reģ. numurs</dt><dd>{p.customers.registration_number}</dd></>
            )}
            <dt>Telefons</dt><dd><a href={`tel:${(p.customers?.phone||'').split(' ').join('')}`} style={{fontWeight:600,color:'var(--ink)'}}>{p.customers?.phone || '—'}</a></dd>
            <dt>E-pasts</dt><dd><a href={`mailto:${p.customers?.email}`}>{p.customers?.email || '—'}</a></dd>
            <dt>Valoda</dt><dd>{(p.customers?.language || 'lv').toUpperCase()}</dd>
          </dl>
          {p.customers?.notes && <div className="note small" style={{marginTop:14}}>{p.customers.notes}</div>}
          <EditCustomer customer={p.customers} />
        </div>

        <div className="card">
          <h3 style={{marginBottom:12}}>Plāns</h3>
          {m ? (
            <dl className="kv">
              <dt>Līmenis</dt><dd><span className="pill p-tier">{TIER[m.tier]}</span> <span className={'pill ' + s[1]}>{s[0]}</span></dd>
              <dt>Cena / mēnesī</dt><dd style={{fontWeight:600,color:'var(--ink)'}}>{eur(m.monthly_price_ex_vat)} <span className="muted small">bez PVN</span></dd>
              <dt>Aprēķināts</dt><dd className="small muted">{eur(m.calculated_price_ex_vat)}</dd>
              <dt>Parakstīts</dt><dd>{d(m.signed_on)}</dd>
              <dt>Sākums</dt><dd>{d(m.start_date)}</dd>
              <dt>Atjaunošana</dt><dd style={{color:'var(--acc)',fontWeight:600}}>{d(m.anniversary_date)}</dd>
              <dt>Maksājums</dt><dd className="small">{m.payment_plan === 'annual_upfront' ? 'Gads uz priekšu' : 'Ikmēneša'}</dd>
              <dt>Speciālists</dt><dd className="small">{p.profiles?.full_name || '—'}</dd>
            </dl>
          ) : <p className="muted small">Nav plāna.</p>}
          {m?.override_reason && <div className="note small" style={{marginTop:14}}>
            <b>Cenas korekcija:</b> {m.override_reason}</div>}
          <div style={{marginTop:12}}><EditMembership propertyId={p.id} membership={m} /></div>
        </div>

        <div className="card">
          <h3 style={{marginBottom:12}}>Kopsavilkums</h3>
          <dl className="kv">
            <dt>Iekārtas</dt><dd>{(p.equipment||[]).length}</dd>
            <dt>Darbi kopā</dt><dd>{jobs.length}</dd>
            <dt>Pabeigti</dt><dd>{jobs.filter(j=>j.status==='completed').length}</dd>
            <dt>Izsaukumi</dt><dd>{jobs.filter(j=>j.kind==='callout').length}</dd>
            <dt>Ārpus darba laika</dt><dd>{jobs.filter(j=>j.out_of_hours).length}</dd>
            <dt>Iepriekšēji bojājumi</dt><dd>{allEx.length}</dd>
          </dl>
        </div>
      </div>

      <h2 className="sec">Iekārtas</h2>
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        {(p.equipment||[]).map(e => (
          <div className="card" key={e.id}>
            <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:10}}>
              <h3>{e.manufacturer} {e.model}</h3>
              <span className="badge" style={{marginLeft:'auto'}}>{COND[e.condition] || '—'}</span>
            </div>
            <dl className="kv">
              <dt>Veids</dt><dd>{KIND[e.kind]}</dd>
              <dt>Sērijas Nr.</dt><dd style={{fontFamily:'ui-monospace,monospace',fontSize:13}}>{e.serial_number || '—'}</dd>
              <dt>Uzstādīts</dt><dd>{e.installed_year || '—'}{e.output_kw ? ` · ${e.output_kw} kW` : ''}</dd>
              <dt>Pēdējā apkope</dt><dd>{d(e.last_serviced)}</dd>
            </dl>
            {e.notes && <div className="small muted" style={{marginTop:10}}>{e.notes}</div>}
            {(e.exclusions||[]).map(x => (
              <div className="note warn small" key={x.id} style={{marginTop:10}}>
                <b>Iepriekšējs bojājums — {x.component}.</b> {x.reason}
                <div className="muted" style={{marginTop:3}}>Klients apstiprinājis: {x.acknowledged_by_customer ? 'jā' : 'nē'} · derīgs līdz {d(x.expires_on)}</div>
              </div>))}
            {(e.faults||[]).filter(f=>!f.resolved_on).map(f => (
              <div className="note small" key={f.id} style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span><b>Neatrisināts defekts:</b> {f.description} <span className="muted">(no {d(f.first_reported)})</span></span>
                <ResolveFault fault={f} />
              </div>))}
            <EquipmentIssues equipmentId={e.id} />

            <div className="small" style={{marginTop:14,fontWeight:600,color:'var(--ink)'}}>Fotogrāfijas</div>
            <PhotoGallery photos={e.equipment_photos} />
            {!(e.equipment_photos||[]).length && <p className="small muted" style={{marginTop:6}}>Vēl nav attēlu.</p>}
            <StaffPhotoUpload propertyId={p.id} equipmentId={e.id} />

            <div className="small" style={{marginTop:14,fontWeight:600,color:'var(--ink)'}}>Apkopes vēsture (klienta ievadīta)</div>
            {(e.equipment_service_history||[]).length ? (
              (e.equipment_service_history||[])
                .sort((a,b)=>new Date(b.serviced_on)-new Date(a.serviced_on))
                .map(h => (
                  <div key={h.id} className="small" style={{padding:'6px 0',borderBottom:'1px solid #EFEADC'}}>
                    <b>{d(h.serviced_on)}</b>{h.performed_by ? ` · ${h.performed_by}` : ''}
                    {h.notes && <div className="muted">{h.notes}</div>}
                  </div>
                ))
            ) : <p className="small muted" style={{marginTop:6}}>Nav ierakstu.</p>}
            <EditEquipment equipment={e} />
          </div>))}
      </div>
      <div className="sec"><AddEquipmentForm propertyId={p.id} /></div>

      <h2 className="sec">Vizītes pieprasījumi</h2>
      {jobs.filter(j=>j.status==='enquiry').length ? (
        <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
          {jobs.filter(j=>j.status==='enquiry').map(j => (
            <ConfirmVisit key={j.id} job={j} engineers={engineers||[]} />
          ))}
        </div>
      ) : <p className="muted small">Nav neapstiprinātu pieprasījumu.</p>}

      <h2 className="sec">Apkopju un darbu vēsture</h2>
      <div className="card">
        <div className="timeline">
          {jobs.filter(j=>j.status!=='enquiry').map(j => (
            <div className="tl" key={j.id}>
              <div className="d">{j.status === 'completed' ? dt(j.completed_at) : dt(j.scheduled_for) + ' · ieplānots'}</div>
              <div className="t">{JOB[j.kind]}
                {j.out_of_hours && <span className="pill p-oo" style={{marginLeft:8}}>Ārpus darba laika</span>}</div>
              {j.equipment && <div className="small muted">{j.equipment.manufacturer} {j.equipment.model}</div>}
              {j.work_done && <div style={{marginTop:4}}>{j.work_done}</div>}
              {j.recommendations && j.recommendations !== '—' &&
                <div className="small" style={{marginTop:4,color:'var(--acc)'}}><b>Ieteikums:</b> {j.recommendations}</div>}
              <div className="small muted" style={{marginTop:5}}>
                {j.labour_hours ? `${j.labour_hours} h · ` : ''}
                Darbs {eur(j.labour_charged_ex_vat)} · Detaļas {eur(j.parts_charged_ex_vat)}
              </div>
              {j.internal_notes && <div className="note small" style={{marginTop:7}}>
                <b>Iekšēja piezīme:</b> {j.internal_notes}</div>}
              {(j.status === 'scheduled' || j.status === 'in_progress') && <JobActions job={j} />}
              {j.status === 'scheduled' && <SendVisitEmail job={j} customerEmail={p.customers?.email} />}
            </div>))}
          {!jobs.filter(j=>j.status!=='enquiry').length && <p className="muted small">Nav darbu.</p>}
        </div>
      </div>

      <h2 className="sec">Sarakste un zvani</h2>
      {(comms||[]).length > 0 && (
        <div className="card" style={{marginBottom:14}}><table>
          <thead><tr><th>Datums</th><th>Veids</th><th>Kopsavilkums</th></tr></thead>
          <tbody>{comms.map(c => (
            <tr key={c.id}><td className="small">{dt(c.occurred_at)}</td>
              <td className="small">{c.kind === 'call' ? 'Zvans' : c.kind}</td><td>{c.summary}</td></tr>))}
          </tbody></table></div>
      )}
      <LogCommunication propertyId={p.id} customerId={p.customers?.id} />
    </>
  )
}
