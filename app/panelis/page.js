import Link from 'next/link'
import { supabaseServer } from '../../lib/server'
import { JOB, JOB_STATUS, d } from '../../lib/format'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id, full_name').eq('auth_user_id', user.id).maybeSingle()
  if (!customer) return <div className="note warn">Neizdevās ielādēt jūsu kontu. Lūdzu pārlādējiet lapu.</div>
  const { data: properties } = await sb.from('properties')
    .select('id, address_line, municipality, postcode, built_year, equipment(id), jobs(id, kind, status, requested_date, scheduled_for)')
    .eq('customer_id', customer.id).order('created_at')

  const allJobs = (properties || []).flatMap(p => (p.jobs || []).map(j => ({ ...j, property: p })))
  const pending = allJobs.filter(j => j.status === 'enquiry' || j.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_for || a.requested_date || 0) - new Date(b.scheduled_for || b.requested_date || 0))

  return (
    <>
      <div className="head">
        <div><h1>Sveiki, {customer.full_name.split(' ')[0]}</h1>
          <div className="sub">Jūsu īpašumi un pieteiktās vizītes</div></div>
        <div className="right"><Link href="/panelis/ipasums/jauns" className="btn">+ Pievienot īpašumu</Link></div>
      </div>

      {pending.length > 0 && (
        <div className="card sec">
          <h2>Gaidāmās vizītes</h2>
          <table><thead><tr><th>Statuss</th><th>Veids</th><th>Datums</th><th>Īpašums</th></tr></thead>
            <tbody>{pending.map(j => {
              const s = JOB_STATUS[j.status] || ['—', 'p-pending']
              return (
                <tr key={j.id}>
                  <td><Link href={`/panelis/vizites/${j.id}`} style={{ color: 'inherit', display: 'block' }}><span className={'pill ' + s[1]}>{s[0]}</span></Link></td>
                  <td><Link href={`/panelis/vizites/${j.id}`} style={{ color: 'inherit', display: 'block' }}>{JOB[j.kind] || j.kind}</Link></td>
                  <td className="small"><Link href={`/panelis/vizites/${j.id}`} style={{ color: 'inherit', display: 'block' }}>{d(j.scheduled_for || j.requested_date)}</Link></td>
                  <td className="small muted"><Link href={`/panelis/vizites/${j.id}`} style={{ color: 'inherit', display: 'block' }}>{j.property?.address_line}</Link></td>
                </tr>
              )
            })}</tbody></table>
        </div>
      )}

      <h2 className="sec">Jūsu īpašumi</h2>
      {properties?.length ? (
        <div className="grid g3">
          {properties.map(p => (
            <Link href={`/panelis/ipasums/${p.id}`} className="card" key={p.id} style={{ display: 'block' }}>
              <h3>{p.address_line}</h3>
              <p className="small muted" style={{ marginTop: 4 }}>{p.municipality}{p.postcode ? ', ' + p.postcode : ''}</p>
              <p className="small" style={{ marginTop: 10 }}>
                {(p.equipment || []).length} iekārta(-as)
                {p.built_year ? ` · celta ${p.built_year}` : ''}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="muted">Jums vēl nav pievienots neviens īpašums.</p>
          <Link href="/panelis/ipasums/jauns" className="btn" style={{ marginTop: 14 }}>+ Pievienot īpašumu</Link>
        </div>
      )}
    </>
  )
}
