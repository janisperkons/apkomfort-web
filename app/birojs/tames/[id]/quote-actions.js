'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function TameActions({ quote }) {
  const [status, setStatus] = useState(quote.status)
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [startDate, setStartDate] = useState(quote.client_proposed_start_date || '')
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
    const reason = window.prompt('Noraidīšanas iemesls (nav obligāti):', '')
    if (reason === null) return
    setUpdating(true); setErr(null)
    const { error } = await supabaseBrowser().from('quotes')
      .update({ status: 'declined', declined_reason: reason.trim() || null, declined_by: 'staff' }).eq('id', quote.id)
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

  async function remove() {
    const extra = quote.converted_invoice_id
      ? ' Šai tāmei ir piesaistīts rēķins — rēķins netiks dzēsts, bet zaudēsiet saiti uz to.'
      : ''
    if (!window.confirm(`Tiešām dzēst tāmi Nr. ${quote.quote_number}? Šo darbību nevar atsaukt.${extra}`)) return
    setDeleting(true); setErr(null)
    const { error } = await supabaseBrowser().from('quotes').delete().eq('id', quote.id)
    setDeleting(false)
    if (error) { setErr('Neizdevās dzēst tāmi.'); return }
    router.push('/birojs/tames')
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
          {quote.client_proposed_start_date && (
            <p className="small muted" style={{ marginTop: -4, marginBottom: 8 }}>
              Klients ierosināja: {quote.client_proposed_start_date}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, maxWidth: 340 }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <button type="button" className="btn" onClick={accept} disabled={accepting} style={{ whiteSpace: 'nowrap' }}>
              {accepting ? 'Apstiprina…' : 'Apstiprināt un izveidot rēķinu'}
            </button>
          </div>
        </div>
      )}

      {status === 'declined' && quote.declined_reason && (
        <div className="note" style={{ marginTop: 14 }}>
          Noraidīts {quote.declined_by === 'client' ? 'no klienta puses' : 'no biroja puses'}. Iemesls: {quote.declined_reason}
        </div>
      )}

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
        <button type="button" onClick={remove} disabled={deleting}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bad)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: 13 }}>
          {deleting ? 'Dzēš…' : 'Dzēst tāmi'}
        </button>
      </div>
    </div>
  )
}
