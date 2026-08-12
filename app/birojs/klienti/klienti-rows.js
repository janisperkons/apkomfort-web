'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TIER, STATUS } from '../../../lib/format'

const TYPE = { private: 'Privātpersona', landlord: 'Izīrētājs', commercial: 'Komercklients' }

export default function KlientiRows({ data }) {
  const router = useRouter()

  function goToClient(e, id) {
    if (e.target.closest('a')) return
    router.push(`/birojs/klienti/${id}`)
  }

  return (
    <>
      {(data || []).map(c => (
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
    </>
  )
}
