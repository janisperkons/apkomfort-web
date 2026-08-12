import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabaseServer } from '../../../../../lib/server'
import QuoteForm from '../../quote-form'

export const dynamic = 'force-dynamic'

export default async function RedigetTami({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const [{ data: quote }, { data: customers }] = await Promise.all([
    sb.from('quotes').select('*, quote_items(*)').eq('id', id).maybeSingle(),
    sb.from('customers').select('id, full_name, company_name, customer_type, email, phone, properties(address_line, municipality)').order('full_name'),
  ])
  if (!quote) notFound()
  if (quote.status === 'accepted') redirect(`/birojs/tames/${id}`)

  const items = (quote.quote_items || []).sort((a, b) => a.sort_order - b.sort_order)

  return (
    <>
      <div className="head">
        <div><h1>Rediģēt tāmi Nr. {quote.quote_number}</h1></div>
        <div className="right"><Link href={`/birojs/tames/${id}`} className="btn ghost">← Atpakaļ</Link></div>
      </div>
      <QuoteForm customers={customers || []} mode="edit" quote={quote} items={items} />
    </>
  )
}
