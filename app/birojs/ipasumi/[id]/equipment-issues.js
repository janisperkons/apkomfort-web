'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export function ResolveFault({ fault }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  async function resolve() {
    setBusy(true)
    await supabaseBrowser().from('faults').update({ resolved_on: new Date().toISOString().slice(0,10) }).eq('id', fault.id)
    setBusy(false); router.refresh()
  }
  return <button type="button" className="btn ghost" style={{fontSize:11.5,padding:'4px 9px',marginLeft:8}} disabled={busy} onClick={resolve}>Atrisināts</button>
}

export default function EquipmentIssues({ equipmentId }) {
  const [mode, setMode] = useState(null) // null | 'fault' | 'exclusion'
  const [description, setDescription] = useState('')
  const [ourWorkmanship, setOurWorkmanship] = useState(false)
  const [component, setComponent] = useState('')
  const [reason, setReason] = useState('')
  const [expiresOn, setExpiresOn] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function submitFault(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('faults').insert({
      equipment_id: equipmentId, description: description.trim(), our_workmanship: ourWorkmanship,
    })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setDescription(''); setOurWorkmanship(false); setBusy(false); setMode(null); router.refresh()
  }

  async function submitExclusion(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('exclusions').insert({
      equipment_id: equipmentId, component: component.trim(), reason: reason.trim() || null,
      acknowledged_by_customer: acknowledged, expires_on: expiresOn || null,
    })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setComponent(''); setReason(''); setAcknowledged(false); setExpiresOn(''); setBusy(false); setMode(null); router.refresh()
  }

  if (mode === 'fault') {
    return (
      <form onSubmit={submitFault} style={{marginTop:12}}>
        <label>Defekta apraksts</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} required />
        <label><input type="checkbox" checked={ourWorkmanship} onChange={e=>setOurWorkmanship(e.target.checked)} style={{width:'auto',marginRight:6}} />Mūsu darba defekts</label>
        {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
        <div style={{display:'flex',gap:10,marginTop:10}}>
          <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt defektu'}</button>
          <button type="button" className="btn ghost" onClick={()=>setMode(null)}>Atcelt</button>
        </div>
      </form>
    )
  }

  if (mode === 'exclusion') {
    return (
      <form onSubmit={submitExclusion} style={{marginTop:12}}>
        <label>Komponente</label>
        <input type="text" value={component} onChange={e=>setComponent(e.target.value)} required />
        <label>Iemesls</label>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} />
        <label>Derīgs līdz</label>
        <input type="date" value={expiresOn} onChange={e=>setExpiresOn(e.target.value)} />
        <label><input type="checkbox" checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)} style={{width:'auto',marginRight:6}} />Klients apstiprinājis</label>
        {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
        <div style={{display:'flex',gap:10,marginTop:10}}>
          <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt iepriekšējo bojājumu'}</button>
          <button type="button" className="btn ghost" onClick={()=>setMode(null)}>Atcelt</button>
        </div>
      </form>
    )
  }

  return (
    <div style={{display:'flex',gap:8,marginTop:10}}>
      <button type="button" className="btn ghost" style={{fontSize:12.5,padding:'7px 12px'}} onClick={()=>setMode('fault')}>+ Defekts</button>
      <button type="button" className="btn ghost" style={{fontSize:12.5,padding:'7px 12px'}} onClick={()=>setMode('exclusion')}>+ Iepriekšējs bojājums</button>
    </div>
  )
}
