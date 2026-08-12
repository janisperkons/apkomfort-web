import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { TIER, d, eur } from '../../../lib/format'
import QuickInvoiceSearch from './quick-invoice-search'

export const dynamic = 'force-dynamic'

export default async function Gramatvediba() {
  const sb = await supabaseServer()
  const [{ data: invoices }, { data: mems }, { data: customers }] = await Promise.all([
    sb.from('invoices')
      .select('id, invoice_number, issue_date, due_date, status, total, sent_at, payment_reported_at, payment_reported_note, customer_id, property_id, customers(full_name, company_name, customer_type), properties(address_line, municipality)')
      .order('issue_date', { ascending: false }),
    sb.from('memberships')
      .select('*, properties(id, address_line, municipality, customer_id, customers(id, full_name))')
      .eq('status', 'active'),
    sb.from('customers')
      .select('id, full_name, company_name, customer_type, properties(address_line, municipality)')
      .order('full_name'),
  ])

  const invoiceTotal = (invoices || []).reduce((s, i) => s + Number(i.total || 0), 0)
  const paidInvoices = (invoices || []).filter(i => i.status === 'paid')
  const pendingConfirmInvoices = (invoices || []).filter(i => i.status === 'sent' && i.payment_reported_at)
  const sentInvoices = (invoices || []).filter(i => i.status === 'sent' && !i.payment_reported_at)
  const draftInvoices = (invoices || []).filter(i => i.status === 'draft')
  const paidTotal = paidInvoices.reduce((s, i) => s + Number(i.total || 0), 0)
  const outstandingTotal = (invoices || []).filter(i => i.status === 'sent').reduce((s, i) => s + Number(i.total || 0), 0)
  const mrr = (mems || []).reduce((s, m) => s + Number(m.monthly_price_ex_vat || 0), 0)

  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const invoicedPropertyIds = new Set(
    (invoices || []).filter(i => i.property_id && i.issue_date >= monthStart).map(i => i.property_id)
  )
  const monthlyMembers = (mems || []).filter(m => m.payment_plan !== 'annual_upfront')
  const monthName = now.toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' })

  return (
    <>
      <div className="head">
        <div><h1>Grāmatvedība</h1><div className="sub">Visi rēķini un aktīvie abonementi vienuviet — noklikšķiniet, lai redzētu klientu vai īpašumu.</div></div>
      </div>

      <div className="grid g4">
        <div className="card stat"><div className="n">{eur(invoiceTotal)}</div><div className="l">Kopā izrakstīts</div></div>
        <div className="card stat"><div className="n">{eur(paidTotal)}</div><div className="l">Apmaksāts</div></div>
        <div className="card stat"><div className="n">{eur(outstandingTotal)}</div><div className="l">Nosūtīts, nav apmaksāts</div></div>
        <div className="card stat"><div className="n">{eur(mrr)}</div><div className="l">Mēneša ieņēmumi (abonementi, bez PVN)</div></div>
      </div>

      <QuickInvoiceSearch customers={customers} />

      {monthlyMembers.length > 0 && (
        <div className="card sec">
          <div className="head" style={{ marginBottom: 12 }}>
            <h2 className="sec" style={{ margin: 0, textTransform: 'capitalize' }}>Ikmēneša rēķini — {monthName}</h2>
            <div className="right small muted">
              {monthlyMembers.filter(m => invoicedPropertyIds.has(m.properties?.id)).length} no {monthlyMembers.length} izrakstīti
            </div>
          </div>
          <p className="small muted" style={{ marginTop: -6, marginBottom: 14 }}>
            Nekas nenosūtās automātiski — šis tikai parāda, kuriem ikmēneša abonentiem šomēnes vēl nav izrakstīts rēķins.
          </p>
          <table>
            <thead><tr><th>Klients</th><th>Īpašums</th><th>Plāns</th><th>Cena / mēn.</th><th>Statuss</th><th></th></tr></thead>
            <tbody>
              {monthlyMembers.map(m => {
                const invoiced = invoicedPropertyIds.has(m.properties?.id)
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/birojs/klienti/${m.properties?.customers?.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>
                        {m.properties?.customers?.full_name}
                      </Link>
                    </td>
                    <td className="small muted">{m.properties?.address_line}, {m.properties?.municipality}</td>
                    <td><span className="pill p-tier">{TIER[m.tier]}</span></td>
                    <td>{eur(m.monthly_price_ex_vat)}</td>
                    <td>
                      {invoiced
                        ? <span className="pill p-active">✓ Izrakstīts</span>
                        : <span className="pill p-pending">Vēl nav rēķina</span>}
                    </td>
                    <td>
                      {!invoiced && (
                        <Link href={`/birojs/klienti/${m.properties?.customers?.id}/rekini/jauns`} className="small" style={{ color: 'var(--acc)', fontWeight: 600 }}>
                          → Izveidot rēķinu
                        </Link>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {pendingConfirmInvoices.length > 0 && (
        <div className="card sec" style={{ borderColor: 'var(--acc)' }}>
          <div className="head" style={{ marginBottom: 12 }}>
            <h2 className="sec" style={{ margin: 0 }}>Gaida apstiprinājumu</h2>
            <div className="right small muted">Klients ziņoja par apmaksu — pārbaudiet un apstipriniet</div>
          </div>
          <table>
            <thead><tr><th>Nr.</th><th>Klients</th><th>Summa</th><th>Ziņoja</th><th>Piezīme</th></tr></thead>
            <tbody>
              {pendingConfirmInvoices.map(inv => {
                const clientName = inv.customers?.customer_type === 'commercial' && inv.customers?.company_name
                  ? inv.customers.company_name : inv.customers?.full_name
                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/birojs/rekini/${inv.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</Link>
                    </td>
                    <td className="small">
                      <Link href={`/birojs/klienti/${inv.customer_id}`} style={{ color: 'var(--ink)' }}>{clientName || '—'}</Link>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                    <td className="small">{d(inv.payment_reported_at)}</td>
                    <td className="small muted">{inv.payment_reported_note || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {draftInvoices.length > 0 && (
        <div className="card sec">
          <h2 className="sec" style={{ marginBottom: 12 }}>Melnraksti</h2>
          <table>
            <thead><tr><th>Nr.</th><th>Klients</th><th>Izrakstīts</th><th>Summa</th></tr></thead>
            <tbody>
              {draftInvoices.map(inv => {
                const clientName = inv.customers?.customer_type === 'commercial' && inv.customers?.company_name
                  ? inv.customers.company_name : inv.customers?.full_name
                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/birojs/rekini/${inv.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</Link>
                    </td>
                    <td className="small">
                      <Link href={`/birojs/klienti/${inv.customer_id}`} style={{ color: 'var(--ink)' }}>{clientName || '—'}</Link>
                    </td>
                    <td className="small">{d(inv.issue_date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Nosūtīti (nav apmaksāti)</h2>
        <table>
          <thead><tr><th>Nr.</th><th>Klients</th><th>Īpašums</th><th>Izrakstīts</th><th>Termiņš</th><th>Summa</th></tr></thead>
          <tbody>
            {sentInvoices.length ? sentInvoices.map(inv => {
              const clientName = inv.customers?.customer_type === 'commercial' && inv.customers?.company_name
                ? inv.customers.company_name : inv.customers?.full_name
              return (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>
                    <Link href={`/birojs/rekini/${inv.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</Link>
                  </td>
                  <td className="small">
                    <Link href={`/birojs/klienti/${inv.customer_id}`} style={{ color: 'var(--ink)' }}>{clientName || '—'}</Link>
                  </td>
                  <td className="small muted">
                    {inv.property_id ? (
                      <Link href={`/birojs/ipasumi/${inv.property_id}`} className="muted">
                        {inv.properties?.address_line}, {inv.properties?.municipality}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="small">{d(inv.issue_date)}</td>
                  <td className="small">{d(inv.due_date)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                </tr>
              )
            }) : <tr><td colSpan="6" className="muted">Nav nosūtītu, neapmaksātu rēķinu.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Apmaksāti</h2>
        <table>
          <thead><tr><th>Nr.</th><th>Klients</th><th>Īpašums</th><th>Izrakstīts</th><th>Summa</th></tr></thead>
          <tbody>
            {paidInvoices.length ? paidInvoices.map(inv => {
              const clientName = inv.customers?.customer_type === 'commercial' && inv.customers?.company_name
                ? inv.customers.company_name : inv.customers?.full_name
              return (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>
                    <Link href={`/birojs/rekini/${inv.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</Link>
                  </td>
                  <td className="small">
                    <Link href={`/birojs/klienti/${inv.customer_id}`} style={{ color: 'var(--ink)' }}>{clientName || '—'}</Link>
                  </td>
                  <td className="small muted">
                    {inv.property_id ? (
                      <Link href={`/birojs/ipasumi/${inv.property_id}`} className="muted">
                        {inv.properties?.address_line}, {inv.properties?.municipality}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="small">{d(inv.issue_date)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                </tr>
              )
            }) : <tr><td colSpan="5" className="muted">Vēl nav apmaksātu rēķinu.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Aktīvie abonementi</h2>
        <table>
          <thead>
            <tr><th>Klients</th><th>Īpašums</th><th>Plāns</th><th>Cena / mēn.</th><th>Parakstīts</th><th>Atjaunošana</th></tr>
          </thead>
          <tbody>
            {(mems || []).length ? mems.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>
                  <Link href={`/birojs/klienti/${m.properties?.customers?.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>
                    {m.properties?.customers?.full_name}
                  </Link>
                </td>
                <td className="small">
                  <Link href={`/birojs/ipasumi/${m.properties?.id}`} style={{ color: 'var(--ink)' }}>
                    {m.properties?.address_line}, {m.properties?.municipality}
                  </Link>
                </td>
                <td><span className="pill p-tier">{TIER[m.tier]}</span></td>
                <td>{eur(m.monthly_price_ex_vat)}</td>
                <td className="small">{d(m.signed_on)}</td>
                <td className="small">{d(m.anniversary_date)}</td>
              </tr>
            )) : <tr><td colSpan="6" className="muted">Nav aktīvu abonementu.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
