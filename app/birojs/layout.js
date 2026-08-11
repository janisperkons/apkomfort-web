import { redirect } from 'next/navigation'
import '../account.css'
import { supabaseServer } from '../../lib/server'
import Nav from './nav'
import LogoutLink from '../logout-link'

export const dynamic = 'force-dynamic'

export default async function BirojsLayout({ children }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()

  if (!staffProfile) redirect('/panelis')

  return (
    <div className="acct">
      <div className="shell">
        <aside className="side">
          <div className="brand">
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, letterSpacing: '.15em' }}>AP KOMFORT</div>
            <div style={{ fontSize: 9.5, letterSpacing: '.26em', color: 'var(--accl)', marginTop: 4 }}>BIROJS</div>
          </div>
          <Nav />
          <div className="foot">
            {user?.email}<br />
            <LogoutLink />
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  )
}
