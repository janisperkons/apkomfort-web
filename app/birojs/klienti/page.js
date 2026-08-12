import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import KlientiList from './klienti-list'

export const dynamic = 'force-dynamic'

export default async function Klienti() {
  const sb = await supabaseServer()
  const { data } = await sb.from('customers')
    .select('*, properties(id, address_line, municipality, floor_area_m2, memberships(tier,status,signed_on), equipment(kind, manufacturer, model))')
    .order('full_name')
  return (
    <>
      <div className="head"><div><h1>Klienti</h1>
        <div className="sub">{data?.length || 0} klienti · visi kontakti un īpašumi</div></div>
        <div className="right"><Link href="/birojs/klienti/jauns" className="btn">+ Jauns klients</Link></div></div>
      <KlientiList data={data} />
    </>
  )
}
