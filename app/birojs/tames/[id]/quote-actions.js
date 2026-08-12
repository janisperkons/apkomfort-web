'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function TameActions({ quote }) {
  const [status, setStatus] = useState(quote.status)
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function send() {
    const confirmText = status === 'sent' || status === 'declined'
      ? 'Nosūtīt šo tāmi vēlreiz pa e-pastu?'
      : 'Nosūtīt šo tāmi adresātam pa e-pastu?'
    if (!window.confirm(confirmText)) return
    setSending(true); setErr(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt tāmi.'); setSending(false); return }
      setStatus('sent'); setSending(false); router.refresh()
    } catch {
      setErr('Neizdevās nosūtīt tāmi.'); setSending(false)
    }
  }

  async function decline() {
    if (!window.confirm('Atzīmēt šo tāmi kā noraidītu?')) return
    setUpdating(true); setErr(null)
    const { error } = await supabaseBrowser().from('quotes').update({ status: 'declined' }).eq('id', quote.id)
    setUpdating(false)
    if (error) { setErr('Neizdevās atjaunināt statusu.'); return }
    setStatus('declined'); router.refresh()
  }

  async function accept() {
    if (!startDate) { setErr('Norādiet darba sākuma datumu.'); return }
    if (!quote.customer_id) { setErr('Vispirms piesaistiet tāmi klienta kontam (skatiet Rediģēt).'); return }
    if (!window.confirm(`Apstiprināt šo tāmi un izveidot rēķinu ar darba sākumu ${startDate}?`)) return
    setAccepting(true); setErr(null)
    const { data, error } = await supabaseBrowser().rpc('accept_quote', { p_quote_id: quote.id, p_start_date: startDate })
    setAccepting(false)
    if (error) { setErr(error.message || 'Neizdevās apstiprināt tāmi.'); return }
    router.push(`/birojs/rekini/${data}`)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>

        {status !== 'accepted' && (
          quote.contact_email ? (
            <button type="button" className="btn" onClick={send} disabled={sending}>
              {sending ? 'Sūta…' : status === 'draft' ? 'Nosūtīt adresātam' : 'Nosūtīt vēlreiz'}
            </button>
          ) : (
            <div className="small muted">Nav norādīts e-pasts — nosūtīt nevar.</div>
          )
        )}

        {(status === 'draft' || status === 'sent') && (
          <button type="button" className="btn ghost" onClick={decline} disabled={updating}>Atzīmēt kā noraidītu</button>
        )}
      </div>

      {(status === 'draft' || status === 'sent') && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <label>Darba sākuma datums — apstiprinot izveidos rēķinu, kas stāsies spēkā šajā dienā</label>
          <div style={{ display: 'flex', gap: 10, maxWidth: 340 }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <button type="button" className="btn" onClick={accept} disabled={accepting} style={{ whiteSpace: 'nowrap' }}>
              {accepting ? 'Apstiprina…' : 'Apstiprināt un izveidot rēķinu'}
            </button>
          </div>
        </div>
      )}

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
    </div>
  )
}
