import { supabaseServer } from '../../../lib/server'
import SettingsForm from './settings-form'

export const dynamic = 'force-dynamic'

export default async function ManiIestatijumi() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers')
    .select('id, full_name, phone, customer_type, company_name, registration_number, legal_address, vat_number, marketing_consent')
    .eq('auth_user_id', user.id).single()

  return (
    <>
      <div className="head"><div><h1>Iestatījumi</h1>
        <div className="sub">Sava konta dati un pieslēgšanās parole.</div></div></div>
      <SettingsForm customer={customer} email={user.email} />
    </>
  )
}
