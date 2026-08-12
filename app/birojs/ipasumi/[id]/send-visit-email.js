'use client'
import { useState } from 'react'

export default function SendVisitEmail({ job, customerEmail }) {
  const [state, setState] = useState('idle') // idle | busy | sent | error
  const [err, setErr] = useState(null)

  if (!customerEmail) {
    return <div className="small muted" style={{ marginTop: 8 }}>Klientam nav norādīts e-pasts.</div>
  }

  async function send() {
    setState('busy'); setErr(null)
    try {
      const res = await fetch('/api/send-visit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt e-pastu.'); setState('error'); return }
      setState('sent')
    } catch {
      setErr('Neizdevās nosūtīt e-pastu.'); setState('error')
    }
  }

  if (state === 'sent') {
    return <div className="small" style={{ marginTop: 8, color: 'var(--acc)' }}>Nosūtīts!</div>
  }

  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" className="btn ghost" style={{ fontSize: 12.5, padding: '7px 12px' }}
        disabled={state === 'busy'} onClick={send}>
        {state === 'busy' ? 'Sūta…' : 'Nosūtīt apstiprinājumu klientam'}
      </button>
      {state === 'error' && <div className="note warn small" style={{ marginTop: 8 }}>{err}</div>}
    </div>
  )
}
