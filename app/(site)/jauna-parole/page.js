'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../../account.css'
import { supabaseBrowser } from '../../../lib/browserAuth'

export default function JaunaParole() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setErr(null)
    if (password.length < 6) { setErr('Parolei jābūt vismaz 6 rakstzīmes garai.'); return }
    if (password !== confirm) { setErr('Paroles nesakrīt.'); return }
    setBusy(true)
    const { error } = await supabaseBrowser().auth.updateUser({ password })
    if (error) { setErr('Neizdevās nomainīt paroli. Saite var būt novecojusi — pieprasiet jaunu.'); setBusy(false); return }
    setDone(true); setBusy(false)
    setTimeout(() => { router.push('/pieslegties') }, 2000)
  }

  return (
    <section className="block tight acct" style={{ minHeight: 'auto' }}>
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 400, padding: '34px 32px' }}>
          {done ? (
            <>
              <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 10 }}>Parole nomainīta</h2>
              <p className="small muted" style={{ textAlign: 'center' }}>Novirzām uz pieslēgšanos…</p>
            </>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ fontSize: 17, textAlign: 'center', marginBottom: 4 }}>Iestatiet jaunu paroli</h2>
              <label>Jaunā parole</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
              <label>Apstipriniet paroli</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} autoComplete="new-password" />
              {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
              <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
                {busy ? 'Saglabā…' : 'Saglabāt jauno paroli'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
