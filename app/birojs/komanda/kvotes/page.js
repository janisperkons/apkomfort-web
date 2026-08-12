import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { QUOTE_STATUS, d, eur } from '../../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function Kvotes() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const { data: quotes } = await sb.from('quotes')
    .select('id, quote_number, contact_name, contact_email, status, total, valid_until, created_at, customer_id')
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="head">
        <div><h1>Kvotes</h1><div className="sub">Cenas piedāvājumi darbiem — pirms rēķina, pirms klients ir apstiprināts.</div></div>
        <div className="right"><Link href="/birojs/komanda/kvotes/jauna" className="btn">+ Jauna kvote</Link></div>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Nr.</th><th>Adresāts</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th></tr></thead>
          <tbody>
            {(quotes || []).length ? quotes.map(q => {
              const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']
              return (
                <tr key={q.id}>
                  <td style={{ fontWeight: 600 }}>
                    <Link href={`/birojs/komanda/kvotes/${q.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{q.quote_number}</Link>
                  </td>
                  <td className="small">
                    {q.contact_name}
                    {q.contact_email && <div className="small muted">{q.contact_email}</div>}
                  </td>
                  <td className="small">{d(q.created_at)}</td>
                  <td className="small">{d(q.valid_until)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{eur(q.total)}</td>
                  <td><span className={'pill ' + s[1]}>{s[0]}</span></td>
                </tr>
              )
            }) : <tr><td colSpan="6" className="muted">Vēl nav izveidotu kvošu.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
