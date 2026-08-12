'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { JOB, TIER, d, dt, eur } from '../../lib/format'

function goToJob(router, e, propertyId, jobId) {
  if (e.target.closest('a, button')) return
  router.push(`/birojs/ipasumi/${propertyId}#job-${jobId}`)
}

function goToClient(router, e, customerId) {
  if (e.target.closest('a, button')) return
  router.push(`/birojs/klienti/${customerId}`)
}

export function JobRequestsTable({ requests }) {
  const router = useRouter()
  return (
    <table>
      <thead><tr><th>Klients</th><th>Adrese</th><th>Veids</th><th>Vēlamais datums</th><th></th></tr></thead>
      <tbody>
        {requests.map(j => (
          <tr key={j.id} onClick={e => goToJob(router, e, j.property_id, j.id)} style={{ cursor: 'pointer' }}>
            <td style={{ fontWeight: 600 }}>
              <Link href={`/birojs/klienti/${j.properties?.customer_id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {j.properties?.customers?.full_name}
              </Link>
              {j.urgent && <span className="pill p-declined" style={{ marginLeft: 6 }}>Steidzams</span>}
            </td>
            <td className="small muted">{j.properties?.address_line}, {j.properties?.municipality}</td>
            <td className="small">{JOB[j.kind]}</td>
            <td className="small">{j.requested_date ? d(j.requested_date) : '—'}</td>
            <td>
              <Link href={`/birojs/ipasumi/${j.property_id}`} className="btn ghost small">Apstiprināt →</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function UpcomingJobsTable({ upcoming }) {
  const router = useRouter()
  return (
    <table>
      <thead><tr><th>Datums</th><th>Veids</th><th>Klients</th><th>Adrese</th></tr></thead>
      <tbody>
        {upcoming.length ? upcoming.map(j => (
          <tr key={j.id} onClick={e => goToJob(router, e, j.property_id, j.id)} style={{ cursor: 'pointer' }}>
            <td>{dt(j.scheduled_for)}</td>
            <td>{JOB[j.kind]}</td>
            <td><Link href={`/birojs/klienti/${j.properties?.customer_id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{j.properties?.customers?.full_name}</Link></td>
            <td className="muted small"><Link href={`/birojs/ipasumi/${j.property_id}`} className="muted">{j.properties?.address_line}, {j.properties?.municipality}</Link></td>
          </tr>
        )) : <tr><td colSpan="4" className="muted">Nav ieplānotu darbu.</td></tr>}
      </tbody>
    </table>
  )
}

export function ActivePlansTable({ active }) {
  const router = useRouter()
  return (
    <table>
      <thead><tr><th>Klients</th><th>Īpašums</th><th>Plāns</th><th>Cena / mēn.</th><th>Parakstīts</th><th>Atjaunošana</th></tr></thead>
      <tbody>
        {active.map(m => (
          <tr key={m.id} onClick={e => goToClient(router, e, m.properties?.customer_id)} style={{ cursor: 'pointer' }}>
            <td style={{ fontWeight: 600 }}><Link href={`/birojs/klienti/${m.properties?.customer_id}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>{m.properties?.customers?.full_name}</Link></td>
            <td className="small"><Link href={`/birojs/ipasumi/${m.property_id}`} style={{ color: 'var(--ink)' }}>{m.properties?.address_line}, {m.properties?.municipality}</Link></td>
            <td><span className="pill p-tier">{TIER[m.tier]}</span></td>
            <td>{eur(m.monthly_price_ex_vat)}</td>
            <td className="small">{d(m.signed_on)}</td>
            <td className="small">{d(m.anniversary_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
