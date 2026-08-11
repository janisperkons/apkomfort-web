'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

const KIND = { call: 'Zvans', email: 'E-pasts', sms: 'SMS', note: 'Piezīme' }

export default function LogCommunication({ propertyId, customerId }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState('call')
  const [summary, setSummary] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('communications').insert({
      property_id: propertyId, customer_id: customerId, kind, summary: summary.trim() || null,
    })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setSummary(''); setBusy(false); setOpen(false); router.refresh()
  }

  if (!open) return <button className="btn ghost" onClick={()=>setOpen(true)}>+ Pievienot ierakstu</button>

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:480}}>
      <label>Veids</label>
      <select value={kind} onChange={e=>setKind(e.target.value)}>
        {Object.entries(KIND).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <label>Kopsavilkums</label>
      <textarea value={summary} onChange={e=>setSummary(e.target.value)} required />
      {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
      <div style={{display:'flex',gap:10,marginTop:12}}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={()=>setOpen(false)}>Atcelt</button>
      </div>
    </form>
  )
}
