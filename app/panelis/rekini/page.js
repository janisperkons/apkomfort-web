import { supabaseServer } from '../../../lib/server'
import { INVOICE_STATUS, d, eur } from '../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function ManiRekini() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id').eq('auth_user_id', user.id).single()
  const { data: invoices } = await sb.from('invoices')
    .select('id, invoice_number, issue_date, due_date, status, total, properties(address_line, municipality)')
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
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{inv.invoice_number}</td>
                    <td className="small muted">{inv.properties ? `${inv.properties.address_line}, ${inv.properties.municipality}` : '—'}</td>
                    <td className="small">{d(inv.issue_date)}</td>
                    <td className="small">{d(inv.due_date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(inv.total)}</td>
                    <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
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
