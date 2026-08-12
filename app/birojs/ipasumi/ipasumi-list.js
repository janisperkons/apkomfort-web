'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TIER, STATUS, KIND, d } from '../../../lib/format'

function matches(p, needle) {
  const haystack = [
    p.address_line, p.municipality, p.postcode,
    p.customers?.full_name, p.customers?.phone,
    ...(p.equipment || []).flatMap(e => [e.manufacturer, e.model, KIND[e.kind]]),
  ].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(needle)
}

export default function IpasumiList({ data }) {
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return data || []
    return (data || []).filter(p => matches(p, needle))
  }, [data, query])

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Meklēt pēc klienta, ielas, novada vai katla…"
        style={{ maxWidth: 360, marginBottom: 16 }}
      />
      <div className="card">
        <table>
          <thead><tr><th>Adrese</th><th>Novads</th><th>Platība</th><th>Klients</th><th>Iekārta</th><th>Plāns</th><th>Parakstīts</th></tr></thead>
          <tbody>
            {rows.map(p => {
              const m = (p.memberships || [])[0]
              const s = m ? (STATUS[m.status] || ['—', 'p-pending']) : null
              const eq = (p.equipment || []).filter(e => e.kind !== 'cylinder')[0]
              return (
                <tr key={p.id}>
                  <td><Link href={`/birojs/ipasumi/${p.id}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.address_line}</Link>
                    <div className="small muted">{p.property_type}</div></td>
                  <td className="small">{p.municipality}</td>
                  <td className="small">{p.floor_area_m2 ? p.floor_area_m2 + ' m²' : '—'}</td>
                  <td className="small">
                    {p.customers?.id ? (
                      <Link href={`/birojs/klienti/${p.customers.id}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.customers.full_name}</Link>
                    ) : (p.customers?.full_name || '—')}
                    <div className="muted">{p.customers?.phone}</div>
                  </td>
                  <td className="small">{eq ? <>{eq.manufacturer} {eq.model}<div className="muted">{KIND[eq.kind]} · {eq.installed_year}</div></> : '—'}</td>
                  <td>{m ? <><span className="pill p-tier">{TIER[m.tier]}</span>{' '}<span className={'pill ' + s[1]}>{s[0]}</span></> : '—'}</td>
                  <td className="small">{d(m?.signed_on)}</td>
                </tr>
              )
            })}
            {!rows.length && (
              <tr><td colSpan="7" className="muted">
                {query ? 'Nekas neatbilst meklējumam.' : 'Vēl nav īpašumu.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
