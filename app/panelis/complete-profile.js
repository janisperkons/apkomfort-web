'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../lib/browserAuth'

export default function CompleteProfile({ email }) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const sb = supabaseBrowser()
    const { data: { user } } = await sb.auth.getUser()
    const { error } = await sb.from('customers').insert({
      full_name: fullName.trim(), phone: phone.trim(), email, auth_user_id: user.id,
    })
    if (error) { setErr('Neizdevās saglabāt. Mēģiniet vēlreiz.'); setBusy(false); return }
    router.refresh()
  }

  return (
    <div className="acct" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <form onSubmit={submit} className="card" style={{ width: '100%', maxWidth: 420, padding: '34px 32px' }}>
        <h2 style={{ fontSize: 17, marginBottom: 4 }}>Pabeidziet reģistrāciju</h2>
        <p className="small muted" style={{ marginBottom: 14 }}>E-pasts apstiprināts — vēl vajag jūsu vārdu un telefonu.</p>
        <label>Vārds, uzvārds</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <label>Telefons</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
          {busy ? 'Saglabā…' : 'Turpināt'}
        </button>
      </form>
    </div>
  )
}
