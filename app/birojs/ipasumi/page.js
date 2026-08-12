import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import IpasumiList from './ipasumi-list'

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
        <div className="right">
          <Link href="/birojs/ipasumi/karte" className="btn ghost" style={{ marginRight: 10 }}>Kartes skats</Link>
          <Link href="/birojs/klienti/jauns" className="btn">+ Jauns klients</Link>
        </div></div>
      <IpasumiList data={data} />
    </>
  )
}
