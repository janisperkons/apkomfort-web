'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'

const OPTIONS = [
  ['new', 'Jauns'],
  ['contacted', 'Sazinājāmies'],
  ['converted', 'Kļuvis par klientu'],
  ['declined', 'Noraidīts'],
]

export default function StatusSelect({ id, status }) {
  const [value, setValue] = useState(status || 'new')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function change(e) {
    const next = e.target.value
    setValue(next); setBusy(true)
    await supabaseBrowser().from('enquiries').update({ status: next }).eq('id', id)
    setBusy(false); router.refresh()
  }

  return (
    <select value={value} onChange={change} disabled={busy} style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}>
      {OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
    </select>
  )
}
