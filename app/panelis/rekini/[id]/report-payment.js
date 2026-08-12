'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dt } from '../../../../lib/format'

export default function ReportPayment({ invoice }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [reportedAt, setReportedAt] = useState(invoice.payment_reported_at)
  const [reportedNote, setReportedNote] = useState(invoice.payment_reported_note)
  const router = useRouter()

  if (invoice.status === 'paid') return null
  if (invoice.status !== 'sent') return null

  if (reportedAt) {
    return (
      <div className="note" style={{ marginTop: 16 }}>
        Paziņojāt par apmaksu {dt(reportedAt)} — gaida apstiprinājumu no AP Komforts.
        {reportedNote && <div className="small muted" style={{ marginTop: 4 }}>Jūsu piezīme: {reportedNote}</div>}
      </div>
    )
  }

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setErr(null)
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/report-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās reģistrēt maksājumu.'); setBusy(false); return }
      setReportedAt(new Date().toISOString()); setReportedNote(note.trim())
      setOpen(false); setBusy(false)
      router.refresh()
    } catch {
      setErr('Neizdevās reģistrēt maksājumu.'); setBusy(false)
    }
  }

  if (!open) {
    return (
      <div style={{ marginTop: 16 }}>
        <button type="button" className="btn ghost" onClick={() => setOpen(true)}>Esmu samaksājis</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card" style={{ marginTop: 16, maxWidth: 480 }}>
      <label>Kā samaksājāt? (nav obligāti)</label>
      <textarea value={note} onChange={e => setNote(e.target.value)}
        placeholder="Piemēram, pārskaitījums 12.08., maksājuma atsauce Nr. ..." />
      <p className="small muted" style={{ marginTop: 8 }}>
        Pēc apstiprinājuma no AP Komforts rēķins tiks atzīmēts kā apmaksāts.
      </p>
      {err && <div className="note warn" style={{ marginTop: 10 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="btn" disabled={busy}>{busy ? 'Sūta…' : 'Apstiprināt maksājumu'}</button>
        <button type="button" className="btn ghost" onClick={() => setOpen(false)} disabled={busy}>Atcelt</button>
      </div>
    </form>
  )
}
