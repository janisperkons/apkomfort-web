'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../../account.css'
import { supabaseBrowser } from '../../../lib/browserAuth'

export default function Pieslegties() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password })
    if (error) { setErr('Nepareizs e-pasts vai parole.'); setBusy(false); return }
    router.push('/panelis'); router.refresh()
  }

  return (
    <section className="block tight acct" style={{ minHeight: 'auto' }}>
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <form onSubmit={submit} className="card" style={{ width: '100%', maxWidth: 400, padding: '34px 32px' }}>
          <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 4 }}>Pieslēgties</h2>
          <p className="small muted" style={{ textAlign: 'center', marginBottom: 14 }}>
            Klientiem un AP Komforts darbiniekiem — viens pieslēgšanās logs.
          </p>
          <label>E-pasts</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
          <label>Parole</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          <p className="small muted" style={{ textAlign: 'right', marginTop: 6 }}>
            <Link href="/atjaunot-paroli" style={{ color: 'var(--ink)' }}>Aizmirsāt paroli?</Link>
          </p>
          {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
          <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
            {busy ? 'Pieslēdzas…' : 'Pieslēgties'}
          </button>
          <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>
            Vēl nav konta? <Link href="/registracija" style={{ color: 'var(--ink)', fontWeight: 600 }}>Reģistrēties</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
