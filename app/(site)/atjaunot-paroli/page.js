'use client'
import { useState } from 'react'
import Link from 'next/link'
import '../../account.css'
import { supabaseBrowser } from '../../../lib/browserAuth'

export default function AtjaunotParoli() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/jauna-parole`,
    })
    if (error) { setErr('Neizdevās nosūtīt saiti. Mēģiniet vēlreiz.'); setBusy(false); return }
    setSent(true); setBusy(false)
  }

  return (
    <section className="block tight acct" style={{ minHeight: 'auto' }}>
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 400, padding: '34px 32px' }}>
          {sent ? (
            <>
              <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 10 }}>Pārbaudiet e-pastu</h2>
              <p className="small muted" style={{ textAlign: 'center' }}>
                Ja {email} ir reģistrēts kontam, nosūtījām saiti paroles maiņai.
              </p>
            </>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 4 }}>Atjaunot paroli</h2>
              <p className="small muted" style={{ textAlign: 'center', marginBottom: 14 }}>
                Ievadiet konta e-pastu — nosūtīsim saiti jaunas paroles iestatīšanai.
              </p>
              <label>E-pasts</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
              {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
              <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
                {busy ? 'Sūta…' : 'Nosūtīt saiti'}
              </button>
            </form>
          )}
          <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>
            <Link href="/pieslegties/" style={{ color: 'var(--ink)', fontWeight: 600 }}>← Atpakaļ uz pieslēgšanos</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
