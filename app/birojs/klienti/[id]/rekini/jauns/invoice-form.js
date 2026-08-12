'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../../../lib/browserAuth'
import { eur, TIER } from '../../../../../../lib/format'

let nextRowId = 1
function blankRow() { return { id: nextRowId++, description: '', quantity: 1, unitPrice: '' } }

function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100 }

export default function InvoiceForm({ customerId, properties }) {
  const [propertyId, setPropertyId] = useState('')
  const [dueDate, setDueDate] = useState('')
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

  function prefillFromMembership(m, property) {
    const isAnnual = m.payment_plan === 'annual_upfront'
    const monthly = Number(m.monthly_price_ex_vat) || 0
    const amount = round2(isAnnual ? monthly * 12 : monthly)
    const desc = `${TIER[m.tier] || m.tier} plāns — ${isAnnual ? 'gada abonements (12 mēneši)' : 'ikmēneša abonements'}`
    setPropertyId(property.id)
    setRows([{ id: nextRowId++, description: desc, quantity: 1, unitPrice: String(amount) }])
  }

  const activeMemberships = properties.flatMap(p =>
    (p.memberships || []).filter(m => m.status === 'active').map(m => ({ membership: m, property: p })))

  const lineTotals = useMemo(() => rows.map(r => {
    const qty = Number(r.quantity) || 0
    const price = Number(r.unitPrice) || 0
    return round2(qty * price)
  }), [rows])

  const subtotal = useMemo(() => round2(lineTotals.reduce((a, b) => a + b, 0)), [lineTotals])
  const vatAmount = useMemo(() => vatEnabled ? round2(subtotal * (Number(vatRate) || 0) / 100) : 0, [vatEnabled, vatRate, subtotal])
  const total = useMemo(() => round2(subtotal + vatAmount), [subtotal, vatAmount])

  const validRows = rows.filter(r => r.description.trim() && Number(r.unitPrice) > 0)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    if (validRows.length === 0) { setErr('Pievienojiet vismaz vienu rindu ar aprakstu un cenu (cenai jābūt lielākai par 0).'); return }
    setBusy(true); setErr(null)
    const sb = supabaseBrowser()

    const { data: numberData, error: numErr } = await sb.rpc('next_invoice_number')
    if (numErr || !numberData) { setErr('Neizdevās piešķirt rēķina numuru.'); setBusy(false); return }

    const { data: invoice, error: invErr } = await sb.from('invoices').insert({
      customer_id: customerId,
      property_id: propertyId || null,
      invoice_number: numberData,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: dueDate || null,
      status: 'draft',
      vat_enabled: vatEnabled,
      vat_rate: vatEnabled ? (Number(vatRate) || 0) : 21,
      subtotal, vat_amount: vatAmount, total,
      notes: notes.trim() || null,
    }).select('id').single()
    if (invErr || !invoice) { setErr('Neizdevās izveidot rēķinu.'); setBusy(false); return }

    const items = rows.filter(r => r.description.trim() && Number(r.unitPrice) > 0).map((r, i) => ({
      invoice_id: invoice.id,
      description: r.description.trim(),
      quantity: Number(r.quantity) || 1,
      unit_price: Number(r.unitPrice) || 0,
      line_total: round2((Number(r.quantity) || 0) * (Number(r.unitPrice) || 0)),
      sort_order: i,
    }))
    const { error: itemsErr } = await sb.from('invoice_items').insert(items)
    if (itemsErr) { setErr('Rēķins izveidots, bet neizdevās saglabāt rindas.'); setBusy(false); return }

    router.push(`/birojs/rekini/${invoice.id}`)
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 760 }}>
      {activeMemberships.length > 0 && (
        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
          <label style={{ marginBottom: 8 }}>Aizpildīt no abonementa</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeMemberships.map(({ membership: m, property: p }) => {
              const isAnnual = m.payment_plan === 'annual_upfront'
              const amount = round2(isAnnual ? Number(m.monthly_price_ex_vat || 0) * 12 : Number(m.monthly_price_ex_vat || 0))
              return (
                <button key={m.id} type="button" className="btn ghost" style={{ fontSize: 13 }}
                  onClick={() => prefillFromMembership(m, p)}>
                  {TIER[m.tier] || m.tier} — {p.address_line} · {eur(amount)}{isAnnual ? ' / gadā' : ' / mēn.'}
                </button>
              )
            })}
          </div>
          <p className="small muted" style={{ marginTop: 8 }}>
            Aizpilda rindu ar plāna summu — pārbaudiet un koriģējiet pirms nosūtīšanas (piemēram, ja piemērojama atlaide par gada apmaksu iepriekš).
          </p>
        </div>
      )}

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Īpašums (nav obligāti)</label>
          <select value={propertyId} onChange={e => setPropertyId(e.target.value)}>
            <option value="">— Nav norādīts —</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.address_line}, {p.municipality}</option>)}
          </select>
        </div>
        <div>
          <label>Apmaksas termiņš (nav obligāti)</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
      </div>

      <label>Piezīmes (nav obligāti)</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Piemēram, apmaksas norādījumi" />

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
              <th style={{ width: '45%' }}>Apraksts</th>
              <th>Daudzums</th>
              <th>Cena (€)</th>
              <th>Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td><input type="text" value={r.description} onChange={e => updateRow(r.id, 'description', e.target.value)} placeholder="Piemēram, ikgadējā apkope" /></td>
                <td style={{ width: 100 }}><input type="number" min="0" step="0.01" value={r.quantity} onChange={e => updateRow(r.id, 'quantity', e.target.value)} /></td>
                <td style={{ width: 120 }}><input type="number" min="0" step="0.01" value={r.unitPrice} onChange={e => updateRow(r.id, 'unitPrice', e.target.value)} /></td>
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

      <button className="btn" style={{ marginTop: 20 }} disabled={busy}>{busy ? 'Saglabā…' : 'Izveidot rēķinu'}</button>
    </form>
  )
}
