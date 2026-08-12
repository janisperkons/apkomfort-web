import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { INVOICE_STATUS, d, eur } from '../../../../lib/format'
import InvoiceActions from './invoice-actions'

export const dynamic = 'force-dynamic'

export default async function RekinsDetail({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: invoice } = await sb.from('invoices')
    .select('*, invoice_items(*), customers(id, full_name, email, customer_type, company_name, registration_number, legal_address, vat_number), properties(address_line, municipality)')
    .eq('id', id).single()
  if (!invoice) notFound()

  const items = (invoice.invoice_items || []).sort((a, b) => a.sort_order - b.sort_order)
  const s = INVOICE_STATUS[invoice.status] || ['—', 'p-pending']
  const customer = invoice.customers
  const address = invoice.properties ? [invoice.properties.address_line, invoice.properties.municipality].filter(Boolean).join(', ') : null

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Rēķins</div>
          <h1>Nr. {invoice.invoice_number}</h1>
          <div className="sub">
            <span className={'pill ' + s[1]}>{s[0]}</span>
            {invoice.sent_at && <> · Nosūtīts {d(invoice.sent_at)}</>}
          </div>
        </div>
        <div className="right">
          <Link href={`/birojs/klienti/${customer?.id}`} className="btn ghost">← Klients</Link>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, letterSpacing: '.1em', color: 'var(--ink)' }}>AP KOMFORTS</div>
            <div className="small muted" style={{ marginTop: 4 }}>Rīga, Latvija · +371 26 275 983</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="small muted">Izrakstīts</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(invoice.issue_date)}</div>
            {invoice.due_date && (<>
              <div className="small muted" style={{ marginTop: 8 }}>Apmaksas termiņš</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(invoice.due_date)}</div>
            </>)}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="small muted">Saņēmējs</div>
          {customer?.customer_type === 'commercial' && customer?.company_name ? (
            <>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{customer.company_name}</div>
              {customer.registration_number && <div className="small">Reģ. Nr. {customer.registration_number}</div>}
              {customer.legal_address && <div className="small">{customer.legal_address}</div>}
              {customer.vat_number && <div className="small">PVN {customer.vat_number}</div>}
              <div className="small">{customer.full_name}</div>
            </>
          ) : (
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{customer?.full_name}</div>
          )}
          {address && (
            <div className="small">
              {invoice.property_id ? <Link href={`/birojs/ipasumi/${invoice.property_id}`}>{address}</Link> : address}
            </div>
          )}
          {customer?.email && <div className="small">{customer.email}</div>}
        </div>

        <table>
          <thead>
            <tr><th>Apraksts</th><th>Daudzums</th><th>Cena</th><th>Summa</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td>{it.description}</td>
                <td className="small">{Number(it.quantity)}</td>
                <td className="small">{eur(it.unit_price)}</td>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(it.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, marginLeft: 'auto', maxWidth: 280 }}>
          <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}>
            <dt>Starpsumma</dt><dd style={{ textAlign: 'right' }}>{eur(invoice.subtotal)}</dd>
            {invoice.vat_enabled && (<><dt>PVN ({Number(invoice.vat_rate)}%)</dt><dd style={{ textAlign: 'right' }}>{eur(invoice.vat_amount)}</dd></>)}
            <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Kopā</dt>
            <dd style={{ textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>{eur(invoice.total)}</dd>
          </dl>
        </div>

        {invoice.notes && (
          <div className="note" style={{ marginTop: 20 }}>{invoice.notes}</div>
        )}
      </div>

      <div style={{ marginTop: 20, maxWidth: 760 }}>
        <InvoiceActions invoice={invoice} customerEmail={customer?.email} />
      </div>
    </>
  )
}
