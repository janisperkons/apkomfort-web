'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/browserAuth'

function BenefitList({ tier, kind, title, items, onChanged }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [err, setErr] = useState(null)

  async function addItem() {
    if (!draft.trim()) return
    setAdding(true); setErr(null)
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 1
    const { error } = await supabaseBrowser().from('membership_tier_benefits').insert({
      tier, kind, body: draft.trim(), sort_order: nextOrder,
    })
    setAdding(false)
    if (error) { setErr('Neizdevās pievienot.'); return }
    setDraft(''); onChanged()
  }

  async function removeItem(id) {
    if (!window.confirm('Tiešām dzēst šo rindu?')) return
    setBusyId(id); setErr(null)
    const { error } = await supabaseBrowser().from('membership_tier_benefits').delete().eq('id', id)
    setBusyId(null)
    if (error) { setErr('Neizdevās dzēst.'); return }
    onChanged()
  }

  async function editItem(id, body) {
    setErr(null)
    const { error } = await supabaseBrowser().from('membership_tier_benefits').update({ body }).eq('id', id)
    if (error) { setErr('Neizdevās saglabāt.'); return }
    onChanged()
  }

  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
        {title}
      </div>
      {items.map(it => (
        <div key={it.id} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <input type="text" defaultValue={it.body} onBlur={e => e.target.value.trim() !== it.body && editItem(it.id, e.target.value.trim())}
            style={{ fontSize: 13.5 }} />
          <button type="button" onClick={() => removeItem(it.id)} disabled={busyId === it.id}
            className="btn ghost small" style={{ padding: '5px 10px', flex: 'none' }}>×</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
          placeholder="Pievienot rindu…" style={{ fontSize: 13.5 }} />
        <button type="button" onClick={addItem} disabled={adding || !draft.trim()} className="btn ghost small" style={{ flex: 'none' }}>+</button>
      </div>
      {err && <div className="note warn" style={{ marginTop: 8, fontSize: 12.5 }}>{err}</div>}
    </div>
  )
}

export default function TierEditor({ plan, benefits }) {
  const [badge, setBadge] = useState(plan.badge)
  const [name, setName] = useState(plan.name)
  const [lead, setLead] = useState(plan.lead)
  const [isActive, setIsActive] = useState(plan.is_active)
  const [isFeatured, setIsFeatured] = useState(plan.is_featured)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function save() {
    setSaving(true); setErr(null)
    const { error } = await supabaseBrowser().from('membership_tier_plans').update({
      badge: badge.trim(), name: name.trim(), lead: lead.trim(),
      is_active: isActive, is_featured: isFeatured, updated_at: new Date().toISOString(),
    }).eq('tier', plan.tier)
    setSaving(false)
    if (error) { setErr('Neizdevās saglabāt.'); return }
    setSavedAt(new Date())
    router.refresh()
  }

  async function toggleActive() {
    const next = !isActive
    setIsActive(next); setErr(null)
    const { error } = await supabaseBrowser().from('membership_tier_plans').update({ is_active: next }).eq('tier', plan.tier)
    if (error) { setIsActive(!next); setErr('Neizdevās mainīt statusu.'); return }
    router.refresh()
  }

  const included = benefits.filter(b => b.kind === 'included')
  const excluded = benefits.filter(b => b.kind === 'excluded')

  return (
    <div className="card sec" style={{ opacity: isActive ? 1 : 0.55 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
        <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr', flex: 1, minWidth: 280 }}>
          <div>
            <label>Nosaukums (īsais)</label>
            <input type="text" value={badge} onChange={e => setBadge(e.target.value)} />
          </div>
          <div>
            <label>Pilns nosaukums</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, textTransform: 'none', fontSize: 13, fontWeight: 400 }}>
            <input type="checkbox" checked={isActive} onChange={toggleActive} style={{ width: 'auto' }} />
            {isActive ? 'Aktīvs' : 'Nav aktīvs'}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, textTransform: 'none', fontSize: 13, fontWeight: 400 }}>
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} style={{ width: 'auto' }} />
            Populārākais
          </label>
        </div>
      </div>

      <label>Apraksts</label>
      <textarea value={lead} onChange={e => setLead(e.target.value)} style={{ minHeight: 60 }} />

      <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
        <BenefitList tier={plan.tier} kind="included" title="Iekļauts" items={included} onChanged={() => router.refresh()} />
        <BenefitList tier={plan.tier} kind="excluded" title="Neietilpst" items={excluded} onChanged={() => router.refresh()} />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
        <button type="button" className="btn" onClick={save} disabled={saving}>{saving ? 'Saglabā…' : 'Saglabāt'}</button>
        {savedAt && <span className="small muted">Saglabāts</span>}
        {err && <span className="note warn" style={{ fontSize: 12.5 }}>{err}</span>}
      </div>
    </div>
  )
}
