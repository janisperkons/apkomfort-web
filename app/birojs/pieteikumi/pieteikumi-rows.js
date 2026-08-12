'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { dt } from '../../../lib/format'
import StatusSelect from './status-select'

const SOURCE = {
  kalkulators: 'Kalkulators', 'plani-tiesi': 'Plāns (tieši)', kontakti: 'Kontakti', registracija: 'Reģistrācija',
}

export default function PieteikumiRows({ rows }) {
  const router = useRouter()

  function goToClient(e, customerId) {
    if (!customerId) return
    if (e.target.closest('a, button, select, option, input')) return
    router.push(`/birojs/klienti/${customerId}`)
  }

  if (!rows.length) return <tr><td colSpan="7" className="muted">Vēl nav pieteikumu.</td></tr>

  return (
    <>
      {rows.map(r => (
        <tr key={r.id} onClick={e => goToClient(e, r.customer_id)}
          style={r.customer_id ? { cursor: 'pointer' } : undefined}>
          <td className="small">{dt(r.created_at)}</td>
          <td className="small muted">{SOURCE[r.source] || r.source || '—'}</td>
          <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.name || '—'}</td>
          <td><a href={`tel:${(r.phone || '').split(' ').join('')}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.phone || '—'}</a></td>
          <td className="small">
            {r.system_type || '—'}
            {r.system_age ? <div className="muted">{r.system_age}</div> : null}
          </td>
          <td className="small muted" style={{ maxWidth: 240 }}>{r.message || '—'}</td>
          <td style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <StatusSelect id={r.id} status={r.status} />
            {!r.customer_id && (
              <Link href={`/birojs/klienti/jauns?name=${encodeURIComponent(r.name || '')}&phone=${encodeURIComponent(r.phone || '')}`}
                className="small" style={{ color: 'var(--acc)', fontWeight: 600 }}>→ Izveidot klientu</Link>
            )}
          </td>
        </tr>
      ))}
    </>
  )
}
