import { supabaseServer } from '../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../lib/mailer'

function firstName(fullName) {
  if (!fullName) return ''
  return fullName.trim().split(/\s+/)[0] || ''
}

export async function POST(request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!staffProfile) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  let body
  try { body = await request.json() } catch { body = {} }
  const { subject, message } = body || {}
  if (typeof subject !== 'string' || !subject.trim() || typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'Norādiet gan tēmu, gan ziņas tekstu.' }, { status: 400 })
  }

  const { data: customers, error: custErr } = await sb.from('customers')
    .select('id, full_name, email').eq('marketing_consent', true).not('email', 'is', null)

  if (custErr) return Response.json({ error: 'Neizdevās ielādēt klientu sarakstu.' }, { status: 500 })

  const recipients = customers || []
  const messageHtml = message.trim().split('\n').map(line => line || '&nbsp;').join('<br>')

  let sent = 0
  let failed = 0

  for (const customer of recipients) {
    const greetName = firstName(customer.full_name)
    const bodyHtml = `
      <p>Labdien${greetName ? `, ${greetName}` : ''}!</p>
      <p>${messageHtml}</p>
      <p style="margin-top:24px;font-size:12.5px;color:#8a8578">
        Ja nevēlaties turpmāk saņemt šādus e-pastus,
        <a href="https://www.apkomforts.com/atteikties/${customer.id}" style="color:#8a8578;text-decoration:underline">atteikties šeit</a>.
      </p>
    `
    try {
      await sendMail({
        to: customer.email,
        subject: subject.trim(),
        html: wrapEmailHtml(bodyHtml),
        text: message.trim(),
      })
      sent++
    } catch (err) {
      console.error('send-marketing failed for', customer.id, err)
      failed++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  return Response.json({ sent, failed })
}
