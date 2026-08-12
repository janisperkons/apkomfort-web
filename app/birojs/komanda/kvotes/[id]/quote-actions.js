'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../../lib/browserAuth'

export default function QuoteActions({ quote }) {
  const [status, setStatus] = useState(quote.status)
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function send() {
    const confirmText = status === 'sent' || status === 'accepted' || status === 'declined'
      ? 'Nosūtīt šo kvoti vēlreiz pa e-pastu?'
      : 'Nosūtīt šo kvoti adresātam pa e-pastu?'
    if (!window.confirm(confirmText)) return
    setSending(true); setErr(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt kvoti.'); setSending(false); return }
      setStatus('sent'); setSending(false); router.refresh()
    } catch {
      setErr('Neizdevās nosūtīt kvoti.'); setSending(false)
    }
  }

  async function setDecision(next) {
    setUpdating(true); setErr(null)
    const { error } = await supabaseBrowser().from('quotes').update({ status: next }).eq('id', quote.id)
    setUpdating(false)
    if (error) { setErr('Neizdevās atjaunināt statusu.'); return }
    setStatus(next); router.refresh()
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>

        {quote.contact_email ? (
          <button type="button" className="btn" onClick={send} disabled={sending}>
            {sending ? 'Sūta…' : status === 'draft' ? 'Nosūtīt adresātam' : 'Nosūtīt vēlreiz'}
          </button>
        ) : (
          <div className="small muted">Nav norādīts e-pasts — nosūtīt nevar.</div>
        )}

        {(status === 'sent') && (
          <>
            <button type="button" className="btn ghost" onClick={() => setDecision('accepted')} disabled={updating}>Atzīmēt kā pieņemtu</button>
            <button type="button" className="btn ghost" onClick={() => setDecision('declined')} disabled={updating}>Atzīmēt kā noraidītu</button>
          </>
        )}
      </div>

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
    </div>
  )
}
