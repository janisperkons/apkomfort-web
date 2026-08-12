import { supabaseServer } from '../../../lib/server'
import RekiniList from './rekini-list'

export const dynamic = 'force-dynamic'

export default async function ManiRekini() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id').eq('auth_user_id', user.id).single()
  const { data: invoices } = await sb.from('invoices')
    .select('id, invoice_number, issue_date, due_date, status, total, viewed_at, payment_reported_at, properties(address_line, municipality)')
    .eq('customer_id', customer.id)
    .order('issue_date', { ascending: false })

  return (
    <>
      <div className="head"><div><h1>Mani rēķini</h1></div></div>
      <div className="card">
        <RekiniList invoices={invoices || []} />
      </div>
    </>
  )
}
