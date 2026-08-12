'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'
import { d, eur } from '../../../lib/format'

export default function SentInvoiceList({ invoices }) {
  const [confirmingId, setConfirmingId] = useState(null)
  const [remindingId, setRemindingId] = useState(null)
  const [err, setErr] = useState(null)
  const router = useRouter()

  function goTo(e, id) {
    if (e.target.closest('a, button')) return
    router.push(`/birojs/rekini/${id}`)
  }

  async function confirm(id) {
    setConfirmingId(id); setErr(null)
    const { error } = await supabaseBrowser().from('invoices').update({ status: 'paid' }).eq('id', id)
    setConfirmingId(null)
    if (error) { setErr('Neizdevās atzīmēt kā apmaksātu.'); return }
    router.refresh()
  }

  async function remind(id) {
    setRemindingId(id); setErr(null)
    try {
      const res = await fetch(`/api/invoices/${id}/remind`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt atgādinājumu.'); setRemindingId(null); return }
      setRemindingId(null); router.refresh()
    } catch {
      setErr('Neizdevās nosūtīt atgādinājumu.'); setRemindingId(null)
    }
  }

  if (!invoices.length) {
    return <table><thead><tr><th></th></tr></thead><tbody><tr><td className="muted">Nav nosūtītu, neapmaksātu rēķinu.</td></tr></tbody></table>
  }

  return (
    <>
      <table>
        <thead><tr><th>Nr.</th><th>Klients</th><th>Īpašums</th><th>Izrakstīts</th><th>Termiņš</th><th>Summa</th><th></th><th></th></tr></thead>
        <tbody>
          {invoices.map(inv => {
            const clientName = inv.customers?.customer_type === 'commercial' && inv.customers?.company_name
              ? inv.customers.company_name : inv.customers?.full_name
            return (
              <tr key={inv.id} onClick={e => goTo(e, inv.id)} style={{ cursor: 'pointer' }}>
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
                <td>
                  {inv.customers?.email && (
                    <button type="button" className="btn ghost small" disabled={remindingId === inv.id}
                      onClick={() => remind(inv.id)} title={inv.last_reminder_sent_at ? `Pēdējais atgādinājums: ${d(inv.last_reminder_sent_at)}` : undefined}>
                      {remindingId === inv.id ? 'Sūta…' : inv.last_reminder_sent_at ? 'Atgādināt vēlreiz' : 'Sūtīt atgādinājumu'}
                    </button>
                  )}
                </td>
                <td>
                  <button type="button" className="btn ghost small" disabled={confirmingId === inv.id}
                    onClick={() => confirm(inv.id)}>
                    {confirmingId === inv.id ? 'Saglabā…' : 'Atzīmēt kā apmaksātu'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
    </>
  )
}
