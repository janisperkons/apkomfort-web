'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'

export default function SettingsForm({ profile, email }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileErr, setProfileErr] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const router = useRouter()

  async function uploadAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true); setProfileErr(null)
    const sb = supabaseBrowser()
    const path = `${profile.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file)
    if (upErr) { setProfileErr('Neizdevās augšupielādēt attēlu.'); setAvatarUploading(false); return }
    const { data: pub } = sb.storage.from('avatars').getPublicUrl(path)
    const { error: saveErr } = await sb.from('profiles').update({ avatar_url: pub.publicUrl }).eq('id', profile.id)
    setAvatarUploading(false)
    if (saveErr) { setProfileErr('Attēls augšupielādēts, bet neizdevās saglabāt.'); return }
    setAvatarUrl(pub.publicUrl); router.refresh()
  }

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwErr, setPwErr] = useState(null)
  const [pwSaved, setPwSaved] = useState(false)

  async function saveProfile(e) {
    e.preventDefault(); setProfileBusy(true); setProfileErr(null); setProfileSaved(false)
    const { error } = await supabaseBrowser().from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim() || null }).eq('id', profile.id)
    setProfileBusy(false)
    if (error) { setProfileErr('Neizdevās saglabāt.'); return }
    setProfileSaved(true); router.refresh()
  }

  async function savePassword(e) {
    e.preventDefault(); setPwErr(null)
    if (password.length < 6) { setPwErr('Parolei jābūt vismaz 6 rakstzīmes garai.'); return }
    if (password !== confirm) { setPwErr('Paroles nesakrīt.'); return }
    setPwBusy(true)
    const { error } = await supabaseBrowser().auth.updateUser({ password })
    setPwBusy(false)
    if (error) { setPwErr('Neizdevās nomainīt paroli.'); return }
    setPassword(''); setConfirm(''); setPwSaved(true)
  }

  return (
    <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
      <form onSubmit={saveProfile} className="card">
        <h3 style={{ marginBottom: 12 }}>Konta dati</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--cream)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', fontSize: 20, color: 'var(--ink)' }}>
              {fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <label style={{ marginBottom: 4 }}>Attēls (redzams klientiem, kad piešķirts vizītei)</label>
            <input type="file" accept="image/*" onChange={uploadAvatar} disabled={avatarUploading} />
            {avatarUploading && <div className="small muted" style={{ marginTop: 4 }}>Augšupielādē…</div>}
          </div>
        </div>

        <label>E-pasts</label>
        <input type="email" value={email} disabled />
        <label>Vārds</label>
        <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setProfileSaved(false) }} required />
        <label>Telefons</label>
        <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setProfileSaved(false) }} />
        {profileErr && <div className="note warn" style={{ marginTop: 14 }}>{profileErr}</div>}
        {profileSaved && <div className="note" style={{ marginTop: 14, color: 'var(--acc)' }}>✓ Saglabāts</div>}
        <button className="btn" style={{ marginTop: 18 }} disabled={profileBusy}>{profileBusy ? 'Saglabā…' : 'Saglabāt'}</button>
      </form>

      <form onSubmit={savePassword} className="card">
        <h3 style={{ marginBottom: 12 }}>Nomainīt paroli</h3>
        <label>Jaunā parole</label>
        <input type="password" value={password} onChange={e => { setPassword(e.target.value); setPwSaved(false) }} minLength={6} autoComplete="new-password" />
        <label>Apstipriniet paroli</label>
        <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setPwSaved(false) }} minLength={6} autoComplete="new-password" />
        {pwErr && <div className="note warn" style={{ marginTop: 14 }}>{pwErr}</div>}
        {pwSaved && <div className="note" style={{ marginTop: 14, color: 'var(--acc)' }}>✓ Parole nomainīta</div>}
        <button className="btn" style={{ marginTop: 18 }} disabled={pwBusy}>{pwBusy ? 'Saglabā…' : 'Nomainīt paroli'}</button>
      </form>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: 8 }}>Komanda</h3>
        <p className="small muted">
          Vēl viena inženiera konta pievienošana back office ir izstrādes plānā — pagaidām
          konts ir viens administratora pieslēgums.
        </p>
      </div>
    </div>
  )
}
