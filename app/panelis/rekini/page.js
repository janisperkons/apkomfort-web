import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { INVOICE_STATUS, d, eur } from '../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function ManiRekini() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id').eq('auth_user_id', user.id).single()
  const { data: invoices } = await sb.from('invoices')
    .select('id, invoice_number, issue_date, due_date, status, total, viewed_at, payment_reported_at, properties(address_line, municipality)')
    .eq('customer_id', customer.id)
    .order('issue_date', { ascending: false })

  return (
    <>
      <div className="head"><div><h1>Mani rēķini</h1></div></div>
      <div className="card">
        {(invoices || []).length ? (
          <table>
            <thead>
              <tr><th>Nr.</th><th>Īpašums</th><th>Izrakstīts</th><th>Termiņš</th><th>Summa</th><th>Statuss</th><th></th></tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const s = INVOICE_STATUS[inv.status] || ['—', 'p-pending']
                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      <Link href={`/panelis/rekini/${inv.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{inv.invoice_number}</Link>
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
        ) : <p className="muted">Vēl nav izrakstītu rēķinu.</p>}
      </div>
    </>
  )
}
