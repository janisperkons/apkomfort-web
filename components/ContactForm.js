'use client'
import { useState } from 'react'
import { supabaseBrowser } from '../lib/supabase'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSending(true)
    setError('')
    try {
      const payload = {
        source: 'kontakti',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        address: address.trim() || null,
        message: message.trim() || null,
      }
      const { error: dbError } = await supabaseBrowser().from('enquiries').insert(payload)
      if (dbError) throw dbError
      // Best-effort e-mail to the office — never blocks the enquiry.
      fetch('/api/notify-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
      setSent(true)
    } catch (err) {
      setError('Neizdevās nosūtīt. Lūdzu, piezvaniet +371 26 275 983.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>Paldies, {name.split(' ')[0]}!</h3>
        <p>Ziņu saņēmām. Sazināsimies ar jums drīzumā.</p>
      </div>
    )
  }

  return (
    <form className="lead-form glass-card plain-card" onSubmit={submit}>
      <h3 style={{ marginBottom: 4 }}>Rakstiet mums</h3>
      <p className="fine" style={{ marginBottom: 14 }}>
        Atbildam pēc iespējas ātrāk darba laikā.
      </p>
      <div className="lead-fields">
        <div>
          <label htmlFor="c-name">Vārds</label>
          <input id="c-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-phone">Telefons</label>
          <input id="c-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="lead-fields" style={{ marginTop: 14 }}>
        <div>
          <label htmlFor="c-email">E-pasts (nav obligāts)</label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-address">Adrese (nav obligāta)</label>
          <input id="c-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Iela, pilsēta vai novads" />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <label htmlFor="c-message">Ziņa (nav obligāta)</label>
        <textarea
          id="c-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%',
            marginTop: 6,
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--line)',
            font: 'inherit',
            fontSize: 14.5,
            resize: 'vertical',
          }}
        />
      </div>
      {error && <p className="fine" style={{ color: 'var(--bad)', marginTop: 10 }}>{error}</p>}
      <button type="submit" className="btn-p btn-block" disabled={sending} style={{ marginTop: 16 }}>
        {sending ? 'Sūta…' : 'Nosūtīt'}
      </button>
    </form>
  )
}
