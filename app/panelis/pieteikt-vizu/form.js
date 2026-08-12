'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'
import { JOB, KIND, TIER } from '../../../lib/format'

export default function RequestVisitForm({ properties }) {
  const [propertyId, setPropertyId] = useState(properties[0].id)
  const [equipmentId, setEquipmentId] = useState('')
  const [kind, setKind] = useState('callout')
  const [urgent, setUrgent] = useState(false)
  const [wantsMembership, setWantsMembership] = useState(false)
  const [membershipTier, setMembershipTier] = useState('apkope')
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
      urgent,
      requested_membership_tier: wantsMembership ? membershipTier : null,
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
        <p className="muted">
          {urgent
            ? 'Pieteikumu saņēmām un atzīmējām kā steidzamu — sazināsimies iespējami drīz.'
            : 'Pieteikumu saņēmām. Sazināsimies, lai apstiprinātu laiku.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 520 }}>
      <p className="small muted" style={{ marginTop: -6, marginBottom: 16 }}>
        Pieteikties var jebkuram darbam — ne tikai apkures katla apkopei. Tas pats attiecas
        arī uz noplūdēm, veļas mašīnas pieslēgšanu, jauktuvju, dušas vai tualetes remontu un
        citiem santehnikas darbiem.
      </p>

      <label>Īpašums</label>
      <select value={propertyId} onChange={e => { setPropertyId(e.target.value); setEquipmentId('') }}>
        {properties.map(p => <option key={p.id} value={p.id}>{p.address_line}</option>)}
      </select>

      <label>Iekārta (nav obligāti — ja darbs nav saistīts ar konkrētu iekārtu, atstājiet tukšu)</label>
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

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, fontWeight: 400 }}>
        <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} style={{ width: 'auto', marginTop: 3 }} />
        <span>Steidzams — piemēram, aktīva noplūde vai avārijas situācija</span>
      </label>

      <label>Vēlamais datums</label>
      <input type="date" value={requestedDate} onChange={e => setRequestedDate(e.target.value)} />

      <label>Aprakstiet problēmu vai vajadzību</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Piemēram: katls neieslēdzas, rāda kļūdas kodu E4. Vai: noplūde zem izlietnes virtuvē. Vai: jāpieslēdz jauna veļas mašīna." />

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, fontWeight: 400 }}>
        <input type="checkbox" checked={wantsMembership} onChange={e => setWantsMembership(e.target.checked)} style={{ width: 'auto', marginTop: 3 }} />
        <span>Vēlos vienlaikus pieteikties arī Komforta klubam</span>
      </label>
      {wantsMembership && (
        <div style={{ maxWidth: 240 }}>
          <label>Vēlamais plāns</label>
          <select value={membershipTier} onChange={e => setMembershipTier(e.target.value)}>
            {Object.entries(TIER).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
      )}

      {err && <div className="note warn" style={{ marginTop: 14 }}>{err}</div>}
      <button className="btn" style={{ marginTop: 18 }} disabled={busy}>{busy ? 'Sūta…' : 'Iesniegt pieteikumu'}</button>
    </form>
  )
}
