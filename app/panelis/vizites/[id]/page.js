import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseServer } from '../../../../lib/server'
import { JOB, JOB_STATUS, d, dt } from '../../../../lib/format'

export const dynamic = 'force-dynamic'

export default async function VizitesDetail({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: job } = await sb.from('jobs')
    .select('*, properties(id, address_line, municipality)')
    .eq('id', id).single()
  if (!job) notFound()

  let engineer = null
  if (job.engineer_id) {
    const { data } = await sb.from('profiles').select('full_name, avatar_url').eq('id', job.engineer_id).maybeSingle()
    engineer = data
  }

  const s = JOB_STATUS[job.status] || ['—', 'p-pending']
  const when = job.scheduled_for ? dt(job.scheduled_for) : (job.requested_date ? d(job.requested_date) + ' (vēlamais datums, vēl nav apstiprināts)' : 'Datums vēl nav noteikts')

  return (
    <>
      <div className="head">
        <div>
          <div className="badge">Vizīte</div>
          <h1>{JOB[job.kind] || job.kind}</h1>
          <div className="sub">
            <span className={'pill ' + s[1]}>{s[0]}</span>
            {job.urgent && <span className="pill p-declined" style={{ marginLeft: 6 }}>Steidzams</span>}
          </div>
        </div>
        <div className="right"><Link href="/panelis" className="btn ghost">← Sākums</Link></div>
      </div>

      <div className="grid g2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Vizītes informācija</h3>
          <dl className="kv">
            <dt>Laiks</dt><dd style={{ fontWeight: 600, color: 'var(--ink)' }}>{when}</dd>
            <dt>Īpašums</dt><dd>{job.properties?.address_line}, {job.properties?.municipality}</dd>
            {job.requested_notes && <><dt>Jūsu apraksts</dt><dd>{job.requested_notes}</dd></>}
          </dl>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Inženieris</h3>
          {engineer ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {engineer.avatar_url ? (
                <img src={engineer.avatar_url} alt={engineer.full_name}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--paper)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', fontSize: 20, color: 'var(--ink)' }}>
                  {engineer.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{engineer.full_name}</div>
            </div>
          ) : (
            <p className="muted small">Inženieris vēl nav piešķirts — sazināsimies, tiklīdz laiks apstiprināts.</p>
          )}
        </div>
      </div>
    </>
  )
}
