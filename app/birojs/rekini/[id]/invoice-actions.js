'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { INVOICE_STATUS, dt } from '../../../../lib/format'

export default function InvoiceActions({ invoice, customerEmail }) {
  const [status, setStatus] = useState(invoice.status)
  const [sentAt, setSentAt] = useState(invoice.sent_at)
  const [sending, setSending] = useState(false)
  const [marking, setMarking] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function send() {
    const confirmText = status === 'sent'
      ? 'Nosūtīt šo rēķinu klientam vēlreiz pa e-pastu?'
      : 'Tiešām nosūtīt šo rēķinu klientam pa e-pastu?'
    if (!window.confirm(confirmText)) return
    setSending(true); setErr(null)
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt rēķinu.'); setSending(false); return }
      setStatus('sent'); setSentAt(data.sentAt || new Date().toISOString())
      setSending(false)
    } catch {
      setErr('Neizdevās nosūtīt rēķinu.'); setSending(false)
    }
  }

  async function markPaid() {
    setMarking(true); setErr(null)
    const { error } = await supabaseBrowser().from('invoices').update({ status: 'paid' }).eq('id', invoice.id)
    setMarking(false)
    if (error) { setErr('Neizdevās atzīmēt rēķinu kā apmaksātu.'); return }
    setStatus('paid'); router.refresh()
  }

  const s = INVOICE_STATUS[status] || ['—', 'p-pending']
  const isPaid = status === 'paid'
  const alreadySent = status === 'sent' || status === 'paid'

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>

        {isPaid ? null : customerEmail ? (
          <button type="button" className="btn" onClick={send} disabled={sending}>
            {sending ? 'Sūta…' : status === 'sent' ? 'Nosūtīt vēlreiz' : 'Nosūtīt klientam'}
          </button>
        ) : (
          <div className="small muted">Klientam nav norādīts e-pasts — nosūtīt nevar.</div>
        )}

        {status === 'sent' && (
          <button type="button" className="btn ghost" onClick={markPaid} disabled={marking}>
            {marking ? 'Saglabā…' : 'Atzīmēt kā apmaksātu'}
          </button>
        )}
        {status === 'draft' && (
          <div className="small muted">Vispirms jānosūta klientam, tad varēs atzīmēt kā apmaksātu.</div>
        )}

        <span className={'pill ' + s[1]}>{s[0]}</span>
      </div>

      {sentAt && <div className="small muted" style={{ marginTop: 10 }}>Nosūtīts: {dt(sentAt)}</div>}

      {alreadySent && (
        <div className="note" style={{ marginTop: 14 }}>
          {isPaid
            ? 'Šis rēķins ir apmaksāts un vairs nav maināms.'
            : 'Šis rēķins jau nosūtīts klientam — rindas un summa vairs nav maināmas.'}
          {' '}Ja nepieciešama korekcija, izveidojiet jaunu rēķinu klienta{' '}
          <Link href={`/birojs/klienti/${invoice.customer_id}/rekini/jauns`}>kontā</Link>.
        </div>
      )}

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
    </div>
  )
}
