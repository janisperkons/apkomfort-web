import { supabaseServer } from '../../../lib/server'
import TamesList from './tames-list'

export const dynamic = 'force-dynamic'

export default async function ManasTames() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id').eq('auth_user_id', user.id).maybeSingle()
  if (!customer) return <div className="note warn">Neizdevās ielādēt jūsu kontu. Lūdzu pārlādējiet lapu.</div>
  const { data: quotes } = await sb.from('quotes')
    .select('id, quote_number, created_at, valid_until, status, total, viewed_at, property_address, properties(address_line, municipality)')
    .eq('customer_id', customer.id)
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="head"><div><h1>Manas tāmes</h1></div></div>
      <div className="card">
        <TamesList quotes={quotes || []} />
      </div>
    </>
  )
}
