'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InviteForm() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('bookkeeper')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim(), role }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data.error || 'Neizdevās nosūtīt uzaicinājumu.'); setBusy(false); return }
      setSent(true); setEmail(''); setFullName(''); setBusy(false); router.refresh()
    } catch {
      setErr('Neizdevās nosūtīt uzaicinājumu.'); setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 480 }}>
      <label>Vārds</label>
      <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setSent(false) }} required />
      <label>E-pasts</label>
      <input type="email" value={email} onChange={e => { setEmail(e.target.value); setSent(false) }} required />
      <label>Loma</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="bookkeeper">Grāmatvedis(-e) — redz tikai Grāmatvedību</option>
        <option value="admin">Administrators — pilna piekļuve</option>
      </select>
      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
      {sent && <div className="note" style={{ marginTop: 14, color: 'var(--acc)' }}>✓ Uzaicinājums nosūtīts</div>}
      <button className="btn" style={{ marginTop: 18 }} disabled={busy}>{busy ? 'Sūta…' : 'Nosūtīt uzaicinājumu'}</button>
    </form>
  )
}
