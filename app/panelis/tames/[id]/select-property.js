'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/browserAuth'

export default function SelectProperty({ quoteId, properties }) {
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const router = useRouter()

  async function confirm() {
    if (!propertyId) { setErr('Izvēlieties īpašumu.'); return }
    setBusy(true); setErr(null)
    const { data: ok, error } = await supabaseBrowser().rpc('set_quote_property_by_client', {
      p_quote_id: quoteId, p_property_id: propertyId,
    })
    setBusy(false)
    if (error || !ok) { setErr('Neizdevās saglabāt īpašumu.'); return }
    router.refresh()
  }

  return (
    <div className="card sec" style={{ borderColor: 'var(--acc)' }}>
      <h3 style={{ marginBottom: 6 }}>Kuram īpašumam šī tāme ir paredzēta?</h3>
      <p className="small muted" style={{ marginTop: -2, marginBottom: 12 }}>
        Lūdzu norādiet, pirms apstiprināt piedāvājumu.
      </p>
      {properties.length > 0 ? (
        <>
          <select value={propertyId} onChange={e => setPropertyId(e.target.value)} style={{ maxWidth: 400 }}>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.address_line}, {p.municipality}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={confirm} disabled={busy}>
              {busy ? 'Saglabā…' : 'Apstiprināt īpašumu'}
            </button>
            <a href={`/panelis/ipasums/jauns?quoteId=${quoteId}&returnTo=/panelis/tames/${quoteId}`} className="small" style={{ color: 'var(--acc)', fontWeight: 600 }}>
              + Pievienot jaunu īpašumu
            </a>
          </div>
        </>
      ) : (
        <a href={`/panelis/ipasums/jauns?quoteId=${quoteId}&returnTo=/panelis/tames/${quoteId}`} className="btn">
          + Pievienot īpašumu
        </a>
      )}
      {err && <div className="note warn" style={{ marginTop: 12 }}>{err}</div>}
    </div>
  )
}
