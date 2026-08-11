'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { DISTRIBUTION } from '../../../../lib/format'

const MUNICIPALITIES = ['Rīga', 'Mārupe', 'Ādaži', 'Ķekava', 'Ropaži', 'Salaspils', 'Jūrmala', 'Olaine', 'Babīte', 'Cits']
const PROPERTY_TYPES = ['Privātmāja', 'Dzīvoklis', 'Rindu māja', 'Cits']
const CUSTOMER_TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

export default function JaunsKlients() {
  const [fullName, setFullName] = useState('')
  const [customerType, setCustomerType] = useState('private')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [addressLine, setAddressLine] = useState('')
  const [municipality, setMunicipality] = useState(MUNICIPALITIES[0])
  const [postcode, setPostcode] = useState('')
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0])
  const [floorArea, setFloorArea] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [builtYear, setBuiltYear] = useState('')
  const [distribution, setDistribution] = useState([])
  const [accessNotes, setAccessNotes] = useState('')

  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('name')) setFullName(params.get('name'))
    if (params.get('phone')) setPhone(params.get('phone'))
  }, [])

  function toggleDist(key) {
    setDistribution(d => d.includes(key) ? d.filter(x => x !== key) : [...d, key])
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const sb = supabaseBrowser()
    const { data: customer, error: custError } = await sb.from('customers').insert({
      full_name: fullName.trim(), customer_type: customerType,
      phone: phone.trim() || null, email: email.trim() || null, notes: notes.trim() || null,
    }).select('id').single()
    if (custError) { setErr('Neizdevās izveidot klientu. Pārbaudiet datus.'); setBusy(false); return }

    const { data: property, error: propError } = await sb.from('properties').insert({
      customer_id: customer.id,
      address_line: addressLine.trim(), municipality, postcode: postcode.trim() || null,
      property_type: propertyType, floor_area_m2: floorArea ? Number(floorArea) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null, built_year: builtYear ? Number(builtYear) : null,
      heating_distribution: distribution.length ? distribution : null,
      access_notes: accessNotes.trim() || null,
    }).select('id').single()
    if (propError) { setErr('Klients izveidots, bet neizdevās saglabāt īpašumu.'); setBusy(false); return }

    router.push(`/birojs/ipasumi/${property.id}`)
  }

  return (
    <>
      <div className="head"><div><h1>Jauns klients</h1><div className="sub">Klienta un īpašuma dati vienā solī</div></div></div>
      <form onSubmit={submit} className="card" style={{maxWidth:640}}>
        <h3 style={{marginBottom:10}}>Klients</h3>
        <label>Vārds, uzvārds</label>
        <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required />
        <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label>Veids</label>
            <select value={customerType} onChange={e=>setCustomerType(e.target.value)}>
              {Object.entries(CUSTOMER_TYPE).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
            </select></div>
          <div><label>Telefons</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
        </div>
        <label>E-pasts</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Piezīmes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} />

        <h3 style={{margin:'22px 0 10px'}}>Īpašums</h3>
        <label>Adrese</label>
        <input type="text" value={addressLine} onChange={e=>setAddressLine(e.target.value)} required />
        <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label>Novads / pilsēta</label>
            <select value={municipality} onChange={e=>setMunicipality(e.target.value)}>
              {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
            </select></div>
          <div><label>Pasta indekss</label><input type="text" value={postcode} onChange={e=>setPostcode(e.target.value)} /></div>
        </div>
        <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label>Īpašuma veids</label>
            <select value={propertyType} onChange={e=>setPropertyType(e.target.value)}>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label>Celšanas gads</label><input type="number" min="1800" max="2100" value={builtYear} onChange={e=>setBuiltYear(e.target.value)} /></div>
        </div>
        <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label>Platība (m²)</label><input type="number" min="0" value={floorArea} onChange={e=>setFloorArea(e.target.value)} /></div>
          <div><label>Guļamistabas</label><input type="number" min="0" value={bedrooms} onChange={e=>setBedrooms(e.target.value)} /></div>
        </div>
        <label>Apkures sadale</label>
        <div className="checks">
          {Object.entries(DISTRIBUTION).map(([key,label]) => (
            <label key={key}><input type="checkbox" checked={distribution.includes(key)} onChange={()=>toggleDist(key)} />{label}</label>
          ))}
        </div>
        <label>Piekļuves piezīmes</label>
        <textarea value={accessNotes} onChange={e=>setAccessNotes(e.target.value)} />

        {err && <div className="note warn" style={{marginTop:14}}>{err}</div>}
        <button className="btn" style={{marginTop:20}} disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt klientu'}</button>
      </form>
    </>
  )
}
