'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { DISTRIBUTION } from '../../../../lib/format'

const MUNICIPALITIES = ['Rīga', 'Mārupe', 'Ādaži', 'Ķekava', 'Ropaži', 'Salaspils', 'Jūrmala', 'Olaine', 'Babīte', 'Cits']
const PROPERTY_TYPES = ['Privātmāja', 'Dzīvoklis', 'Rindu māja', 'Cits']

export default function PropertyEditForm({ property: p }) {
  const [editing, setEditing] = useState(false)
  const [addressLine, setAddressLine] = useState(p.address_line || '')
  const [municipality, setMunicipality] = useState(p.municipality || MUNICIPALITIES[0])
  const [postcode, setPostcode] = useState(p.postcode || '')
  const [propertyType, setPropertyType] = useState(p.property_type || PROPERTY_TYPES[0])
  const [floorArea, setFloorArea] = useState(p.floor_area_m2 || '')
  const [bedrooms, setBedrooms] = useState(p.bedrooms || '')
  const [builtYear, setBuiltYear] = useState(p.built_year || '')
  const [distribution, setDistribution] = useState(p.heating_distribution || [])
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  function toggleDist(key) {
    setDistribution(d => d.includes(key) ? d.filter(x => x !== key) : [...d, key])
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('properties').update({
      address_line: addressLine.trim(),
      municipality,
      postcode: postcode.trim() || null,
      property_type: propertyType,
      floor_area_m2: floorArea ? Number(floorArea) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      built_year: builtYear ? Number(builtYear) : null,
      heating_distribution: distribution.length ? distribution : null,
    }).eq('id', p.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setEditing(false); router.refresh()
  }

  if (!editing) {
    return <button className="btn ghost" onClick={() => setEditing(true)}>Rediģēt īpašuma datus</button>
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 560, marginTop: 14 }}>
      <label>Adrese</label>
      <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)} required />
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Novads / pilsēta</label>
          <select value={municipality} onChange={e => setMunicipality(e.target.value)}>
            {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label>Pasta indekss</label>
          <input type="text" value={postcode} onChange={e => setPostcode(e.target.value)} />
        </div>
      </div>
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Īpašuma veids</label>
          <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label>Celšanas gads</label>
          <input type="number" min="1800" max="2100" value={builtYear} onChange={e => setBuiltYear(e.target.value)} />
        </div>
      </div>
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label>Platība (m²)</label>
          <input type="number" min="0" value={floorArea} onChange={e => setFloorArea(e.target.value)} />
        </div>
        <div>
          <label>Guļamistabas</label>
          <input type="number" min="0" value={bedrooms} onChange={e => setBedrooms(e.target.value)} />
        </div>
      </div>
      <label>Apkures sadale mājā</label>
      <div className="checks">
        {Object.entries(DISTRIBUTION).map(([key, label]) => (
          <label key={key}>
            <input type="checkbox" checked={distribution.includes(key)} onChange={() => toggleDist(key)} />
            {label}
          </label>
        ))}
      </div>
      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={() => setEditing(false)}>Atcelt</button>
      </div>
    </form>
  )
}
