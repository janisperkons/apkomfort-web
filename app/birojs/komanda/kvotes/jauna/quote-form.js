'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../../lib/browserAuth'
import { eur } from '../../../../../lib/format'

let nextRowId = 1
function blankRow() { return { id: nextRowId++, description: '', quantity: 1, unitPrice: '', discountPercent: '' } }
function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100 }

export default function QuoteForm({ customers }) {
  const [customerId, setCustomerId] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [vatEnabled, setVatEnabled] = useState(false)
  const [vatRate, setVatRate] = useState(21)
  const [rows, setRows] = useState([blankRow()])
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  function updateRow(id, field, value) {
    setRows(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r))
  }
  function addRow() { setRows(rs => [...rs, blankRow()]) }
  function removeRow(id) { setRows(rs => rs.length > 1 ? rs.filter(r => r.id !== id) : rs) }

  function pickCustomer(id) {
    setCustomerId(id)
    const c = customers.find(x => x.id === id)
    if (!c) return
    setContactName(c.customer_type === 'commercial' && c.company_name ? c.company_name : c.full_name)
    setContactEmail(c.email || '')
    setContactPhone(c.phone || '')
    const p = (c.properties || [])[0]
    if (p) setPropertyAddress(`${p.address_line}, ${p.municipality}`)
  }

  const lineTotals = useMemo(() => rows.map(r => {
    const qty = Number(r.quantity) || 0
    const price = Number(r.unitPrice) || 0
    const discountPct = Math.min(100, Math.max(0, Number(r.discountPercent) || 0))
    return round2(qty * price * (1 - discountPct / 100))
  }), [rows])

  const subtotal = useMemo(() => round2(lineTotals.reduce((a, b) => a + b, 0)), [lineTotals])
  const vatAmount = useMemo(() => vatEnabled ? round2(subtotal * (Number(vatRate) || 0) / 100) : 0, [vatEnabled, vatRate, subtotal])
  const total = useMemo(() => round2(subtotal + vatAmount), [subtotal, vatAmount])

  const validRows = rows.filter(r => r.description.trim() && Number(r.unitPrice) > 0)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    if (!contactName.trim()) { setErr('Norādiet adresāta vārdu vai uzņēmumu.'); return }
    if (validRows.length === 0) { setErr('Pievienojiet vismaz vienu rindu ar aprakstu un cenu (cenai jābūt lielākai par 0).'); return }
    setBusy(true); setErr(null)
    const sb = supabaseBrowser()

    const { data: numberData, error: numErr } = await sb.rpc('next_quote_number')
    if (numErr || !numberData) { setErr('Neizdevās piešķirt kvotes numuru.'); setBusy(false); return }

    const { data: quote, error: qErr } = await sb.from('quotes').insert({
      customer_id: customerId || null,
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
      property_address: propertyAddress.trim() || null,
      quote_number: numberData,
      status: 'draft',
      valid_until: validUntil || null,
      vat_enabled: vatEnabled,
      vat_rate: vatEnabled ? (Number(vatRate) || 0) : 21,
      subtotal, vat_amount: vatAmount, total,
      notes: notes.trim() || null,
    }).select('id').single()
    if (qErr || !quote) { setErr('Neizdevās izveidot kvoti.'); setBusy(false); return }

    const items = rows.filter(r => r.description.trim() && Number(r.unitPrice) > 0).map((r, i) => {
      const discountPercent = Math.min(100, Math.max(0, Number(r.discountPercent) || 0))
      return {
        quote_id: quote.id,
        description: r.description.trim(),
        quantity: Number(r.quantity) || 1,
        unit_price: Number(r.unitPrice) || 0,
        discount_percent: discountPercent,
        line_total: round2((Number(r.quantity) || 0) * (Number(r.unitPrice) || 0) * (1 - discountPercent / 100)),
        sort_order: i,
      }
    })
    const { error: itemsErr } = await sb.from('quote_items').insert(items)
    if (itemsErr) { setErr('Kvote izveidota, bet neizdevās saglabāt rindas.'); setBusy(false); return }

    router.push(`/birojs/komanda/kvotes/${quote.id}`)
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 760 }}>
      <label>Esošs klients (nav obligāti)</label>
      <select value={customerId} onChange={e => pickCustomer(e.target.value)}>
        <option value="">— Jauns interesents —</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.customer_type === 'commercial' && c.company_name ? c.company_name : c.full_name}
          </option>
        ))}
      </select>

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Vārds / uzņēmums</label>
          <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Piemēram, Jānis Bērziņš" />
        </div>
        <div>
          <label>E-pasts</label>
          <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
        </div>
        <div>
          <label>Telefons</label>
          <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
        </div>
        <div>
          <label>Adrese (nav obligāti)</label>
          <input type="text" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} />
        </div>
        <div>
          <label>Derīgs līdz (nav obligāti)</label>
          <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
        </div>
      </div>

      <label>Piezīmes (nav obligāti)</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Piemēram, darba apraksts vai nosacījumi" />

      <div className="checks" style={{ marginTop: 14 }}>
        <label><input type="checkbox" checked={vatEnabled} onChange={e => setVatEnabled(e.target.checked)} />Piemērot PVN</label>
      </div>
      {vatEnabled && (
        <div style={{ maxWidth: 160 }}>
          <label>PVN likme (%)</label>
          <input type="number" min="0" max="100" step="0.1" value={vatRate} onChange={e => setVatRate(e.target.value)} />
        </div>
      )}

      <h3 style={{ margin: '22px 0 10px' }}>Rindas</h3>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Apraksts</th>
              <th>Daudzums</th>
              <th>Cena (€)</th>
              <th>Atlaide (%)</th>
              <th>Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td><input type="text" value={r.description} onChange={e => updateRow(r.id, 'description', e.target.value)} placeholder="Piemēram, katla nomaiņa" /></td>
                <td style={{ width: 100 }}><input type="number" min="0" step="0.01" value={r.quantity} onChange={e => updateRow(r.id, 'quantity', e.target.value)} /></td>
                <td style={{ width: 120 }}><input type="number" min="0" step="0.01" value={r.unitPrice} onChange={e => updateRow(r.id, 'unitPrice', e.target.value)} /></td>
                <td style={{ width: 100 }}><input type="number" min="0" max="100" step="1" value={r.discountPercent}
                  onChange={e => updateRow(r.id, 'discountPercent', e.target.value)} placeholder="0" /></td>
                <td style={{ width: 100, whiteSpace: 'nowrap' }}>{eur(lineTotals[i])}</td>
                <td style={{ width: 40 }}>
                  <button type="button" className="btn ghost" style={{ padding: '5px 10px', fontSize: 12 }}
                    onClick={() => removeRow(r.id)} disabled={rows.length === 1}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn ghost" style={{ marginTop: 10 }} onClick={addRow}>+ Pievienot rindu</button>

      <div style={{ marginTop: 20, marginLeft: 'auto', maxWidth: 280 }}>
        <dl className="kv" style={{ gridTemplateColumns: '1fr auto' }}>
          <dt>Starpsumma</dt><dd style={{ textAlign: 'right' }}>{eur(subtotal)}</dd>
          {vatEnabled && (<><dt>PVN ({Number(vatRate) || 0}%)</dt><dd style={{ textAlign: 'right' }}>{eur(vatAmount)}</dd></>)}
          <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Kopā</dt>
          <dd style={{ textAlign: 'right', fontWeight: 600, color: 'var(--ink)' }}>{eur(total)}</dd>
        </dl>
      </div>

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}

      <button className="btn" style={{ marginTop: 20 }} disabled={busy}>{busy ? 'Saglabā…' : 'Izveidot kvoti'}</button>
    </form>
  )
}
