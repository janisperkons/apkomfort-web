import { redirect } from 'next/navigation'
import '../account.css'
import { supabaseServer } from '../../lib/server'
import Nav from './nav'
import CompleteProfile from './complete-profile'
import LogoutLink from '../logout-link'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const [{ data: customer }, { data: staffProfile }] = await Promise.all([
    sb.from('customers').select('id, full_name').eq('auth_user_id', user.id).maybeSingle(),
    sb.from('profiles').select('id').eq('id', user.id).maybeSingle(),
  ])

  if (staffProfile) redirect('/birojs')
  if (!customer) return <CompleteProfile email={user.email} />

  return (
    <div className="acct">
      <div className="shell">
        <aside className="side">
          <div className="brand">
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, letterSpacing: '.15em' }}>AP KOMFORT</div>
            <div style={{ fontSize: 9.5, letterSpacing: '.26em', color: 'var(--accl)', marginTop: 4 }}>MANS KONTS</div>
          </div>
          <Nav />
          <div className="foot">
            {customer.full_name}<br />
            <LogoutLink />
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  )
}
