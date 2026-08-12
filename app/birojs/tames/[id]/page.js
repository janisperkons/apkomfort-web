import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { QUOTE_STATUS, d, eur } from '../../../../lib/format'
import TameActions from './quote-actions'

export const dynamic = 'force-dynamic'

export default async function TamesDetail({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const { data: quote } = await sb.from('quotes')
    .select('*, quote_items(*)')
    .eq('id', id).maybeSingle()
  if (!quote) notFound()

  const items = (quote.quote_items || []).sort((a, b) => a.sort_order - b.sort_order)
  const s = QUOTE_STATUS[quote.status] || ['—', 'p-pending']

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Tāme</div>
          <h1>Nr. {quote.quote_number}</h1>
          <div className="sub">
            <span className={'pill ' + s[1]}>{s[0]}</span>
            {quote.sent_at && <> · Nosūtīts {d(quote.sent_at)}</>}
            {quote.client_approved_at && !quote.agreed_start_date && <> · Klients apstiprināja {d(quote.client_approved_at)}</>}
            {quote.agreed_start_date && <> · Darba sākums {d(quote.agreed_start_date)}</>}
          </div>
        </div>
        <div className="right">
          {quote.status !== 'accepted' && (
            <Link href={`/birojs/tames/${id}/redigot`} className="btn ghost">Rediģēt</Link>
          )}
          {quote.customer_id
            ? <Link href={`/birojs/klienti/${quote.customer_id}`} className="btn ghost">Klients</Link>
            : null}
          <Link href="/birojs/tames" className="btn ghost">← Visas tāmes</Link>
        </div>
      </div>

      {quote.converted_invoice_id && (
        <div className="note" style={{ marginBottom: 20 }}>
          Šī tāme ir apstiprināta un pārvērsta par rēķinu:{' '}
          <Link href={`/birojs/rekini/${quote.converted_invoice_id}`} style={{ fontWeight: 600 }}>skatīt rēķinu →</Link>
        </div>
      )}

      {quote.client_approved_at && !quote.converted_invoice_id && (
        <div className="note" style={{ marginBottom: 20 }}>
          Klients apstiprināja šo piedāvājumu {d(quote.client_approved_at)}. Vienojieties par darba sākuma datumu
          un pabeidziet apstiprināšanu zemāk, lai izveidotu rēķinu.
        </div>
      )}

      <div className="card" style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, letterSpacing: '.1em', color: 'var(--ink)' }}>AP KOMFORTS</div>
            <div className="small muted" style={{ marginTop: 4 }}>Rīga, Latvija · +371 26 275 983</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="small muted">Izveidots</div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(quote.created_at)}</div>
            {quote.valid_until && (<>
              <div className="small muted" style={{ marginTop: 8 }}>Derīgs līdz</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{d(quote.valid_until)}</div>
            </>)}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="small muted">Adresāts</div>
          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{quote.contact_name}</div>
          {quote.property_address && <div className="small">{quote.property_address}</div>}
          {quote.contact_email && <div className="small">{quote.contact_email}</div>}
          {quote.contact_phone && <div className="small">{quote.contact_phone}</div>}
          {!quote.customer_id && quote.status !== 'accepted' && (
            <div className="small" style={{ color: 'var(--acc)', marginTop: 4 }}>
              Nav piesaistīts klienta konts — nepieciešams pirms apstiprināšanas.{' '}
              <Link href={`/birojs/tames/${id}/redigot`}>Piesaistīt</Link>
            </div>
          )}
        </div>

        <table>
          <thead><tr><th>Apraksts</th><th>Daudzums</th><th>Cena</th><th>Summa</th></tr></thead>
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
            <dt>Starpsumma</dt><dd style={{ textAlign: 'right' }}>{eur(quote.subtotal)}</dd>
            {quote.vat_enabled && (<><dt>PVN ({Number(quote.vat_rate)}%)</dt><dd style={{ textAlign: 'right' }}>{eur(quote.vat_amount)}</dd></>)}
            <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Kopā</dt>
            <dd style={{ textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>{eur(quote.total)}</dd>
          </dl>
        </div>

        {quote.notes && <div className="note" style={{ marginTop: 20 }}>{quote.notes}</div>}
      </div>

      <div style={{ marginTop: 20, maxWidth: 760 }}>
        <TameActions quote={quote} />
      </div>
    </>
  )
}
