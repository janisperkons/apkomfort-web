'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function JobActions({ job }) {
  const [mode, setMode] = useState(null) // null | 'complete'
  const [workDone, setWorkDone] = useState(job.work_done || '')
  const [recommendations, setRecommendations] = useState(job.recommendations || '')
  const [labourHours, setLabourHours] = useState(job.labour_hours || '')
  const [labourCharge, setLabourCharge] = useState(job.labour_charged_ex_vat || '')
  const [partsCharge, setPartsCharge] = useState(job.parts_charged_ex_vat || '')
  const [internalNotes, setInternalNotes] = useState(job.internal_notes || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()
  const isDone = job.status === 'completed'

  async function quickComplete() {
    setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('jobs').update({
      status: 'completed', completed_at: new Date().toISOString(),
    }).eq('id', job.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); router.refresh()
  }

  async function saveDetails(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('jobs').update({
      status: 'completed',
      completed_at: job.completed_at || new Date().toISOString(),
      work_done: workDone.trim() || null,
      recommendations: recommendations.trim() || null,
      labour_hours: labourHours ? Number(labourHours) : null,
      labour_charged_ex_vat: labourCharge ? Number(labourCharge) : null,
      parts_charged_ex_vat: partsCharge ? Number(partsCharge) : null,
      internal_notes: internalNotes.trim() || null,
    }).eq('id', job.id)
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setMode(null); router.refresh()
  }

  async function cancel() {
    if (!window.confirm('Atcelt šo darbu?')) return
    setBusy(true)
    await supabaseBrowser().from('jobs').update({ status: 'cancelled' }).eq('id', job.id)
    setBusy(false); router.refresh()
  }

  async function start() {
    setBusy(true)
    await supabaseBrowser().from('jobs').update({ status: 'in_progress' }).eq('id', job.id)
    setBusy(false); router.refresh()
  }

  if (mode !== 'complete') {
    return (
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {job.status === 'scheduled' && (
          <button type="button" className="btn ghost" style={{ fontSize: 12.5, padding: '7px 12px' }} disabled={busy} onClick={start}>Uzsākt darbu</button>
        )}
        {!isDone && (
          <button type="button" className="btn ghost" style={{ fontSize: 12.5, padding: '7px 12px' }} disabled={busy} onClick={quickComplete}>
            {busy ? 'Saglabā…' : 'Pabeigt ✓'}
          </button>
        )}
        <button type="button" className="btn ghost" style={{ fontSize: 12.5, padding: '7px 12px' }} disabled={busy} onClick={() => setMode('complete')}>
          {isDone ? 'Rediģēt detaļas' : 'Pabeigt ar detaļām'}
        </button>
        {!isDone && (
          <button type="button" className="btn ghost" style={{ fontSize: 12.5, padding: '7px 12px', color: '#a33' }} disabled={busy} onClick={cancel}>Atcelt</button>
        )}
        {err && <div className="note warn" style={{ marginTop: 6, width: '100%' }}>{err}</div>}
      </div>
    )
  }

  return (
    <form onSubmit={saveDetails} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #EFEADC' }}>
      <label>Paveiktais darbs (nav obligāti)</label>
      <textarea value={workDone} onChange={e => setWorkDone(e.target.value)} />
      <label>Ieteikumi klientam</label>
      <textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} />
      <div className="grid g3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div><label>Stundas</label><input type="number" step="0.5" min="0" value={labourHours} onChange={e => setLabourHours(e.target.value)} /></div>
        <div><label>Darbs (€ bez PVN)</label><input type="number" step="0.01" min="0" value={labourCharge} onChange={e => setLabourCharge(e.target.value)} /></div>
        <div><label>Detaļas (€ bez PVN)</label><input type="number" step="0.01" min="0" value={partsCharge} onChange={e => setPartsCharge(e.target.value)} /></div>
      </div>
      <label>Iekšēja piezīme</label>
      <textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} />
      {err && <div className="note warn" style={{ marginTop: 10 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={() => setMode(null)}>Atcelt</button>
      </div>
    </form>
  )
}
