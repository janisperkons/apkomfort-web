'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TIER, STATUS } from '../../../lib/format'

const TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

function matches(c, needle) {
  const haystack = [
    c.full_name, c.company_name, c.phone, c.email,
    ...(c.properties || []).flatMap(p => [p.address_line, p.municipality]),
  ].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(needle)
}

export default function KlientiList({ data }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return data || []
    return (data || []).filter(c => matches(c, needle))
  }, [data, query])

  function goToClient(e, id) {
    if (e.target.closest('a')) return
    router.push(`/birojs/klienti/${id}`)
  }

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Meklēt pēc vārda, ielas vai pilsētas…"
        style={{ maxWidth: 360, marginBottom: 16 }}
      />
      <div className="card">
        <table>
          <thead><tr><th>Vārds</th><th>Veids</th><th>Telefons</th><th>E-pasts</th><th>Val.</th><th>Īpašumi</th></tr></thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} onClick={e => goToClient(e, c.id)} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  {c.customer_type === 'commercial' && c.company_name ? c.company_name : c.full_name}
                  {c.customer_type === 'commercial' && c.company_name && (
                    <div className="small muted" style={{ fontWeight: 400, marginTop: 2 }}>{c.full_name}</div>)}
                  {c.notes && <div className="small muted" style={{ fontWeight: 400, marginTop: 2 }}>{c.notes}</div>}
                </td>
                <td className="small">{TYPE[c.customer_type]}</td>
                <td><a href={`tel:${(c.phone || '').split(' ').join('')}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{c.phone || '—'}</a></td>
                <td className="small"><a href={`mailto:${c.email}`} className="muted">{c.email || '—'}</a></td>
                <td className="small muted">{(c.language || 'lv').toUpperCase()}</td>
                <td>
                  {(c.properties || []).map(p => (
                    <div key={p.id} style={{ marginBottom: 5 }}>
                      <Link href={`/birojs/ipasumi/${p.id}`} style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 13.5 }}>
                        {p.address_line}, {p.municipality}</Link>
                      {p.floor_area_m2 ? <span className="small muted"> · {p.floor_area_m2} m²</span> : null}
                      {(p.memberships || []).map((m, i) => {
                        const s = STATUS[m.status] || ['—', 'p-pending']
                        return <span key={i} style={{ marginLeft: 8 }}>
                          <span className="pill p-tier">{TIER[m.tier]}</span>{' '}
                          <span className={'pill ' + s[1]}>{s[0]}</span></span>
                      })}
                    </div>))}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="6" className="muted">
                {query ? 'Nekas neatbilst meklējumam.' : 'Vēl nav klientu.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
