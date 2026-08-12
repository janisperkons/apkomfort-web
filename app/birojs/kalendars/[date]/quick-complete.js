'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function QuickComplete({ jobId }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function complete() {
    setBusy(true)
    await supabaseBrowser().from('jobs').update({
      status: 'completed', completed_at: new Date().toISOString(),
    }).eq('id', jobId)
    setBusy(false)
    router.refresh()
  }

  return (
    <button type="button" className="btn ghost small" disabled={busy} onClick={complete} style={{ whiteSpace: 'nowrap' }}>
      {busy ? 'Saglabā…' : 'Pabeigt ✓'}
    </button>
  )
}
