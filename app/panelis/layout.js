import { redirect } from 'next/navigation'
import Link from 'next/link'
import '../account.css'
import { supabaseServer } from '../../lib/server'
import { notifyNewCustomerSignup } from '../../lib/notify'
import Nav from './nav'
import CompleteProfile from './complete-profile'
import LogoutLink from '../logout-link'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const [{ data: fetchedCustomer }, { data: staffProfile }] = await Promise.all([
    sb.from('customers').select('id, full_name').eq('auth_user_id', user.id).maybeSingle(),
    sb.from('profiles').select('id').eq('id', user.id).maybeSingle(),
  ])

  if (staffProfile) redirect('/birojs')

  let customer = fetchedCustomer
  if (!customer) {
    // Registration saved these in the auth user's metadata so email
    // confirmation doesn't lose them — provision the account automatically
    // instead of asking the customer to re-enter everything.
    const meta = user.user_metadata || {}
    if (meta.full_name && meta.phone && meta.customer_type) {
      const { data: created } = await sb.from('customers').insert({
        full_name: meta.full_name,
        phone: meta.phone,
        email: user.email,
        auth_user_id: user.id,
        marketing_consent: meta.marketing_consent || false,
        customer_type: meta.customer_type,
        company_name: meta.company_name || null,
        registration_number: meta.registration_number || null,
        legal_address: meta.legal_address || null,
        vat_number: meta.vat_number || null,
      }).select('id, full_name').single()
      customer = created
      if (customer) {
        await notifyNewCustomerSignup(sb, {
          fullName: meta.customer_type === 'commercial' ? (meta.company_name || meta.full_name) : meta.full_name,
          phone: meta.phone, email: user.email, isCompany: meta.customer_type === 'commercial',
          customerId: customer.id,
        })
      }
    }
  }
  if (!customer) return <CompleteProfile email={user.email} />

  return (
    <div className="acct">
      <div className="shell">
        <aside className="side">
          <div className="brand">
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, letterSpacing: '.15em' }}>AP KOMFORTS</div>
            <div style={{ fontSize: 9.5, letterSpacing: '.26em', color: 'var(--accl)', marginTop: 4 }}>MANS KONTS</div>
          </div>
          <Nav />
          <div className="foot">
            {customer.full_name}<br />
            <Link href="/panelis/iestatijumi" title="Iestatījumi" style={{ marginRight: 10 }}>⚙ Iestatījumi</Link>
            <LogoutLink />
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  )
}
