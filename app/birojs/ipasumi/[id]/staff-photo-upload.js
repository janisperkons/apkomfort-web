'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { prepareImage, safeStorageName } from '../../../../lib/imageUpload'

export default function StaffPhotoUpload({ propertyId, equipmentId }) {
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(null) // 'Augšupielādē 2/3…'
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function uploadPhotos(ev) {
    const files = Array.from(ev.target.files || [])
    if (!files.length) return
    setErr(null)
    const sb = supabaseBrowser()

    for (let i = 0; i < files.length; i++) {
      setProgress(files.length > 1 ? `Augšupielādē ${i + 1}/${files.length}…` : 'Augšupielādē…')
      const prepared = await prepareImage(files[i])
      const path = `${propertyId}/${equipmentId}/${Date.now()}-${safeStorageName(prepared.filename)}`

      const { error: upErr } = await sb.storage.from('equipment-photos')
        .upload(path, prepared.blob, { contentType: prepared.contentType })
      if (upErr) {
        // Surface the real reason — "won't upload" with no detail is undebuggable.
        setErr(`Neizdevās augšupielādēt "${files[i].name}": ${upErr.message}`)
        setProgress(null)
        return
      }

      const { error: rowErr } = await sb.from('equipment_photos').insert({
        equipment_id: equipmentId, storage_path: path, caption: caption.trim() || null, uploaded_by: 'staff',
      })
      if (rowErr) {
        setErr(`Attēls "${files[i].name}" augšupielādēts, bet neizdevās saglabāt ierakstu: ${rowErr.message}`)
        setProgress(null)
        return
      }
    }

    setCaption(''); setProgress(null); ev.target.value = ''
    router.refresh()
  }

  return (
    <div style={{ marginTop: 10 }}>
      <input type="text" placeholder="Paraksts (nav obligāts)" value={caption} onChange={ev => setCaption(ev.target.value)} style={{ marginBottom: 8 }} />
      <input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={progress !== null} />
      {progress && <div className="small muted" style={{ marginTop: 6 }}>{progress}</div>}
      {err && <div className="note warn" style={{ marginTop: 8 }}>{err}</div>}
    </div>
  )
}
