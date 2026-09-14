'use client'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { dt } from '../../../lib/format'
import StatusSelect from './status-select'

const SOURCE = {
  kalkulators: 'Kalkulators', 'plani-tiesi': 'Plāns (tieši)', kontakti: 'Kontakti', registracija: 'Reģistrācija', maja: 'Mājas lapa',
}

// Builds the create-client link with everything the enquiry already knows,
// so nothing gets retyped in the back office.
function createClientHref(r) {
  const params = new URLSearchParams()
  if (r.name) params.set('name', r.name)
  if (r.phone) params.set('phone', r.phone)
  if (r.email) params.set('email', r.email)
  if (r.address) params.set('address', r.address)
  params.set('enquiryId', r.id)
  return `/birojs/klienti/jauns?${params.toString()}`
}

export default function PieteikumiRows({ rows }) {
  const router = useRouter()
  const [openId, setOpenId] = useState(null)

  function toggle(e, id) {
    if (e.target.closest('a, button, select, option, input')) return
    setOpenId(openId === id ? null : id)
  }

  if (!rows.length) return <tr><td colSpan="7" className="muted">Vēl nav pieteikumu.</td></tr>

  return (
    <>
      {rows.map(r => (
        <Fragment key={r.id}>
          <tr onClick={e => toggle(e, r.id)} style={{ cursor: 'pointer' }}>
            <td className="small">{dt(r.created_at)}</td>
            <td className="small muted">{SOURCE[r.source] || r.source || '—'}</td>
            <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.name || '—'}</td>
            <td><a href={`tel:${(r.phone || '').split(' ').join('')}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>{r.phone || '—'}</a></td>
            <td className="small">
              {r.system_type || '—'}
              {r.system_age ? <div className="muted">{r.system_age}</div> : null}
            </td>
            <td className="small muted" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.message || '—'}</td>
            <td>
              <StatusSelect id={r.id} status={r.status} />
            </td>
          </tr>
          {openId === r.id && (
            <tr>
              <td colSpan="7" style={{ background: 'var(--pending-bg, #FBF0DA)', borderRadius: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 34px', padding: '10px 6px', alignItems: 'flex-start' }}>
                  <div>
                    <div className="small muted" style={{ textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '.08em' }}>Kontakti</div>
                    <div style={{ fontWeight: 600 }}>{r.name || '—'}</div>
                    <div className="small"><a href={`tel:${(r.phone || '').split(' ').join('')}`}>{r.phone || '—'}</a></div>
                    {r.email && <div className="small"><a href={`mailto:${r.email}`}>{r.email}</a></div>}
                    {r.address && <div className="small muted">{r.address}</div>}
                  </div>
                  {(r.system_type || r.system_age || r.property_size || r.service_history) && (
                    <div>
                      <div className="small muted" style={{ textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '.08em' }}>Sistēma</div>
                      {r.system_type && <div className="small">{r.system_type}</div>}
                      {r.system_age && <div className="small muted">{r.system_age}</div>}
                      {r.property_size && <div className="small muted">{r.property_size}</div>}
                      {r.service_history && <div className="small muted">{r.service_history}</div>}
                    </div>
                  )}
                  {r.message && (
                    <div style={{ maxWidth: 420 }}>
                      <div className="small muted" style={{ textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '.08em' }}>Ziņa</div>
                      <div className="small" style={{ whiteSpace: 'pre-wrap' }}>{r.message}</div>
                    </div>
                  )}
                  <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    {r.customer_id ? (
                      <Link href={`/birojs/klienti/${r.customer_id}`} className="btn small">Atvērt klientu →</Link>
                    ) : (
                      <Link href={createClientHref(r)} className="btn small">Izveidot klientu →</Link>
                    )}
                    <a href={`tel:${(r.phone || '').split(' ').join('')}`} className="btn ghost small">Zvanīt</a>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </Fragment>
      ))}
    </>
  )
}
