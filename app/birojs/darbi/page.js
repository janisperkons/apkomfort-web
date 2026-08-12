import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { JOB, TIER, d, dt, eur } from '../../../lib/format'

export const dynamic = 'force-dynamic'
const ST = { completed:['Pabeigts','p-active'], scheduled:['Ieplānots','p-pending'],
  in_progress:['Norit','p-pending'], cancelled:['Atcelts','p-declined'], enquiry:['Pieteikums','p-pending'] }

export default async function Darbi() {
  const sb = await supabaseServer()
  const { data } = await sb.from('jobs')
    .select('*, properties(id, address_line, municipality, customers(full_name, phone))')
    .order('scheduled_for', { ascending:false })
  const done = (data||[]).filter(j=>j.status==='completed')
  const rev = done.reduce((s,j)=>s+Number(j.labour_charged_ex_vat||0)+Number(j.parts_charged_ex_vat||0),0)
  return (
    <>
      <div className="head"><div><h1>Darbi</h1>
        <div className="sub">{data?.length || 0} ieraksti · {done.length} pabeigti · {eur(rev)} izrakstīts (bez PVN)</div></div></div>
      <div className="card">
        <table>
          <thead><tr><th>Datums</th><th>Veids</th><th>Klients</th><th>Adrese</th><th>Statuss</th><th>Darbs</th><th>Detaļas</th></tr></thead>
          <tbody>{(data||[]).map(j => {
            const s = ST[j.status] || ['—','p-pending']
            return (
              <tr key={j.id}>
                <td className="small">{dt(j.completed_at || j.scheduled_for)}</td>
                <td>{JOB[j.kind]}
                  {j.out_of_hours && <span className="pill p-oo" style={{marginLeft:6}}>ĀDL</span>}
                  {j.urgent && <span className="pill p-declined" style={{marginLeft:6}}>Steidzams</span>}
                  {j.requested_membership_tier && <span className="pill p-tier" style={{marginLeft:6}}>+ {TIER[j.requested_membership_tier]}</span>}
                </td>
                <td className="small">{j.properties?.customers?.full_name}</td>
                <td className="small"><Link href={`/birojs/ipasumi/${j.properties?.id}`} style={{color:'var(--ink)'}}>
                  {j.properties?.address_line}, {j.properties?.municipality}</Link></td>
                <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
                <td className="small">{eur(j.labour_charged_ex_vat)}</td>
                <td className="small">{eur(j.parts_charged_ex_vat)}</td>
              </tr>)})}
          </tbody></table>
      </div>
    </>
  )
}
