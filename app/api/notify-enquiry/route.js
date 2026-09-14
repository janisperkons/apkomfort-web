import { sendMail, wrapEmailHtml, escapeHtml } from '../../../lib/mailer'

// Best-effort staff notification for every public enquiry (contact form,
// calculator, office form). Deliberately unauthenticated — these forms are
// anonymous — so everything user-supplied is escaped and nothing here can
// write to the database. The enquiry row itself is inserted by the caller;
// a failure here never blocks the enquiry.

const SOURCE_LABEL = {
  kontakti: 'Kontaktu forma',
  kalkulators: 'Kalkulators',
  'plani-tiesi': 'Plāns (tieši)',
  maja: 'Mājas lapa (birojs)',
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}))
  const { name, phone, email, address, source, message } = body

  try {
    if (process.env.MAIL_USER) {
      await sendMail({
        to: process.env.MAIL_USER,
        subject: `Jauns pieteikums — ${name || 'nezināms vārds'}`,
        html: wrapEmailHtml(`
          <p>Saņemts jauns pieteikums (${escapeHtml(SOURCE_LABEL[source] || source || 'vietne')}):</p>
          <p><b>${escapeHtml(name) || '—'}</b><br>
          ${escapeHtml(phone) || '—'}<br>
          ${email ? escapeHtml(email) + '<br>' : ''}
          ${address ? 'Adrese: ' + escapeHtml(address) + '<br>' : ''}</p>
          ${message ? `<p>${escapeHtml(message)}</p>` : ''}
          <p>Skatiet birojā: <b>Jauni pieteikumi</b>.</p>
        `),
        text: `Jauns pieteikums (${SOURCE_LABEL[source] || source || 'vietne'}): ${name || '—'} · ${phone || '—'}${email ? ' · ' + email : ''}${address ? ' · ' + address : ''}${message ? ' · ' + message : ''}`,
      })
    }
  } catch (e) {
    console.error('notify-enquiry: email failed', e)
  }

  return Response.json({ ok: true })
}
