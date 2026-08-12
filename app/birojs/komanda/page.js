import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import { d } from '../../../lib/format'
import InviteForm from './invite-form'

export const dynamic = 'force-dynamic'
const ROLE = { admin: 'Administrators', bookkeeper: 'Grāmatvedis(-e)' }

export default async function Komanda() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const { data: team } = await sb.from('profiles').select('*').order('created_at')

  return (
    <>
      <div className="head"><div><h1>Komanda</h1>
        <div className="sub">Pieslēgšanās un piekļuves līmeņi back office.</div></div></div>

      <div className="card">
        <table>
          <thead><tr><th>Vārds</th><th>E-pasts</th><th>Loma</th><th>Pievienojies</th></tr></thead>
          <tbody>
            {(team || []).map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.full_name}</td>
                <td className="small">{p.email || '—'}</td>
                <td><span className="pill p-tier">{ROLE[p.role] || p.role}</span></td>
                <td className="small">{d(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sec">
        <h2 className="sec">Uzaicināt jaunu lietotāju</h2>
        <InviteForm />
      </div>
    </>
  )
}
