import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import KlientiRows from './klienti-rows'

export const dynamic = 'force-dynamic'

export default async function Klienti() {
  const sb = await supabaseServer()
  const { data } = await sb.from('customers')
    .select('*, properties(id, address_line, municipality, floor_area_m2, memberships(tier,status,signed_on))')
    .order('full_name')
  return (
    <>
      <div className="head"><div><h1>Klienti</h1>
        <div className="sub">{data?.length || 0} klienti · visi kontakti un īpašumi</div></div>
        <div className="right"><Link href="/birojs/klienti/jauns" className="btn">+ Jauns klients</Link></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Vārds</th><th>Veids</th><th>Telefons</th><th>E-pasts</th><th>Val.</th><th>Īpašumi</th></tr></thead>
          <tbody>
            <KlientiRows data={data} />
          </tbody></table>
      </div>
    </>
  )
}
