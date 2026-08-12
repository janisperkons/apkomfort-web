import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import RequestVisitForm from './form'

export const dynamic = 'force-dynamic'

export default async function PieteiktVizu() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id, frozen, frozen_reason').eq('auth_user_id', user.id).maybeSingle()
  if (!customer) return <div className="note warn">Neizdevās ielādēt jūsu kontu. Lūdzu pārlādējiet lapu.</div>
  const { data: properties } = await sb.from('properties')
    .select('id, address_line, equipment(id, kind, manufacturer, model)')
    .eq('customer_id', customer.id).order('created_at')

  if (customer.frozen) {
    return (
      <>
        <div className="head"><div><h1>Pieteikt vizīti</h1></div></div>
        <div className="note warn">
          Jūsu konts pašlaik ir iesaldēts{customer.frozen_reason ? ` (${customer.frozen_reason})` : ''} un jaunu
          vizīšu pieteikšana nav pieejama. Lai atrisinātu šo jautājumu, sazinieties ar mums:{' '}
          <a href="tel:+37126275983">+371 26 275 983</a>.
        </div>
      </>
    )
  }

  if (!properties?.length) {
    return (
      <>
        <div className="head"><div><h1>Pieteikt vizīti</h1></div></div>
        <div className="card">
          <p className="muted">Pirms vizītes pieteikšanas jāpievieno vismaz viens īpašums.</p>
          <Link href="/panelis/ipasums/jauns" className="btn" style={{ marginTop: 14 }}>+ Pievienot īpašumu</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="head"><div><h1>Pieteikt vizīti</h1>
        <div className="sub">Aprakstiet vajadzību — sazināsimies, lai apstiprinātu laiku.</div></div></div>
      <RequestVisitForm properties={properties} />
    </>
  )
}
