'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { KIND } from '../../../../lib/format'

export default function AddEquipmentForm({ propertyId }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState(Object.keys(KIND)[0])
  const [manufacturer, setManufacturer] = useState('')
  const [model, setModel] = useState('')
  const [installedYear, setInstalledYear] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('equipment').insert({
      property_id: propertyId,
      kind,
      manufacturer: manufacturer.trim() || null,
      model: model.trim() || null,
      installed_year: installedYear ? Number(installedYear) : null,
    })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setManufacturer(''); setModel(''); setInstalledYear(''); setBusy(false); setOpen(false)
    router.refresh()
  }

  if (!open) return <button className="btn ghost" onClick={() => setOpen(true)}>+ Pievienot iekārtu</button>

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 480 }}>
      <h3 style={{ marginBottom: 8 }}>Jauna iekārta</h3>
      <label>Veids</label>
      <select value={kind} onChange={e => setKind(e.target.value)}>
        {Object.entries(KIND).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <p className="small muted" style={{ marginTop: -4, marginBottom: 10 }}>
        Ražotājs un modelis palīdz mums iepriekš sagatavot pareizos servisa komplektus jūsu vizītei.
      </p>
      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div><label>Ražotājs</label><input type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} required /></div>
        <div><label>Modelis</label><input type="text" value={model} onChange={e => setModel(e.target.value)} required /></div>
      </div>
      <label>Uzstādīšanas gads</label>
      <input type="number" min="1950" max="2100" value={installedYear} onChange={e => setInstalledYear(e.target.value)} />
      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt iekārtu'}</button>
        <button type="button" className="btn ghost" onClick={() => setOpen(false)}>Atcelt</button>
      </div>
    </form>
  )
}
