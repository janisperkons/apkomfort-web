import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { QUOTE_STATUS, d, eur } from '../../../../lib/format'
import ApproveQuote from './approve-quote'
import SelectProperty from './select-property'

export const dynamic = 'force-dynamic'

export default async function ManasTamesDetalas({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: quote } = await sb.from('quotes')
    .select('*, quote_items(*), properties(address_line, municipality)')
    .eq('id', id).maybeSingle()
  if (!quote) notFound()

  if (!quote.viewed_at) {
    await sb.rpc('mark_quote_viewed', { p_quote_id: id })
  }

  let ownProperties = []
  if (quote.customer_id && !quote.property_id) {
    const { data } = await sb.from('properties').select('id, address_line, municipality').eq('customer_id', quote.customer_id)
    ownProperties = data || []
  }

  const items = (quote.quote_items || []).sort((a, b) => a.sort_order - b.sort_order)
  const hasDiscounts = items.some(it => Number(it.discount_percent) > 0)
  const s = QUOTE_STATUS[quote.status] || ['—', 'p-pending']

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Tāme</div>
          <h1>Nr. {quote.quote_number}</h1>
          <div className="sub"><span className={'pill ' + s[1]}>{s[0]}</span></div>
        </div>
        <div className="right"><Link href="/panelis/tames" className="btn ghost">← Manas tāmes</Link></div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="small muted">Izveidota</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(quote.created_at)}</div>
          </div>
          {quote.valid_until && (
            <div>
              <div className="small muted">Derīga līdz</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(quote.valid_until)}</div>
            </div>
          )}
          {quote.target_start_date && (
            <div>
              <div className="small muted">Plānotais sākums</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {d(quote.target_start_date)} · {quote.duration_days} {quote.duration_days === 1 ? 'diena' : 'dienas'}
              </div>
            </div>
          )}
        </div>

        {quote.properties ? (
          <p className="small muted" style={{ marginTop: -10, marginBottom: 20 }}>{quote.properties.address_line}, {quote.properties.municipality}</p>
        ) : quote.property_address && (
          <p className="small muted" style={{ marginTop: -10, marginBottom: 20 }}>{quote.property_address}</p>
        )}

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
            <dt>Starpsumma</dt><dd style={{ textAlign: 'right' }}>{eur(quote.subtotal)}</dd>
            {quote.vat_enabled && (<><dt>PVN ({Number(quote.vat_rate)}%)</dt><dd style={{ textAlign: 'right' }}>{eur(quote.vat_amount)}</dd></>)}
            <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Kopā</dt>
            <dd style={{ textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>{eur(quote.total)}</dd>
          </dl>
        </div>

        {quote.notes && <div className="note" style={{ marginTop: 20 }}>{quote.notes}</div>}
      </div>

      <div className="note" style={{ marginTop: 16, maxWidth: 640 }}>
        Ja rodas jautājumi vai vēlaties ko pielāgot, sazinieties ar mums: <a href="tel:+37126275983">+371 26 275 983</a>.
        {quote.status === 'sent' && ' Ja piedāvājums der, apstiprināt to varat šeit, savā kontā.'}
      </div>

      {quote.customer_id && !quote.property_id && quote.status === 'sent' && (
        <SelectProperty quoteId={quote.id} properties={ownProperties} />
      )}

      <ApproveQuote quote={quote} />

      <div style={{ marginTop: 16 }}>
        <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>
      </div>
    </>
  )
}
