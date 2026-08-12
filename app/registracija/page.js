'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../account.css'
import { supabaseBrowser } from '../../lib/browserAuth'

export default function Registracija() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const sb = supabaseBrowser()
    const { data, error } = await sb.auth.signUp({ email, password })
    if (error) { setErr(error.message === 'User already registered' ? 'Šis e-pasts jau ir reģistrēts.' : 'Neizdevās reģistrēties. Pārbaudiet datus.'); setBusy(false); return }

    if (!data.session) {
      // Email confirmation required — the customers row is created on first login instead.
      setNeedsConfirm(true); setBusy(false); return
    }

    const { error: custError } = await sb.from('customers').insert({
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      auth_user_id: data.user.id,
    })
    if (custError) { setErr('Konts izveidots, bet neizdevās saglabāt datus. Mēģiniet pieslēgties.'); setBusy(false); return }
    router.push('/panelis'); router.refresh()
  }

  if (needsConfirm) {
    return (
      <div className="acct" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div className="card" style={{ width: '100%', maxWidth: 400, padding: '34px 32px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 10 }}>Pārbaudiet e-pastu</h2>
          <p className="small muted">
            Nosūtījām apstiprinājuma saiti uz {email}. Apstipriniet un tad{' '}
            <Link href="/pieslegties" style={{ color: 'var(--ink)', fontWeight: 600 }}>pieslēdzieties</Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="acct" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <form onSubmit={submit} className="card" style={{ width: '100%', maxWidth: 420, padding: '34px 32px' }}>
        <Link href="/" style={{ display: 'block', textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 23, letterSpacing: '.16em', color: 'var(--ink)' }}>AP KOMFORT</div>
          <div style={{ fontSize: 10.5, letterSpacing: '.28em', color: 'var(--acc)', marginTop: 5 }}>RĪGA · PIERĪGA</div>
        </Link>
        <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 4 }}>Reģistrēties</h2>
        <p className="small muted" style={{ textAlign: 'center', marginBottom: 14 }}>
          Izveidojiet kontu, lai pievienotu savu māju un pieteiktu apkopi.
        </p>
        <label>Vārds, uzvārds</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <label>E-pasts</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
        <label>Telefons</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        <label>Parole</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
          {busy ? 'Reģistrē…' : 'Reģistrēties'}
        </button>
        <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>
          Jau ir konts? <Link href="/pieslegties" style={{ color: 'var(--ink)', fontWeight: 600 }}>Pieslēgties</Link>
        </p>
      </form>
    </div>
  )
}
