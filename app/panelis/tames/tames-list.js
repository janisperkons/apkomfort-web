'use client'
import { useRouter } from 'next/navigation'
import { QUOTE_STATUS, d, eur } from '../../../lib/format'

export default function TamesList({ quotes }) {
  const router = useRouter()

  function goTo(e, id) {
    if (e.target.closest('a, button')) return
    router.push(`/panelis/tames/${id}`)
  }

  if (!quotes.length) return <p className="muted">Vēl nav saņemtu tāmju.</p>

  return (
    <table>
      <thead>
        <tr><th>Nr.</th><th>Īpašums</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th><th></th></tr>
      </thead>
      <tbody>
        {quotes.map(q => {
          const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']
          return (
            <tr key={q.id} onClick={e => goTo(e, q.id)} style={{ cursor: 'pointer' }}>
              <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {q.quote_number}
                {!q.viewed_at && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', marginLeft: 8, padding: '2px 8px',
                    borderRadius: 999, background: 'var(--acc)', color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>Jauns</span>
                )}
              </td>
              <td className="small muted">{q.property_address || '—'}</td>
              <td className="small">{d(q.created_at)}</td>
              <td className="small">{d(q.valid_until)}</td>
              <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(q.total)}</td>
              <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
              <td>
                <a href={`/api/quotes/${q.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost small">PDF</a>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
