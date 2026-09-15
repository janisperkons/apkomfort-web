'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { dt } from '../../../../lib/format'

export default function DayNotes({ date, initialNotes, userId }) {
  const [notes, setNotes] = useState(initialNotes)
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  useEffect(() => { setNotes(initialNotes) }, [initialNotes])

  async function addNote(e) {
    e.preventDefault()
    if (!body.trim()) return
    setBusy(true); setErr(null)
    const { error } = await supabaseBrowser().from('calendar_notes').insert({
      note_date: date, body: body.trim(), created_by: userId,
    })
    setBusy(false)
    if (error) { setErr('Neizdevās saglabāt piezīmi.'); return }
    setBody('')
    router.refresh()
  }

  async function deleteNote(id) {
    if (!window.confirm('Dzēst šo piezīmi?')) return
    const { error } = await supabaseBrowser().from('calendar_notes').delete().eq('id', id)
    if (error) { setErr('Neizdevās dzēst piezīmi.'); return }
    setNotes(notes.filter(n => n.id !== id))
    router.refresh()
  }

  return (
    <div className="card sec">
      <h2 className="sec" style={{ marginBottom: 12 }}>Piezīmes</h2>

      {notes.length > 0 ? notes.map(n => (
        <div key={n.id} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #EFEADC', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{n.body}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="small muted" style={{ whiteSpace: 'nowrap' }}>{dt(n.created_at)}</span>
            <button type="button" className="btn ghost small" onClick={() => deleteNote(n.id)}>Dzēst</button>
          </div>
        </div>
      )) : <p className="muted small">Šai dienai vēl nav piezīmju.</p>}

      <form onSubmit={addNote} style={{ marginTop: 14 }}>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Kas šodien darīts, novērots, jāatceras…"
          rows={3} />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="submit" className="btn" disabled={busy || !body.trim()}>{busy ? 'Saglabā…' : '+ Pievienot piezīmi'}</button>
          {err && <span className="note warn small">{err}</span>}
        </div>
      </form>
    </div>
  )
}
