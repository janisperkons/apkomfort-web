'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function QuickComplete({ jobId }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function complete() {
    setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('jobs').update({
      status: 'completed', completed_at: new Date().toISOString(),
    }).eq('id', jobId)
    setBusy(false)
    if (error) { setErr('Neizdevās saglabāt.'); return }
    router.refresh()
  }

  return (
    <span>
      <button type="button" className="btn ghost small" disabled={busy} onClick={complete} style={{ whiteSpace: 'nowrap' }}>
        {busy ? 'Saglabā…' : 'Pabeigt ✓'}
      </button>
      {err && <span className="note warn" style={{ marginLeft: 8, fontSize: 12 }}>{err}</span>}
    </span>
  )
}
