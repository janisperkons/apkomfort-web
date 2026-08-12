import { supabaseServer } from '../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../lib/mailer'
import { JOB } from '../../../lib/format'

const MONTHS_LOCATIVE = [
  'janvārī', 'februārī', 'martā', 'aprīlī', 'maijā', 'jūnijā',
  'jūlijā', 'augustā', 'septembrī', 'oktobrī', 'novembrī', 'decembrī',
]

function formatVisitDate(iso) {
  if (!iso) return null
  const dt = new Date(iso)
  return `${dt.getDate()}. ${MONTHS_LOCATIVE[dt.getMonth()]}`
}

function formatVisitDateTime(iso) {
  if (!iso) return null
  const dt = new Date(iso)
  const date = formatVisitDate(iso)
  const hh = String(dt.getHours()).padStart(2, '0')
  const mm = String(dt.getMinutes()).padStart(2, '0')
  return `${date} plkst. ${hh}:${mm}`
}

export async function POST(request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!staffProfile) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  let body
  try { body = await request.json() } catch { body = {} }
  const { jobId } = body || {}
  if (!jobId) return Response.json({ error: 'Trūkst darba ID.' }, { status: 400 })

  const { data: job, error: jobErr } = await sb.from('jobs')
    .select('*, equipment(manufacturer, model), properties(address_line, municipality, customers(full_name, email))')
    .eq('id', jobId).single()

  if (jobErr || !job) return Response.json({ error: 'Darbs nav atrasts.' }, { status: 404 })

  const customer = job.properties?.customers
  if (!customer?.email) return Response.json({ error: 'Klientam nav norādīts e-pasts.' }, { status: 400 })

  const kindLabel = JOB[job.kind] || job.kind
  const dateOnly = formatVisitDate(job.scheduled_for)
  const dateTime = formatVisitDateTime(job.scheduled_for)
  const address = [job.properties?.address_line, job.properties?.municipality].filter(Boolean).join(', ')

  const subject = dateOnly ? `Apkope ieplānota — ${dateOnly}` : 'Apkope ieplānota'

  const bodyHtml = `
    <p>Labdien, ${customer.full_name || ''}!</p>
    <p>Informējam, ka Jūsu vizīte — <b>${kindLabel}</b>${job.equipment ? ` (${job.equipment.manufacturer} ${job.equipment.model})` : ''} — ir ieplānota${dateTime ? ` <b>${dateTime}</b>` : ''}.</p>
    ${address ? `<p>Adrese: ${address}</p>` : ''}
    <p>Ja izvēlētais laiks Jums neder, lūdzu, sazinieties ar mums, lai vienotos par citu laiku.</p>
    <p>Uz tikšanos!</p>
  `

  try {
    await sendMail({
      to: customer.email,
      subject,
      html: wrapEmailHtml(bodyHtml),
      text: `Jūsu vizīte (${kindLabel}) ir ieplānota${dateTime ? ` ${dateTime}` : ''}.${address ? ` Adrese: ${address}.` : ''}`,
    })
  } catch (err) {
    console.error('send-visit-email failed:', err)
    return Response.json({ error: 'Neizdevās nosūtīt e-pastu.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
