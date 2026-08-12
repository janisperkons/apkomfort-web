import Link from 'next/link'
import { supabaseServer } from '../../../lib/server'
import { dt } from '../../../lib/format'
import StatusSelect from './status-select'

export const dynamic = 'force-dynamic'

const SOURCE = {
  kalkulators: 'Kalkulators', 'plani-tiesi': 'Plāns (tieši)', kontakti: 'Kontakti', registracija: 'Reģistrācija',
}

export default async function Pieteikumi() {
  const sb = await supabaseServer()
  const { data } = await sb.from('enquiries').select('*').order('created_at', { ascending: false })
  const rows = data || []
  const newCount = rows.filter(r => (r.status || 'new') === 'new').length

  return (
    <>
      <div className="head">
        <div><h1>Jauni pieteikumi</h1>
          <div className="sub">{rows.length} kopā · {newCount} jauni</div></div>
      </div>

      <div className="card">
        <table>
          <thead><tr>
            <th>Datums</th><th>Avots</th><th>Vārds</th><th>Telefons</th>
            <th>Sistēma</th><th>Ziņa</th><th>Statuss</th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
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
                  <Link href={`/birojs/klienti/jauns?name=${encodeURIComponent(r.name || '')}&phone=${encodeURIComponent(r.phone || '')}`}
                    className="small" style={{ color: 'var(--acc)', fontWeight: 600 }}>→ Izveidot klientu</Link>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="muted">Vēl nav pieteikumu.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
