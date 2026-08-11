'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { KIND, d } from '../../../../lib/format'

export default function EquipmentCard({ equipment: e }) {
  const router = useRouter()
  const [photoUrls, setPhotoUrls] = useState({})
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [servicedOn, setServicedOn] = useState('')
  const [performedBy, setPerformedBy] = useState('')
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  const photos = e.equipment_photos || []
  const history = (e.equipment_service_history || []).sort((a, b) => new Date(b.serviced_on) - new Date(a.serviced_on))

  useEffect(() => {
    let cancelled = false
    async function loadUrls() {
      const sb = supabaseBrowser()
      const entries = await Promise.all(photos.map(async ph => {
        const { data } = await sb.storage.from('equipment-photos').createSignedUrl(ph.storage_path, 3600)
        return [ph.id, data?.signedUrl]
      }))
      if (!cancelled) setPhotoUrls(Object.fromEntries(entries))
    }
    if (photos.length) loadUrls()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length])

  async function uploadPhoto(ev) {
    const file = ev.target.files?.[0]
    if (!file) return
    setUploading(true); setErr(null)
    const sb = supabaseBrowser()
    const path = `${e.property_id}/${e.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    const { error: upErr } = await sb.storage.from('equipment-photos').upload(path, file)
    if (upErr) { setErr('Neizdevās augšupielādēt attēlu.'); setUploading(false); return }
    const { error: rowErr } = await sb.from('equipment_photos').insert({
      equipment_id: e.id, storage_path: path, caption: caption.trim() || null, uploaded_by: 'customer',
    })
    if (rowErr) { setErr('Attēls augšupielādēts, bet neizdevās saglabāt ierakstu.'); setUploading(false); return }
    setCaption(''); setUploading(false); ev.target.value = ''; router.refresh()
  }

  async function addHistory(ev) {
    ev.preventDefault(); setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('equipment_service_history').insert({
      equipment_id: e.id, serviced_on: servicedOn, performed_by: performedBy.trim() || null, notes: notes.trim() || null,
    })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setServicedOn(''); setPerformedBy(''); setNotes(''); setBusy(false); setHistoryOpen(false); router.refresh()
  }

  return (
    <div className="card">
      <h3>{e.manufacturer} {e.model}</h3>
      <dl className="kv" style={{ marginTop: 10 }}>
        <dt>Veids</dt><dd>{KIND[e.kind]}</dd>
        <dt>Uzstādīts</dt><dd>{e.installed_year || '—'}</dd>
      </dl>

      <div className="small" style={{ marginTop: 14, fontWeight: 600, color: 'var(--ink)' }}>Fotogrāfijas</div>
      {photos.length > 0 && (
        <div className="photos">
          {photos.map(ph => (
            <div className="ph" key={ph.id}>
              {photoUrls[ph.id] && <img src={photoUrls[ph.id]} alt={ph.caption || ''} />}
              {ph.caption && <div className="cap">{ph.caption}</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <input type="text" placeholder="Paraksts (nav obligāts)" value={caption} onChange={ev => setCaption(ev.target.value)} style={{ marginBottom: 8 }} />
        <input type="file" accept="image/*" onChange={uploadPhoto} disabled={uploading} />
        {uploading && <div className="small muted" style={{ marginTop: 6 }}>Augšupielādē…</div>}
      </div>

      <div className="small" style={{ marginTop: 18, fontWeight: 600, color: 'var(--ink)' }}>Apkopes vēsture</div>
      {history.length > 0 ? (
        <div style={{ marginTop: 6 }}>
          {history.map(h => (
            <div key={h.id} className="small" style={{ padding: '7px 0', borderBottom: '1px solid #EFEADC' }}>
              <b>{d(h.serviced_on)}</b>{h.performed_by ? ` · ${h.performed_by}` : ''}
              {h.notes && <div className="muted">{h.notes}</div>}
            </div>
          ))}
        </div>
      ) : <p className="small muted" style={{ marginTop: 6 }}>Vēl nav ierakstu.</p>}

      {historyOpen ? (
        <form onSubmit={addHistory} style={{ marginTop: 10 }}>
          <label>Apkopes datums</label>
          <input type="date" value={servicedOn} onChange={ev => setServicedOn(ev.target.value)} required />
          <label>Kas veica</label>
          <input type="text" value={performedBy} onChange={ev => setPerformedBy(ev.target.value)} placeholder="Uzņēmums vai vārds" />
          <label>Piezīmes</label>
          <textarea value={notes} onChange={ev => setNotes(ev.target.value)} />
          {err && <div className="note warn" style={{ marginTop: 10 }}>{err}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
            <button type="button" className="btn ghost" onClick={() => setHistoryOpen(false)}>Atcelt</button>
          </div>
        </form>
      ) : (
        <button className="btn ghost small" style={{ marginTop: 8 }} onClick={() => setHistoryOpen(true)}>+ Pievienot apkopes ierakstu</button>
      )}
    </div>
  )
}
