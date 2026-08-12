import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import { QUOTE_STATUS, d, eur } from '../../../lib/format'

export const dynamic = 'force-dynamic'

function TameRow({ q, showInvoiceLink }) {
  const s = QUOTE_STATUS[q.status] || ['—', 'p-pending']
  return (
    <tr key={q.id}>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/birojs/tames/${q.id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{q.quote_number}</Link>
      </td>
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

export default async function Tames() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const { data: quotes } = await sb.from('quotes')
    .select('id, quote_number, contact_name, contact_email, status, total, valid_until, created_at, customer_id, converted_invoice_id')
    .order('created_at', { ascending: false })

  const all = quotes || []
  const draftTames = all.filter(q => q.status === 'draft')
  const pendingTames = all.filter(q => q.status === 'sent')
  const approvedTames = all.filter(q => q.status === 'accepted')
  const historyTames = all.filter(q => q.status === 'declined' || q.status === 'expired')

  return (
    <>
      <div className="head">
        <div><h1>Tāmes</h1><div className="sub">Cenas piedāvājumi darbiem — pirms rēķina, pirms klients ir apstiprināts.</div></div>
        <div className="right"><Link href="/birojs/tames/jauna" className="btn">+ Jauna tāme</Link></div>
      </div>

      {draftTames.length > 0 && (
        <div className="card sec">
          <h2 className="sec" style={{ marginBottom: 12 }}>Melnraksti</h2>
          <table>
            <thead><tr><th>Nr.</th><th>Adresāts</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th></tr></thead>
            <tbody>{draftTames.map(q => <TameRow key={q.id} q={q} />)}</tbody>
          </table>
        </div>
      )}

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Gaida klienta apstiprinājumu</h2>
        <table>
          <thead><tr><th>Nr.</th><th>Adresāts</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th></tr></thead>
          <tbody>
            {pendingTames.length ? pendingTames.map(q => <TameRow key={q.id} q={q} />)
              : <tr><td colSpan="6" className="muted">Nav nosūtītu tāmju, kas gaida atbildi.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Apstiprinātas</h2>
        <table>
          <thead><tr><th>Nr.</th><th>Adresāts</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Rēķins</th></tr></thead>
          <tbody>
            {approvedTames.length ? approvedTames.map(q => <TameRow key={q.id} q={q} showInvoiceLink />)
              : <tr><td colSpan="6" className="muted">Vēl nav apstiprinātu tāmju.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card sec">
        <h2 className="sec" style={{ marginBottom: 12 }}>Vēsture</h2>
        <table>
          <thead><tr><th>Nr.</th><th>Adresāts</th><th>Izveidota</th><th>Derīga līdz</th><th>Summa</th><th>Statuss</th></tr></thead>
          <tbody>
            {historyTames.length ? historyTames.map(q => <TameRow key={q.id} q={q} />)
              : <tr><td colSpan="6" className="muted">Nav noraidītu vai beigušos tāmju.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
