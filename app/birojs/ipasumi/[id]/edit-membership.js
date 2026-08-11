'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'
import { TIER, STATUS } from '../../../../lib/format'

const PAYMENT_PLAN = { annual_upfront: 'Gads uz priekšu', monthly_dd: 'Ikmēneša' }

export default function EditMembership({ propertyId, membership: m }) {
  const [editing, setEditing] = useState(false)
  const [tier, setTier] = useState(m?.tier || Object.keys(TIER)[0])
  const [status, setStatus] = useState(m?.status || 'enquiry')
  const [monthlyPrice, setMonthlyPrice] = useState(m?.monthly_price_ex_vat || '')
  const [calculatedPrice, setCalculatedPrice] = useState(m?.calculated_price_ex_vat || '')
  const [overrideReason, setOverrideReason] = useState(m?.override_reason || '')
  const [paymentPlan, setPaymentPlan] = useState(m?.payment_plan || 'annual_upfront')
  const [signedOn, setSignedOn] = useState(m?.signed_on || '')
  const [startDate, setStartDate] = useState(m?.start_date || '')
  const [anniversaryDate, setAnniversaryDate] = useState(m?.anniversary_date || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(null)
    const payload = {
      tier, status,
      monthly_price_ex_vat: monthlyPrice ? Number(monthlyPrice) : null,
      calculated_price_ex_vat: calculatedPrice ? Number(calculatedPrice) : null,
      override_reason: overrideReason.trim() || null,
      payment_plan: paymentPlan,
      signed_on: signedOn || null,
      start_date: startDate || null,
      anniversary_date: anniversaryDate || null,
    }
    const { error } = m
      ? await supabaseBrowser().from('memberships').update(payload).eq('id', m.id)
      : await supabaseBrowser().from('memberships').insert({ ...payload, property_id: propertyId })
    if (error) { setErr('Neizdevās saglabāt.'); setBusy(false); return }
    setBusy(false); setEditing(false); router.refresh()
  }

  if (!editing) {
    return <button className="btn ghost" onClick={()=>setEditing(true)}>{m ? 'Rediģēt plānu' : '+ Pievienot plānu'}</button>
  }

  return (
    <form onSubmit={submit} style={{marginTop:12}}>
      <label>Līmenis</label>
      <select value={tier} onChange={e=>setTier(e.target.value)}>
        {Object.entries(TIER).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <label>Statuss</label>
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        {Object.entries(STATUS).map(([k,[label]]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <div className="grid g2" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div><label>Cena / mēn. (€ bez PVN)</label><input type="number" step="0.01" min="0" value={monthlyPrice} onChange={e=>setMonthlyPrice(e.target.value)} required /></div>
        <div><label>Aprēķinātā cena (€)</label><input type="number" step="0.01" min="0" value={calculatedPrice} onChange={e=>setCalculatedPrice(e.target.value)} /></div>
      </div>
      <label>Cenas korekcijas iemesls</label>
      <input type="text" value={overrideReason} onChange={e=>setOverrideReason(e.target.value)} />
      <label>Maksājuma plāns</label>
      <select value={paymentPlan} onChange={e=>setPaymentPlan(e.target.value)}>
        {Object.entries(PAYMENT_PLAN).map(([k,label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <div className="grid g3" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
        <div><label>Parakstīts</label><input type="date" value={signedOn} onChange={e=>setSignedOn(e.target.value)} /></div>
        <div><label>Sākums</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} /></div>
        <div><label>Atjaunošana</label><input type="date" value={anniversaryDate} onChange={e=>setAnniversaryDate(e.target.value)} /></div>
      </div>
      {err && <div className="note warn" style={{marginTop:10}}>{err}</div>}
      <div style={{display:'flex',gap:10,marginTop:14}}>
        <button className="btn" disabled={busy}>{busy ? 'Saglabā…' : 'Saglabāt'}</button>
        <button type="button" className="btn ghost" onClick={()=>setEditing(false)}>Atcelt</button>
      </div>
    </form>
  )
}
