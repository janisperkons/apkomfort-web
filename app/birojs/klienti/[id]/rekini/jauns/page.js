import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../../../lib/server'
import InvoiceForm from './invoice-form'

export const dynamic = 'force-dynamic'

export default async function JaunsRekins({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: customer } = await sb.from('customers').select('id, full_name').eq('id', id).single()
  if (!customer) notFound()

  const { data: properties } = await sb.from('properties')
    .select('id, address_line, municipality').eq('customer_id', id).order('address_line')

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Jauns rēķins</div>
          <h1>{customer.full_name}</h1>
        </div>
      </div>
      <InvoiceForm customerId={id} properties={properties || []} />
    </>
  )
}
