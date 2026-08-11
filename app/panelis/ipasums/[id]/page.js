import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { DISTRIBUTION } from '../../../../lib/format'
import PropertyEditForm from './property-edit-form'
import AddEquipmentForm from './add-equipment-form'
import EquipmentCard from './equipment-card'

export const dynamic = 'force-dynamic'

export default async function Ipasums({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: p } = await sb.from('properties')
    .select('*, equipment(*, equipment_photos(*), equipment_service_history(*))')
    .eq('id', id).maybeSingle()
  if (!p) notFound()

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Īpašums</div>
          <h1>{p.address_line}</h1>
          <div className="sub">{p.municipality}{p.postcode ? ', ' + p.postcode : ''}
            {p.built_year ? ` · celta ${p.built_year}` : ''}
            {p.floor_area_m2 ? ` · ${p.floor_area_m2} m²` : ''}</div>
        </div>
        <div className="right"><Link href="/panelis" className="btn ghost">← Visi īpašumi</Link></div>
      </div>

      {p.heating_distribution?.length > 0 && (
        <p className="small muted" style={{ marginBottom: 16 }}>
          Apkures sadale: {p.heating_distribution.map(k => DISTRIBUTION[k] || k).join(', ')}
        </p>
      )}

      <PropertyEditForm property={p} />

      <h2 className="sec">Iekārtas</h2>
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {(p.equipment || []).map(e => <EquipmentCard key={e.id} equipment={e} />)}
      </div>
      <div className="sec"><AddEquipmentForm propertyId={p.id} /></div>
    </>
  )
}
