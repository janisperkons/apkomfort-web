'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function PhotoGallery({ photos }) {
  const [urls, setUrls] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const sb = supabaseBrowser()
      const entries = await Promise.all((photos || []).map(async ph => {
        const { data } = await sb.storage.from('equipment-photos').createSignedUrl(ph.storage_path, 3600)
        return [ph.id, data?.signedUrl]
      }))
      if (!cancelled) setUrls(Object.fromEntries(entries))
    }
    if (photos?.length) load()
    return () => { cancelled = true }
  }, [photos])

  if (!photos?.length) return null
  return (
    <div className="photos">
      {photos.map(ph => (
        <div className="ph" key={ph.id}>
          {urls[ph.id] && <img src={urls[ph.id]} alt={ph.caption || ''} />}
          {ph.caption && <div className="cap">{ph.caption}</div>}
        </div>
      ))}
    </div>
  )
}
