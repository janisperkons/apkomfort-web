import { redirect } from 'next/navigation'
import Link from 'next/link'
import '../account.css'
import { supabaseServer } from '../../lib/server'
import Nav from './nav'
import LogoutLink from '../logout-link'

export const dynamic = 'force-dynamic'

export default async function BirojsLayout({ children }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: staffProfile } = await sb.from('profiles').select('id, role').eq('id', user.id).maybeSingle()

  if (!staffProfile) redirect('/panelis')
  const isAdmin = staffProfile.role === 'admin'

  let newPieteikumiCount = 0
  if (isAdmin) {
    const { count } = await sb.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')
    newPieteikumiCount = count || 0
  }

  return (
    <div className="acct">
      <div className="shell">
        <aside className="side">
          <div className="brand">
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, letterSpacing: '.15em' }}>AP KOMFORTS</div>
            <div style={{ fontSize: 9.5, letterSpacing: '.26em', color: 'var(--accl)', marginTop: 4 }}>BIROJS</div>
          </div>
          <Nav newPieteikumiCount={newPieteikumiCount} isAdmin={isAdmin} />
          <div className="foot">
            {user?.email}<br />
            <Link href="/birojs/iestatijumi" title="Iestatījumi" style={{ marginRight: 10 }}>⚙ Iestatījumi</Link>
            <LogoutLink />
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  )
}
