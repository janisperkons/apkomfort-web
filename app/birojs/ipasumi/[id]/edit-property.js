'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

const DISTRIBUTION = { radiators:'Radiatori', forced_air:'Gaisa apkure', underfloor:'Grīdas apkure', other:'Cits' }

export default function EditProperty({ property: p, engineers }) {
  const [editing, setEditing] = useState(false)
  const [addressLine, setAddressLine] = useState(p.address_line || '')
  const [municipality, setMunicipality] = useState(p.municipality || '')
  const [postcode, setPostcode] = useState(p.postcode || '')
  const [propertyType, setPropertyType] = useState(p.property_type || '')
  const [floorArea, setFloorArea] = useState(p.floor_area_m2 || '')
  const [bedrooms, setBedrooms] = useState(p.bedrooms || '')
  const [builtYear, setBuiltYear] = useState(p.built_year || '')
  const [accessNotes, setAccessNotes] = useState(p.access_notes || '')
  const [distribution, setDistribution] = useState(p.heating_distribution || [])
  const [assignedEngineer, setAssignedEngineer] = useState(p.assigned_engineer || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  function toggleDist(key) {
    setDistribution(d => d.includes(key) ? d.filter(x=>x!==key) : [...d, key])
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('properties').update({
      address_line: addressLine.trim(), municipality: municipality.trim(), postcode: postcode.trim() || null,
      property_type: propertyType.trim() || null,
      floor_area_m2: floorArea ? Number(floorArea) : null, bedrooms: bedrooms ? Number(bedrooms) : null,
      built_year: builtYear ? Number(builtYear) : null, access_notes: accessNotes.trim() || null,
      heating_distribution: distribution.length ? distribution : null,
      assigned_engineer: assignedEngineer || null,
    }).eq('id', p.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setEditing(false); router.refresh()
  }

  if (!editing) return <button className="btn ghost" onClick={()=>setEditing(true)}>Rediģēt īpašuma datus</button>

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:640,marginBottom:16}}>
      <label>Adrese</label>
      <input type="text" value={addressLine} onChange={e=>setAddressLine(e.target.value)} required />
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div><label>Novads / pilsēta</label><input type="text" value={municipality} onChange={e=>setMunicipality(e.target.value)} required /></div>
        <div><label>Pasta indekss</label><input type="text" value={postcode} onChange={e=>setPostcode(e.target.value)} /></div>
      </div>
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div><label>Īpašuma veids</label><input type="text" value={propertyType} onChange={e=>setPropertyType(e.target.value)} /></div>
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
      <label>Speciālists</label>
      <select value={assignedEngineer} onChange={e=>setAssignedEngineer(e.target.value)}>
        <option value="">— Nav norādīts —</option>
        {(engineers||[]).map(en => <option key={en.id} value={en.id}>{en.full_name}</option>)}
      </select>
      {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
      <div style={{display:'flex',gap:10,marginTop:14}}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={()=>setEditing(false)}>Atcelt</button>
      </div>
    </form>
  )
}
