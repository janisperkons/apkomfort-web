import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import QuoteForm from '../quote-form'

export const dynamic = 'force-dynamic'

export default async function JaunaTame() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const { data: customers } = await sb.from('customers')
    .select('id, full_name, company_name, customer_type, email, phone, properties(address_line, municipality)')
    .order('full_name')

  return (
    <>
      <div className="head"><div><h1>Jauna tāme</h1><div className="sub">Cenas piedāvājums — klientam vai jaunam interesentam.</div></div></div>
      <QuoteForm customers={customers || []} />
    </>
  )
}
