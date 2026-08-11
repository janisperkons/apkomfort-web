'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { KIND, COND } from '../../../../lib/format'

export default function EditEquipment({ equipment: e }) {
  const [editing, setEditing] = useState(false)
  const [kind, setKind] = useState(e.kind)
  const [manufacturer, setManufacturer] = useState(e.manufacturer || '')
  const [model, setModel] = useState(e.model || '')
  const [serialNumber, setSerialNumber] = useState(e.serial_number || '')
  const [installedYear, setInstalledYear] = useState(e.installed_year || '')
  const [outputKw, setOutputKw] = useState(e.output_kw || '')
  const [condition, setCondition] = useState(e.condition || '')
  const [lastServiced, setLastServiced] = useState(e.last_serviced || '')
  const [notes, setNotes] = useState(e.notes || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function submit(ev) {
    ev.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('equipment').update({
      kind, manufacturer: manufacturer.trim() || null, model: model.trim() || null,
      serial_number: serialNumber.trim() || null, installed_year: installedYear ? Number(installedYear) : null,
      output_kw: outputKw ? Number(outputKw) : null, condition: condition || null,
      last_serviced: lastServiced || null, notes: notes.trim() || null,
    }).eq('id', e.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setEditing(false); router.refresh()
  }

  if (!editing) return <button className="btn ghost" style={{marginTop:12,fontSize:12.5,padding:'7px 12px'}} onClick={()=>setEditing(true)}>Rediģēt iekārtu</button>

  return (
    <form onSubmit={submit} style={{marginTop:12}}>
      <label>Veids</label>
      <select value={kind} onChange={ev=>setKind(ev.target.value)}>
        {Object.entries(KIND).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div><label>Ražotājs</label><input type="text" value={manufacturer} onChange={ev=>setManufacturer(ev.target.value)} /></div>
        <div><label>Modelis</label><input type="text" value={model} onChange={ev=>setModel(ev.target.value)} /></div>
      </div>
      <label>Sērijas numurs</label>
      <input type="text" value={serialNumber} onChange={ev=>setSerialNumber(ev.target.value)} />
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div><label>Uzstādīšanas gads</label><input type="number" min="1950" max="2100" value={installedYear} onChange={ev=>setInstalledYear(ev.target.value)} /></div>
        <div><label>Jauda (kW)</label><input type="number" step="0.1" value={outputKw} onChange={ev=>setOutputKw(ev.target.value)} /></div>
      </div>
      <label>Stāvoklis</label>
      <select value={condition} onChange={ev=>setCondition(ev.target.value)}>
        <option value="">— Nav norādīts —</option>
        {Object.entries(COND).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <label>Pēdējā apkope</label>
      <input type="date" value={lastServiced} onChange={ev=>setLastServiced(ev.target.value)} />
      <label>Piezīmes</label>
      <textarea value={notes} onChange={ev=>setNotes(ev.target.value)} />
      {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
      <div style={{display:'flex',gap:10,marginTop:12}}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={()=>setEditing(false)}>Atcelt</button>
      </div>
    </form>
  )
}
