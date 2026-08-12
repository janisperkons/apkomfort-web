'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

const CUSTOMER_TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

export default function EditCustomer({ customer: c }) {
  const [editing, setEditing] = useState(false)
  const [customerType, setCustomerType] = useState(c.customer_type || 'private')
  const [fullName, setFullName] = useState(c.full_name || '')
  const [companyName, setCompanyName] = useState(c.company_name || '')
  const [registrationNumber, setRegistrationNumber] = useState(c.registration_number || '')
  const [legalAddress, setLegalAddress] = useState(c.legal_address || '')
  const [vatNumber, setVatNumber] = useState(c.vat_number || '')
  const [phone, setPhone] = useState(c.phone || '')
  const [email, setEmail] = useState(c.email || '')
  const [notes, setNotes] = useState(c.notes || '')
  const [marketingConsent, setMarketingConsent] = useState(c.marketing_consent || false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  const isCompany = customerType === 'commercial'

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('customers').update({
      full_name: fullName.trim(), phone: phone.trim() || null, email: email.trim() || null, notes: notes.trim() || null,
      marketing_consent: marketingConsent,
      customer_type: customerType,
      company_name: isCompany ? companyName.trim() || null : null,
      registration_number: isCompany ? registrationNumber.trim() || null : null,
      legal_address: isCompany ? legalAddress.trim() || null : null,
      vat_number: isCompany ? vatNumber.trim() || null : null,
    }).eq('id', c.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setEditing(false); router.refresh()
  }

  if (!editing) return <button className="btn ghost" style={{marginTop:12,fontSize:12.5,padding:'7px 12px'}} onClick={()=>setEditing(true)}>Rediģēt</button>

  return (
    <form onSubmit={submit} style={{marginTop:12}}>
      <label>Veids</label>
      <select value={customerType} onChange={e=>setCustomerType(e.target.value)}>
        {Object.entries(CUSTOMER_TYPE).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      {isCompany && (
        <>
          <label>Uzņēmuma nosaukums</label>
          <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
          <label>Reģistrācijas numurs</label>
          <input type="text" value={registrationNumber} onChange={e=>setRegistrationNumber(e.target.value)} />
          <label>Juridiskā adrese</label>
          <input type="text" value={legalAddress} onChange={e=>setLegalAddress(e.target.value)} />
          <label>PVN maksātāja numurs</label>
          <input type="text" value={vatNumber} onChange={e=>setVatNumber(e.target.value)} placeholder="LV00000000000" />
        </>
      )}
      <label>{isCompany ? 'Kontaktpersona' : 'Vārds'}</label>
      <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required />
      <label>Telefons</label>
      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} />
      <label>E-pasts</label>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <label>Piezīmes</label>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} />
      <label style={{display:'flex',alignItems:'flex-start',gap:8,marginTop:10,fontWeight:400}}>
        <input type="checkbox" checked={marketingConsent} onChange={e=>setMarketingConsent(e.target.checked)} style={{width:'auto',marginTop:3}} />
        <span className="small">Piekrīt mārketinga e-pastiem</span>
      </label>
      {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
      <div style={{display:'flex',gap:10,marginTop:12}}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={()=>setEditing(false)}>Atcelt</button>
      </div>
    </form>
  )
}
