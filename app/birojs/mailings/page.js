import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import ComposeForm from './compose-form'

export const dynamic = 'force-dynamic'

export default async function Mailings() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const { count } = await sb.from('customers').select('id', { count: 'exact', head: true })
    .eq('marketing_consent', true).not('email', 'is', null)
  const recipientCount = count || 0

  return (
    <>
      <div className="head">
        <div><h1>E-pasti</h1>
          <div className="sub">Nosūtiet mārketinga e-pastu visiem klientiem, kuri piekrituši saņemt jaunumus</div></div>
      </div>

      <div className="card stat" style={{ maxWidth: 640, marginBottom: 20 }}>
        <div className="n">{recipientCount}</div>
        <div className="l">Klienti saņems šo e-pastu</div>
      </div>

      <ComposeForm recipientCount={recipientCount} />
    </>
  )
}
