'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../lib/browserAuth'

export default function CompleteProfile({ email }) {
  const [accountType, setAccountType] = useState('private') // private | commercial
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [legalAddress, setLegalAddress] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const isCompany = accountType === 'commercial'

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const sb = supabaseBrowser()
    const { data: { user } } = await sb.auth.getUser()
    const { error } = await sb.from('customers').insert({
      full_name: fullName.trim(), phone: phone.trim(), email, auth_user_id: user.id, marketing_consent: marketingConsent,
      customer_type: accountType,
      company_name: isCompany ? companyName.trim() : null,
      registration_number: isCompany ? registrationNumber.trim() || null : null,
      legal_address: isCompany ? legalAddress.trim() || null : null,
      vat_number: isCompany ? vatNumber.trim() || null : null,
    })
    if (error) { setErr('Neizdevās saglabāt. Mēģiniet vēlreiz.'); setBusy(false); return }
    fetch('/api/notify-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: isCompany ? companyName.trim() : fullName.trim(), phone: phone.trim(), email, isCompany }),
    }).catch(() => {})
    router.refresh()
  }

  return (
    <div className="acct" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <form onSubmit={submit} className="card" style={{ width: '100%', maxWidth: 460, padding: '34px 32px' }}>
        <h2 style={{ fontSize: 17, marginBottom: 4 }}>Pabeidziet reģistrāciju</h2>
        <p className="small muted" style={{ marginBottom: 14 }}>E-pasts apstiprināts — vēl vajag dažus datus.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => setAccountType('private')}
            className={accountType === 'private' ? 'btn' : 'btn ghost'} style={{ flex: 1 }}>
            Privātpersona
          </button>
          <button type="button" onClick={() => setAccountType('commercial')}
            className={isCompany ? 'btn' : 'btn ghost'} style={{ flex: 1 }}>
            Uzņēmums
          </button>
        </div>

        {isCompany && (
          <>
            <label>Uzņēmuma nosaukums</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
            <label>Reģistrācijas numurs</label>
            <input type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required />
            <label>Juridiskā adrese</label>
            <input type="text" value={legalAddress} onChange={e => setLegalAddress(e.target.value)} required />
            <label>PVN maksātāja numurs (nav obligāti)</label>
            <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} placeholder="LV00000000000" />
          </>
        )}

        <label>{isCompany ? 'Kontaktpersona' : 'Vārds, uzvārds'}</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <label>Telefons</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, fontWeight: 400 }}>
          <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} style={{ width: 'auto', marginTop: 3 }} />
          <span className="small muted">Vēlos saņemt e-pastā ziņas par AP Komforts akcijām un piedāvājumiem.</span>
        </label>
        {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
        <button className="btn" style={{ width: '100%', marginTop: 18 }} disabled={busy}>
          {busy ? 'Saglabā…' : 'Turpināt'}
        </button>
      </form>
    </div>
  )
}
