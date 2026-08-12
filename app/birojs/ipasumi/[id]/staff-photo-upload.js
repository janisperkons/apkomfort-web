'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function StaffPhotoUpload({ propertyId, equipmentId }) {
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function uploadPhoto(ev) {
    const file = ev.target.files?.[0]
    if (!file) return
    setUploading(true); setErr(null)
    const sb = supabaseBrowser()
    const path = `${propertyId}/${equipmentId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    const { error: upErr } = await sb.storage.from('equipment-photos').upload(path, file)
    if (upErr) { setErr('Neizdevās augšupielādēt attēlu.'); setUploading(false); return }
    const { error: rowErr } = await sb.from('equipment_photos').insert({
      equipment_id: equipmentId, storage_path: path, caption: caption.trim() || null, uploaded_by: 'staff',
    })
    if (rowErr) { setErr('Attēls augšupielādēts, bet neizdevās saglabāt ierakstu.'); setUploading(false); return }
    setCaption(''); setUploading(false); ev.target.value = ''; router.refresh()
  }

  return (
    <div style={{ marginTop: 10 }}>
      <input type="text" placeholder="Paraksts (nav obligāts)" value={caption} onChange={ev => setCaption(ev.target.value)} style={{ marginBottom: 8 }} />
      <input type="file" accept="image/*" onChange={uploadPhoto} disabled={uploading} />
      {uploading && <div className="small muted" style={{ marginTop: 6 }}>Augšupielādē…</div>}
      {err && <div className="note warn" style={{ marginTop: 8 }}>{err}</div>}
    </div>
  )
}
