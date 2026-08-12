import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'
import { JOB, d } from '../../../../../lib/format'

export async function POST(req, { params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  // Best-effort: the visit request itself was already saved by the caller
  // (RLS already scopes this to the requesting customer's own job row) —
  // a failure here should never surface as an error to the client.
  try {
    if (process.env.MAIL_USER) {
      const { data: job } = await sb.from('jobs')
        .select('kind, urgent, requested_date, requested_notes, property_id, properties(address_line, municipality, customers(full_name, phone))')
        .eq('id', id).maybeSingle()
      if (job) {
        const customer = job.properties?.customers
        const address = [job.properties?.address_line, job.properties?.municipality].filter(Boolean).join(', ')
        await sendMail({
          to: process.env.MAIL_USER,
          subject: `${job.urgent ? '[STEIDZAMS] ' : ''}Jauns vizītes pieteikums — ${customer?.full_name || 'klients'}`,
          html: wrapEmailHtml(`
            <p><b>${customer?.full_name || 'Klients'}</b> pieteica vizīti: <b>${JOB[job.kind] || job.kind}</b>${job.urgent ? ' <b>(steidzami)</b>' : ''}.</p>
            <p>Adrese: ${address || '—'}<br>Telefons: ${customer?.phone || '—'}</p>
            ${job.requested_date ? `<p>Vēlamais datums: <b>${d(job.requested_date)}</b></p>` : ''}
            ${job.requested_notes ? `<p>Piezīme: ${job.requested_notes}</p>` : ''}
            <p>Piešķiriet speciālistu un apstipriniet laiku birojā — Īpašumi vai Darbi.</p>
          `),
          text: `${customer?.full_name || 'Klients'} pieteica vizīti: ${JOB[job.kind] || job.kind}.${job.urgent ? ' STEIDZAMI.' : ''} Adrese: ${address || '—'}. Telefons: ${customer?.phone || '—'}.${job.requested_date ? ` Vēlamais datums: ${d(job.requested_date)}.` : ''} Piešķiriet speciālistu un apstipriniet laiku.`,
        })
      }
    }
  } catch (e) {
    console.error('notify-request: email failed', e)
  }

  return Response.json({ ok: true })
}
