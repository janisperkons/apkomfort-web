'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { dt } from '../../../../lib/format'

export default function AccountStatusActions({ customer }) {
  const [approvedAt, setApprovedAt] = useState(customer.approved_at)
  const [clientCode, setClientCode] = useState(customer.client_code)
  const [frozen, setFrozen] = useState(customer.frozen)
  const [frozenReason, setFrozenReason] = useState(customer.frozen_reason)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function approve() {
    if (!window.confirm('Apstiprināt šo klientu un nosūtīt viņam apstiprinājuma e-pastu?')) return
    setBusy(true); setErr(null)
    try {
      const res = await fetch(`/api/customers/${customer.id}/approve`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās apstiprināt.'); setBusy(false); return }
      setApprovedAt(new Date().toISOString())
      setClientCode(data.clientCode || null)
      router.refresh()
    } catch {
      setErr('Neizdevās apstiprināt.')
    }
    setBusy(false)
  }

  async function freeze() {
    const reason = window.prompt('Iesaldēšanas iemesls (redzams klientam):', 'Nav veikts maksājums')
    if (reason === null) return
    setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('customers').update({
      frozen: true, frozen_reason: reason.trim() || null, frozen_at: new Date().toISOString(),
    }).eq('id', customer.id)
    setBusy(false)
    if (error) { setErr('Neizdevās iesaldēt kontu.'); return }
    setFrozen(true); setFrozenReason(reason.trim() || null); router.refresh()
  }

  async function unfreeze() {
    setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('customers').update({
      frozen: false, frozen_reason: null,
    }).eq('id', customer.id)
    setBusy(false)
    if (error) { setErr('Neizdevās atjaunot kontu.'); return }
    setFrozen(false); setFrozenReason(null); router.refresh()
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {approvedAt ? (
          <>
            <span className="pill p-active">Apstiprināts {dt(approvedAt)}</span>
            {clientCode && <span className="small muted">Klienta Nr. <b style={{ color: 'var(--ink)' }}>{clientCode}</b></span>}
          </>
        ) : (
          <button type="button" className="btn ghost" onClick={approve} disabled={busy}>
            {busy ? '…' : 'Apstiprināt un nosūtīt e-pastu'}
          </button>
        )}

        {frozen ? (
          <>
            <span className="pill p-declined">Iesaldēts</span>
            <button type="button" className="btn ghost" onClick={unfreeze} disabled={busy}>Atjaunot kontu</button>
          </>
        ) : (
          <button type="button" className="btn ghost" onClick={freeze} disabled={busy}>Iesaldēt kontu</button>
        )}
      </div>
      {frozen && frozenReason && <div className="small muted" style={{ marginTop: 10 }}>Iemesls: {frozenReason}</div>}
      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
    </div>
  )
}
