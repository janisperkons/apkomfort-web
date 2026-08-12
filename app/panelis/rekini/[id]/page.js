import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { INVOICE_STATUS, d, eur } from '../../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function ManaRekinaDetalas({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: invoice } = await sb.from('invoices')
    .select('*, invoice_items(*), properties(address_line, municipality)')
    .eq('id', id).maybeSingle()
  if (!invoice) notFound()

  if (!invoice.viewed_at) {
    await sb.rpc('mark_invoice_viewed', { p_invoice_id: id })
  }

  const items = (invoice.invoice_items || []).sort((a, b) => a.sort_order - b.sort_order)
  const hasDiscounts = items.some(it => Number(it.discount_percent) > 0)
  const s = INVOICE_STATUS[invoice.status] || ['—', 'p-pending']
  const address = invoice.properties ? `${invoice.properties.address_line}, ${invoice.properties.municipality}` : null

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Rēķins</div>
          <h1>Nr. {invoice.invoice_number}</h1>
          <div className="sub"><span className={'pill ' + s[1]}>{s[0]}</span></div>
        </div>
        <div className="right"><Link href="/panelis/rekini" className="btn ghost">← Mani rēķini</Link></div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="small muted">Izrakstīts</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(invoice.issue_date)}</div>
          </div>
          {invoice.due_date && (
            <div>
              <div className="small muted">Apmaksas termiņš</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(invoice.due_date)}</div>
            </div>
          )}
        </div>

        {address && <p className="small muted" style={{ marginTop: -10, marginBottom: 20 }}>{address}</p>}

        <table>
          <thead><tr><th>Apraksts</th><th>Daudzums</th><th>Cena</th>{hasDiscounts && <th>Atlaide</th>}<th>Summa</th></tr></thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td>{it.description}</td>
                <td className="small">{Number(it.quantity)}</td>
                <td className="small">{eur(it.unit_price)}</td>
                {hasDiscounts && <td className="small">{Number(it.discount_percent) > 0 ? `-${Number(it.discount_percent)}%` : '—'}</td>}
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

        {invoice.notes && <div className="note" style={{ marginTop: 20 }}>{invoice.notes}</div>}
      </div>

      <div style={{ marginTop: 16 }}>
        <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>
      </div>
    </>
  )
}
