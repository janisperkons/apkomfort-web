'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { JOB, d } from '../../../../lib/format'

export default function ConfirmVisit({ job, engineers }) {
  const [scheduledFor, setScheduledFor] = useState(job.requested_date ? `${job.requested_date}T09:00` : '')
  const [engineerId, setEngineerId] = useState(engineers[0]?.id || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function confirm(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('jobs').update({
      status: 'scheduled',
      scheduled_for: scheduledFor || null,
      engineer_id: engineerId || null,
      booked_by: 'staff',
    }).eq('id', job.id)
    if (error) { setErr('Neizdevās apstiprināt.'); setBusy(false); return }
    setBusy(false); router.refresh()
  }

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
        <h3>{JOB[job.kind] || job.kind}</h3>
        <span className="pill p-pending" style={{marginLeft:'auto'}}>Gaida apstiprinājumu</span>
      </div>
      {job.equipment && <div className="small muted">{job.equipment.manufacturer} {job.equipment.model}</div>}
      <div className="small" style={{marginTop:6}}>Vēlamais datums: <b>{d(job.requested_date)}</b></div>
      {job.requested_notes && <div className="small" style={{marginTop:6}}>{job.requested_notes}</div>}

      <form onSubmit={confirm} style={{marginTop:14}}>
        <label>Apstiprinātais datums un laiks</label>
        <input type="datetime-local" value={scheduledFor} onChange={e=>setScheduledFor(e.target.value)} required />
        <label>Speciālists</label>
        <select value={engineerId} onChange={e=>setEngineerId(e.target.value)}>
          {engineers.map(en => <option key={en.id} value={en.id}>{en.full_name}</option>)}
        </select>
        {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
        <button className="btn" style={{marginTop:12}} disabled={busy}>{busy ? 'Apstiprina…' : 'Apstiprināt vizīti'}</button>
      </form>
    </div>
  )
}
