'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { INVOICE_STATUS, dt } from '../../../../lib/format'

const PAYMENT_TERMS_LABEL = {
  full_on_completion: 'Pilna apmaksa pēc darbu pabeigšanas',
  partial_upfront: 'Daļēja apmaksa pirms darbu sākuma',
}

export default function InvoiceActions({ invoice, customerEmail }) {
  const [status, setStatus] = useState(invoice.status)
  const [sentAt, setSentAt] = useState(invoice.sent_at)
  const [paymentTerms, setPaymentTerms] = useState(invoice.payment_terms)
  const [paymentReportedAt, setPaymentReportedAt] = useState(invoice.payment_reported_at)
  const [paymentReportedNote, setPaymentReportedNote] = useState(invoice.payment_reported_note)
  const [showSendForm, setShowSendForm] = useState(false)
  const [chosenTerms, setChosenTerms] = useState(invoice.payment_terms || '')
  const [sending, setSending] = useState(false)
  const [marking, setMarking] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reminding, setReminding] = useState(false)
  const [lastReminderSentAt, setLastReminderSentAt] = useState(invoice.last_reminder_sent_at)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function send(e) {
    e.preventDefault()
    if (!chosenTerms) { setErr('Izvēlieties apmaksas nosacījumus.'); return }
    setSending(true); setErr(null)
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentTerms: chosenTerms }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt rēķinu.'); setSending(false); return }
      setStatus('sent'); setSentAt(data.sentAt || new Date().toISOString())
      setPaymentTerms(chosenTerms); setShowSendForm(false)
      setSending(false); router.refresh()
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

  async function dismissReport() {
    if (!window.confirm('Noraidīt klienta maksājuma ziņojumu? Rēķins paliks kā nosūtīts, un klients varēs ziņot vēlreiz.')) return
    setDismissing(true); setErr(null)
    const { error } = await supabaseBrowser().from('invoices')
      .update({ payment_reported_at: null, payment_reported_note: null }).eq('id', invoice.id)
    setDismissing(false)
    if (error) { setErr('Neizdevās noraidīt ziņojumu.'); return }
    setPaymentReportedAt(null); setPaymentReportedNote(null); router.refresh()
  }

  async function remind() {
    setReminding(true); setErr(null)
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/remind`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt atgādinājumu.'); setReminding(false); return }
      setLastReminderSentAt(data.sentAt || new Date().toISOString())
      setReminding(false)
    } catch {
      setErr('Neizdevās nosūtīt atgādinājumu.'); setReminding(false)
    }
  }

  async function remove() {
    const extra = isPaid
      ? ' Šis rēķins ir atzīmēts kā apmaksāts — dzēšot pazudīs arī šis maksājuma ieraksts no grāmatvedības.'
      : status === 'sent' ? ' Šis rēķins jau nosūtīts klientam.' : ''
    if (!window.confirm(`Tiešām dzēst rēķinu Nr. ${invoice.invoice_number}? Šo darbību nevar atsaukt.${extra}`)) return
    setDeleting(true); setErr(null)
    const { error } = await supabaseBrowser().from('invoices').delete().eq('id', invoice.id)
    setDeleting(false)
    if (error) { setErr('Neizdevās dzēst rēķinu.'); return }
    router.push(`/birojs/klienti/${invoice.customer_id}`)
  }

  const s = INVOICE_STATUS[status] || ['—', 'p-pending']
  const isPaid = status === 'paid'
  const alreadySent = status === 'sent' || status === 'paid'

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost">Lejupielādēt PDF</a>

        {isPaid ? null : customerEmail ? (
          !showSendForm && (
            <button type="button" className="btn" onClick={() => setShowSendForm(true)}>
              {status === 'sent' ? 'Nosūtīt vēlreiz' : 'Nosūtīt klientam'}
            </button>
          )
        ) : (
          <div className="small muted">Klientam nav norādīts e-pasts — nosūtīt nevar.</div>
        )}

        {status === 'sent' && (
          <button type="button" className="btn ghost" onClick={markPaid} disabled={marking}>
            {marking ? 'Saglabā…' : 'Atzīmēt kā apmaksātu'}
          </button>
        )}
        {status === 'sent' && customerEmail && (
          <button type="button" className="btn ghost" onClick={remind} disabled={reminding}>
            {reminding ? 'Sūta…' : 'Sūtīt atgādinājumu'}
          </button>
        )}
        {status === 'draft' && (
          <div className="small muted">Vispirms jānosūta klientam, tad varēs atzīmēt kā apmaksātu.</div>
        )}

        <span className={'pill ' + s[1]}>{s[0]}</span>
        {status === 'sent' && paymentReportedAt && <span className="pill p-pending">Klients ziņoja par apmaksu</span>}
      </div>

      {showSendForm && (
        <form onSubmit={send} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <label>Apmaksas nosacījumi</label>
          <div className="checks">
            <label>
              <input type="radio" name="paymentTerms" checked={chosenTerms === 'full_on_completion'}
                onChange={() => setChosenTerms('full_on_completion')} />
              Pilna apmaksa pēc darbu pabeigšanas
            </label>
            <label>
              <input type="radio" name="paymentTerms" checked={chosenTerms === 'partial_upfront'}
                onChange={() => setChosenTerms('partial_upfront')} />
              Daļēja apmaksa pirms darbu sākuma
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn" disabled={sending}>{sending ? 'Sūta…' : 'Apstiprināt un nosūtīt'}</button>
            <button type="button" className="btn ghost" onClick={() => setShowSendForm(false)} disabled={sending}>Atcelt</button>
          </div>
        </form>
      )}

      {sentAt && (
        <div className="small muted" style={{ marginTop: 10 }}>
          Nosūtīts: {dt(sentAt)}{paymentTerms && ` · ${PAYMENT_TERMS_LABEL[paymentTerms]}`}
          {lastReminderSentAt && ` · Pēdējais atgādinājums: ${dt(lastReminderSentAt)}`}
        </div>
      )}

      {status === 'sent' && paymentReportedAt && (
        <div className="note" style={{ marginTop: 14 }}>
          Klients atzīmēja šo rēķinu kā apmaksātu {dt(paymentReportedAt)}.
          {paymentReportedNote && <div style={{ marginTop: 4 }}>Paskaidrojums: {paymentReportedNote}</div>}
          <div style={{ marginTop: 10 }}>
            Pārbaudiet, vai maksājums tiešām saņemts, tad spiediet <b>Atzīmēt kā apmaksātu</b> augstāk, vai{' '}
            <button type="button" onClick={dismissReport} disabled={dismissing}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bad)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}>
              {dismissing ? 'noraida…' : 'noraidiet ziņojumu'}
            </button>, ja maksājums nav saņemts.
          </div>
        </div>
      )}

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

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
        <button type="button" onClick={remove} disabled={deleting}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bad)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: 13 }}>
          {deleting ? 'Dzēš…' : 'Dzēst rēķinu'}
        </button>
      </div>
    </div>
  )
}
