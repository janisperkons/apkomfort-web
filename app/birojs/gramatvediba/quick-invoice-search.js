'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'

function matches(c, needle) {
  const haystack = [
    c.full_name, c.company_name,
    ...(c.properties || []).flatMap(p => [p.address_line, p.municipality]),
  ].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(needle)
}

export default function QuickInvoiceSearch({ customers }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return (customers || []).filter(c => matches(c, needle)).slice(0, 8)
  }, [customers, query])

  return (
    <div className="card sec">
      <h2 className="sec" style={{ marginBottom: 4 }}>Jauns rēķins</h2>
      <p className="small muted" style={{ marginTop: -4, marginBottom: 12 }}>
        Meklējiet klientu pēc vārda vai adreses un ievadiet rēķinu tāpat kā no viņa konta.
      </p>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Meklēt pēc klienta vārda vai adreses…"
        style={{ maxWidth: 360 }}
      />
      {query.trim() && (
        <div style={{ marginTop: 12 }}>
          {results.length ? results.map(c => {
            const name = c.customer_type === 'commercial' && c.company_name ? c.company_name : c.full_name
            return (
              <Link key={c.id} href={`/birojs/klienti/${c.id}/rekini/jauns`}
                style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                {(c.properties || []).length > 0 && (
                  <div className="small muted">
                    {c.properties.map(p => `${p.address_line}, ${p.municipality}`).join(' · ')}
                  </div>
                )}
              </Link>
            )
          }) : <p className="small muted">Nekas neatbilst meklējumam.</p>}
        </div>
      )}
    </div>
  )
}
