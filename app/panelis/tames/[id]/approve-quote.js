'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dt, d } from '../../../../lib/format'

export default function ApproveQuote({ quote }) {
  const [mode, setMode] = useState(null) // null | 'accept' | 'reject'
  const [startDate, setStartDate] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [status, setStatus] = useState(quote.status)
  const [approvedAt, setApprovedAt] = useState(quote.client_approved_at)
  const [proposedDate, setProposedDate] = useState(quote.client_proposed_start_date)
  const router = useRouter()

  if (status === 'declined') {
    return (
      <div className="note" style={{ marginTop: 16 }}>
        Jūs noraidījāt šo piedāvājumu. Ja pārdomājāt, sazinieties ar mums: <a href="tel:+37126275983">+371 26 275 983</a>.
      </div>
    )
  }
  if (status !== 'sent') return null

  if (approvedAt) {
    return (
      <div className="note" style={{ marginTop: 16 }}>
        Jūs apstiprinājāt šo piedāvājumu {dt(approvedAt)}
        {proposedDate && <> ar ierosināto darba sākumu {d(proposedDate)}</>}
        — gaidām, kad AP Komforts saskaņos datumu un izrakstīs rēķinu.
      </div>
    )
  }

  async function accept(e) {
    e.preventDefault()
    if (!startDate) { setErr('Norādiet vēlamo darba sākuma datumu.'); return }
    setBusy(true); setErr(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposedStartDate: startDate }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās apstiprināt piedāvājumu.'); setBusy(false); return }
      setApprovedAt(new Date().toISOString()); setProposedDate(startDate)
      setBusy(false); router.refresh()
    } catch {
      setErr('Neizdevās apstiprināt piedāvājumu.'); setBusy(false)
    }
  }

  async function reject(e) {
    e.preventDefault()
    if (!reason.trim()) { setErr('Lūdzu norādiet iemeslu.'); return }
    setBusy(true); setErr(null)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/reject`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās noraidīt piedāvājumu.'); setBusy(false); return }
      setStatus('declined'); setBusy(false); router.refresh()
    } catch {
      setErr('Neizdevās noraidīt piedāvājumu.'); setBusy(false)
    }
  }

  if (mode === 'accept') {
    return (
      <form onSubmit={accept} className="card" style={{ marginTop: 16, maxWidth: 480 }}>
        <label>Vēlamais darba sākuma datums</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <p className="small muted" style={{ marginTop: 8 }}>AP Komforts apstiprinās šo datumu, un tikai tad tiks izrakstīts rēķins.</p>
        {err && <div className="note warn" style={{ marginTop: 10 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn" disabled={busy}>{busy ? 'Sūta…' : 'Apstiprināt piedāvājumu'}</button>
          <button type="button" className="btn ghost" onClick={() => setMode(null)} disabled={busy}>Atcelt</button>
        </div>
      </form>
    )
  }

  if (mode === 'reject') {
    return (
      <form onSubmit={reject} className="card" style={{ marginTop: 16, maxWidth: 480 }}>
        <label>Kāpēc noraidāt piedāvājumu?</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Piemēram, cena par augstu, izvēlējāmies citu izpildītāju…" />
        {err && <div className="note warn" style={{ marginTop: 10 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn" disabled={busy}>{busy ? 'Sūta…' : 'Noraidīt piedāvājumu'}</button>
          <button type="button" className="btn ghost" onClick={() => setMode(null)} disabled={busy}>Atcelt</button>
        </div>
      </form>
    )
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
      <button type="button" className="btn" onClick={() => setMode('accept')}>Apstiprināt piedāvājumu</button>
      <button type="button" className="btn ghost" onClick={() => setMode('reject')}>Noraidīt piedāvājumu</button>
    </div>
  )
}
