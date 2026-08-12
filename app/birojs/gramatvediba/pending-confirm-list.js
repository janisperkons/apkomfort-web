'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'
import { d, eur } from '../../../lib/format'

export default function PendingConfirmList({ invoices }) {
  const [confirmingId, setConfirmingId] = useState(null)
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
    if (error) { setErr('Neizdevās apstiprināt apmaksu.'); return }
    router.refresh()
  }

  return (
    <>
      <table>
        <thead><tr><th>Nr.</th><th>Klients</th><th>Summa</th><th>Ziņoja</th><th>Piezīme</th><th></th></tr></thead>
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
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                <td className="small">{d(inv.payment_reported_at)}</td>
                <td className="small muted">{inv.payment_reported_note || '—'}</td>
                <td>
                  <button type="button" className="btn ghost small" disabled={confirmingId === inv.id}
                    onClick={() => confirm(inv.id)}>
                    {confirmingId === inv.id ? 'Apstiprina…' : 'Apstiprināt apmaksu'}
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
