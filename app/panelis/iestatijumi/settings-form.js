'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'

export default function SettingsForm({ customer, email }) {
  const isCompany = customer?.customer_type === 'commercial'
  const [fullName, setFullName] = useState(customer?.full_name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [companyName, setCompanyName] = useState(customer?.company_name || '')
  const [registrationNumber, setRegistrationNumber] = useState(customer?.registration_number || '')
  const [legalAddress, setLegalAddress] = useState(customer?.legal_address || '')
  const [vatNumber, setVatNumber] = useState(customer?.vat_number || '')
  const [marketingConsent, setMarketingConsent] = useState(customer?.marketing_consent || false)
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileErr, setProfileErr] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwErr, setPwErr] = useState(null)
  const [pwSaved, setPwSaved] = useState(false)

  async function saveProfile(e) {
    e.preventDefault(); setProfileBusy(true); setProfileErr(null); setProfileSaved(false)
    const { error } = await supabaseBrowser().from('customers').update({
      full_name: fullName.trim(),
      phone: phone.trim(),
      marketing_consent: marketingConsent,
      company_name: isCompany ? companyName.trim() || null : null,
      registration_number: isCompany ? registrationNumber.trim() || null : null,
      legal_address: isCompany ? legalAddress.trim() || null : null,
      vat_number: isCompany ? vatNumber.trim() || null : null,
    }).eq('id', customer.id)
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
        <label>E-pasts</label>
        <input type="email" value={email} disabled />

        {isCompany && (
          <>
            <label>Uzņēmuma nosaukums</label>
            <input type="text" value={companyName} onChange={e => { setCompanyName(e.target.value); setProfileSaved(false) }} required />
            <label>Reģistrācijas numurs</label>
            <input type="text" value={registrationNumber} onChange={e => { setRegistrationNumber(e.target.value); setProfileSaved(false) }} required />
            <label>Juridiskā adrese</label>
            <input type="text" value={legalAddress} onChange={e => { setLegalAddress(e.target.value); setProfileSaved(false) }} required />
            <label>PVN maksātāja numurs (nav obligāti)</label>
            <input type="text" value={vatNumber} onChange={e => { setVatNumber(e.target.value); setProfileSaved(false) }} placeholder="LV00000000000" />
          </>
        )}

        <label>{isCompany ? 'Kontaktpersona' : 'Vārds, uzvārds'}</label>
        <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setProfileSaved(false) }} required />
        <label>Telefons</label>
        <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setProfileSaved(false) }} required />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, fontWeight: 400 }}>
          <input type="checkbox" checked={marketingConsent} onChange={e => { setMarketingConsent(e.target.checked); setProfileSaved(false) }} style={{ width: 'auto', marginTop: 3 }} />
          <span className="small muted">Vēlos saņemt e-pastā ziņas par AP Komforts akcijām un piedāvājumiem.</span>
        </label>
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
    </div>
  )
}
