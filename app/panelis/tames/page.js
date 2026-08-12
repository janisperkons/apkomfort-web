import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { QUOTE_STATUS, d, eur } from '../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function ManasTames() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: customer } = await sb.from('customers').select('id').eq('auth_user_id', user.id).single()
  const { data: quotes } = await sb.from('quotes')
    .select('id, quote_number, created_at, valid_until, status, total, viewed_at, property_address')
    .eq('customer_id', customer.id)
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="head"><div><h1>Manas tāmes</h1></div></div>
      <div className="card">
        {(quotes || []).length ? (
          <table>
            <thead>
              <tr><th>Nr.</th><th>Īpašums</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th><th></th></tr>
            </thead>
            <tbody>
              {quotes.map(q => {
                const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']
                return (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      <Link href={`/panelis/tames/${q.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{q.quote_number}</Link>
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
        ) : <p className="muted">Vēl nav saņemtu tāmju.</p>}
      </div>
    </>
  )
}
