'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'
import { JOB, KIND } from '../../../lib/format'

export default function RequestVisitForm({ properties }) {
  const [propertyId, setPropertyId] = useState(properties[0].id)
  const [equipmentId, setEquipmentId] = useState('')
  const [kind, setKind] = useState('callout')
  const [requestedDate, setRequestedDate] = useState('')
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const equipment = useMemo(() => properties.find(p => p.id === propertyId)?.equipment || [], [properties, propertyId])

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('jobs').insert({
      property_id: propertyId,
      equipment_id: equipmentId || null,
      kind,
      status: 'enquiry',
      requested_date: requestedDate || null,
      requested_notes: notes.trim() || null,
      booked_by: 'customer',
    })
    if (error) { setErr('Neizdevās nosūtīt pieteikumu.'); setBusy(false); return }
    setSent(true); setBusy(false); router.refresh()
  }

  if (sent) {
    return (
      <div className="card" style={{ maxWidth: 480, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>Paldies!</h2>
        <p className="muted">Pieteikumu saņēmām. Sazināsimies, lai apstiprinātu laiku.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 520 }}>
      <label>Īpašums</label>
      <select value={propertyId} onChange={e => { setPropertyId(e.target.value); setEquipmentId('') }}>
        {properties.map(p => <option key={p.id} value={p.id}>{p.address_line}</option>)}
      </select>

      <label>Iekārta (nav obligāti)</label>
      <select value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
        <option value="">— Nav norādīts —</option>
        {equipment.map(eq => (
          <option key={eq.id} value={eq.id}>{KIND[eq.kind]}{eq.manufacturer ? ` — ${eq.manufacturer} ${eq.model || ''}` : ''}</option>
        ))}
      </select>

      <label>Vizītes veids</label>
      <select value={kind} onChange={e => setKind(e.target.value)}>
        {Object.entries(JOB).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
      </select>

      <label>Vēlamais datums</label>
      <input type="date" value={requestedDate} onChange={e => setRequestedDate(e.target.value)} />

      <label>Aprakstiet problēmu vai vajadzību</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Piemēram: katls neieslēdzas, rāda kļūdas kodu E4." />

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
      <button className="btn" style={{ marginTop: 18 }} disabled={busy}>{busy ? 'Sūta…' : 'Iesniegt pieteikumu'}</button>
    </form>
  )
}
