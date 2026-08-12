'use client'
import { useState } from 'react'

export default function ComposeForm({ recipientCount }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [result, setResult] = useState(null)

  function requestSend(e) {
    e.preventDefault()
    setErr(null); setResult(null)
    if (!subject.trim() || !message.trim()) { setErr('Norādiet gan tēmu, gan ziņas tekstu.'); return }
    setConfirming(true)
  }

  async function confirmSend() {
    setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/send-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt e-pastus.'); setBusy(false); setConfirming(false); return }
      setResult(data)
      setConfirming(false); setBusy(false)
    } catch {
      setErr('Neizdevās nosūtīt e-pastus.'); setBusy(false); setConfirming(false)
    }
  }

  return (
    <form onSubmit={requestSend} className="card" style={{ maxWidth: 640 }}>
      <label>Tēma</label>
      <input type="text" value={subject} onChange={e => setSubject(e.target.value)} disabled={busy} required />
      <label>Ziņa</label>
      <textarea value={message} onChange={e => setMessage(e.target.value)} disabled={busy} rows={8} required />

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}

      {result && (
        <div className="note" style={{ marginTop: 14 }}>
          Nosūtīts {result.sent} klientiem.{result.failed ? ` Neizdevās nosūtīt ${result.failed}.` : ''}
        </div>
      )}

      {!confirming && (
        <button type="submit" className="btn" style={{ marginTop: 20 }} disabled={busy}>Sūtīt</button>
      )}

      {confirming && (
        <div className="note warn" style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 10 }}>Tiešām nosūtīt uz {recipientCount} klientiem? Šo darbību nevar atsaukt.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn" onClick={confirmSend} disabled={busy}>
              {busy ? 'Sūta…' : 'Apstiprināt'}
            </button>
            <button type="button" className="btn ghost" onClick={() => setConfirming(false)} disabled={busy}>Atcelt</button>
          </div>
        </div>
      )}
    </form>
  )
}
