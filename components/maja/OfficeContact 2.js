'use client'
import { useEffect, useRef, useState } from 'react'
import { supabaseBrowser } from '../../lib/supabase'
import { SERVICES, FORM_SERVICES, PHONE_DISPLAY, PHONE_HREF } from './content'

// The office — the house's contact experience. The camera settles on the lit
// corner office (a zoom into that region of the master photograph; the
// generated interior A14 replaces the backdrop later without structural
// change) and the enquiry surface appears beside the desk. Submissions land
// in the same `enquiries` pipeline the rest of the site already uses, so
// they show up in Birojs → Jauni pieteikumi like every other lead.

export default function OfficeContact({ presetService, onClose }) {
  const ref = useRef(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState(presetService || '')
  const [about, setAbout] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const el = ref.current
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out', fill: 'forwards' })
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSending(true)
    setError('')
    try {
      const messageParts = []
      if (service) messageParts.push(`Pakalpojums: ${service}`)
      if (about.trim()) messageParts.push(about.trim())
      const { error: dbError } = await supabaseBrowser().from('enquiries').insert({
        source: 'maja',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        message: messageParts.join(' — ') || null,
      })
      if (dbError) throw dbError
      setSent(true)
    } catch {
      setError(`Neizdevās nosūtīt. Lūdzu, piezvaniet ${PHONE_DISPLAY}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mj-panelwrap" ref={ref} role="dialog" aria-modal="true" aria-label="Sazināties ar mums">
      <div className="mj-panel-bg">
        <img src={SERVICES.birojs.interior} alt="" aria-hidden="true" className="room" />
      </div>
      <button type="button" className="mj-close" onClick={onClose} aria-label="Aizvērt">×</button>
      <div className="mj-panel">
        <span className="mj-eyebrow">Birojs</span>
        <h2 className="mj-serif">Sazināties ar mums</h2>

        {sent ? (
          <div>
            <p className="lead mj-serif">Paldies, {name.split(' ')[0]}!</p>
            <p className="ok-note">
              Pieprasījumu saņēmām un sazināsimies ar jums tuvākajā darba laikā.
              Ja jautājums steidzams — <a href={PHONE_HREF} style={{ color: 'var(--mj-gold)' }}>{PHONE_DISPLAY}</a>.
            </p>
            <button type="button" className="mj-back" onClick={onClose}>← Atpakaļ uz māju</button>
          </div>
        ) : (
          <form className="mj-form" onSubmit={submit}>
            <p className="lead mj-serif">{SERVICES.birojs.lead}</p>

            <label htmlFor="mj-name">Vārds</label>
            <input id="mj-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />

            <label htmlFor="mj-phone">Tālrunis</label>
            <input id="mj-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />

            <label htmlFor="mj-email">E-pasts (nav obligāts)</label>
            <input id="mj-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

            <label htmlFor="mj-service">Pakalpojums</label>
            <select id="mj-service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Izvēlieties…</option>
              {FORM_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <label htmlFor="mj-about">Īss projekta apraksts</label>
            <textarea id="mj-about" value={about} onChange={(e) => setAbout(e.target.value)} />

            {error && <p className="err">{error}</p>}

            <div className="mj-panel-actions" style={{ marginTop: 22 }}>
              <button type="submit" className="mj-btn" disabled={sending}>
                {sending ? 'Sūta…' : 'Nosūtīt pieprasījumu'}
              </button>
              <a className="mj-btn ghost" href={PHONE_HREF}>Zvanīt {PHONE_DISPLAY}</a>
            </div>
            <button type="button" className="mj-back" onClick={onClose}>← Atpakaļ uz māju</button>
          </form>
        )}
      </div>
    </div>
  )
}
