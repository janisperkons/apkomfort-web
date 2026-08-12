import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { ensurePropertyCoordinates } from '../../../../lib/geocode'
import PropertyMap from './property-map'

export const dynamic = 'force-dynamic'

export default async function IpasumiKarte() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const { data } = await sb.from('properties')
    .select('id, address_line, municipality, lat, lng, customer_id, customers(full_name, company_name, customer_type), assigned_engineer')
    .order('municipality')

  const properties = data || []
  await ensurePropertyCoordinates(sb, properties)
  const stillMissing = properties.filter(p => p.lat == null || p.lng == null).length

  const points = properties
    .filter(p => p.lat != null && p.lng != null)
    .map(p => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      address: `${p.address_line}, ${p.municipality}`,
      clientName: p.customers?.customer_type === 'commercial' && p.customers?.company_name ? p.customers.company_name : p.customers?.full_name,
      customerId: p.customer_id,
    }))

  return (
    <>
      <div className="head">
        <div><h1>Īpašumu karte</h1>
          <div className="sub">{points.length} no {properties.length} īpašumiem novietoti kartē</div></div>
        <div className="right"><Link href="/birojs/ipasumi" className="btn ghost">← Saraksta skats</Link></div>
      </div>

      {stillMissing > 0 && (
        <div className="note" style={{ marginBottom: 16 }}>
          Meklējam koordinātas vēl {stillMissing} īpašumam(-iem) — atsvaidziniet lapu pēc dažām sekundēm.
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <PropertyMap points={points} />
      </div>

      <div className="card sec">
        <p className="small muted">
          Reģionu piešķiršana konkrētam inženierim (lai inženieris atbild par noteiktu apkaimi) ir
          izstrādes plānā — pagaidām karte ir tikai pārskatam.
        </p>
      </div>
    </>
  )
}
