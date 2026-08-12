import { supabaseServer } from '../../../lib/server'
import PieteikumiRows from './pieteikumi-rows'

export const dynamic = 'force-dynamic'

export default async function Pieteikumi() {
  const sb = await supabaseServer()
  const { data } = await sb.from('enquiries').select('*').order('created_at', { ascending: false })
  const rows = data || []
  const newCount = rows.filter(r => (r.status || 'new') === 'new').length

  return (
    <>
      <div className="head">
        <div><h1>Jauni pieteikumi</h1>
          <div className="sub">{rows.length} kopā · {newCount} jauni</div></div>
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
