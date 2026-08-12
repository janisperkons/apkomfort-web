'use client'
import { useRouter } from 'next/navigation'
import { INVOICE_STATUS, d, eur } from '../../../lib/format'

export default function RekiniList({ invoices }) {
  const router = useRouter()

  function goTo(e, id) {
    if (e.target.closest('a, button')) return
    router.push(`/panelis/rekini/${id}`)
  }

  if (!invoices.length) return <p className="muted">Vēl nav izrakstītu rēķinu.</p>

  return (
    <table>
      <thead>
        <tr><th>Nr.</th><th>Īpašums</th><th>Izrakstīts</th><th>Termiņš</th><th>Summa</th><th>Statuss</th><th></th></tr>
      </thead>
      <tbody>
        {invoices.map(inv => {
          const s = INVOICE_STATUS[inv.status] || ['—', 'p-pending']
          return (
            <tr key={inv.id} onClick={e => goTo(e, inv.id)} style={{ cursor: 'pointer' }}>
              <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {inv.invoice_number}
                {!inv.viewed_at && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', marginLeft: 8, padding: '2px 8px',
                    borderRadius: 999, background: 'var(--acc)', color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>Jauns</span>
                )}
              </td>
              <td className="small muted">{inv.properties ? `${inv.properties.address_line}, ${inv.properties.municipality}` : '—'}</td>
              <td className="small">{d(inv.issue_date)}</td>
              <td className="small">{d(inv.due_date)}</td>
              <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
              <td>
                <span className={'pill ' + s[1]}>{s[0]}</span>
                {inv.status === 'sent' && inv.payment_reported_at && (
                  <span className="pill p-pending" style={{ marginLeft: 6 }}>Gaida apstiprinājumu</span>
                )}
              </td>
              <td>
                <a href={`/api/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer" className="btn ghost small">PDF</a>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
