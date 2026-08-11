'use client'
import { useState } from 'react'
import { supabaseBrowser } from '../lib/supabase'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
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
      const { error: dbError } = await supabaseBrowser()
        .from('enquiries')
        .insert({
          source: 'kontakti',
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
        })
      if (dbError) throw dbError
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
