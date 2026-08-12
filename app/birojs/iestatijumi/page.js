import { supabaseServer } from '../../../lib/server'
import SettingsForm from './settings-form'

export const dynamic = 'force-dynamic'

export default async function Iestatijumi() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: profile } = await sb.from('profiles').select('id, full_name, phone').eq('id', user.id).single()

  return (
    <>
      <div className="head"><div><h1>Iestatījumi</h1>
        <div className="sub">Sava konta dati un pieslēgšanās parole.</div></div></div>
      <SettingsForm profile={profile} email={user.email} />
    </>
  )
}
