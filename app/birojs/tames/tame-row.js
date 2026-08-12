'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QUOTE_STATUS, d, eur } from '../../../lib/format'

export default function TameRow({ q, showInvoiceLink }) {
  const router = useRouter()
  const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']

  function goTo(e) {
    if (e.target.closest('a')) return
    router.push(`/birojs/tames/${q.id}`)
  }

  return (
    <tr onClick={goTo} style={{ cursor: 'pointer' }}>
      <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{q.quote_number}</td>
      <td className="small">
        {q.contact_name}
        {q.contact_email && <div className="small muted">{q.contact_email}</div>}
      </td>
      <td className="small">{d(q.created_at)}</td>
      <td className="small">{d(q.valid_until)}</td>
      <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(q.total)}</td>
      {showInvoiceLink ? (
        <td className="small">
          {q.converted_invoice_id
            ? <Link href={`/birojs/rekini/${q.converted_invoice_id}`} style={{ color: 'var(--acc)', fontWeight: 600 }}>→ Rēķins</Link>
            : '—'}
        </td>
      ) : (
        <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
      )}
    </tr>
  )
}
