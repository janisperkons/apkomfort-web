import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import PieteikumiRows from './pieteikumi-rows'

export const dynamic = 'force-dynamic'

export default async function Pieteikumi({ searchParams }) {
  const { viss } = await searchParams
  const showAll = viss === '1'
  const sb = await supabaseServer()
  const { data } = await sb.from('enquiries').select('*').order('created_at', { ascending: false })
  const all = data || []
  const rows = showAll ? all : all.filter(r => r.status !== 'converted' && r.status !== 'declined')
  const newCount = all.filter(r => (r.status || 'new') === 'new').length

  return (
    <>
      <div className="head">
        <div><h1>Jauni pieteikumi</h1>
          <div className="sub">{rows.length} redzami · {newCount} jauni</div></div>
        <div className="right">
          <Link href={showAll ? '/birojs/pieteikumi' : '/birojs/pieteikumi?viss=1'} className="btn ghost">
            {showAll ? 'Slēpt apstrādātos' : 'Rādīt visus'}
          </Link>
        </div>
      </div>

      <div className="card">
        <table>
          <thead><tr>
            <th>Datums</th><th>Avots</th><th>Vārds</th><th>Telefons</th>
            <th>Sistēma</th><th>Ziņa</th><th>Statuss</th>
          </tr></thead>
          <tbody>
            <PieteikumiRows rows={rows} />
          </tbody>
        </table>
      </div>
    </>
  )
}
