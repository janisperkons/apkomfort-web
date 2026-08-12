import { sendMail, wrapEmailHtml } from './mailer'

// Best-effort: a failure here should never block account creation. Records
// the signup as a "pieteikums" (so it shows up — and counts — in Jauni
// pieteikumi like any other lead) and emails staff. Call this once, right
// after the customers row is created, from whichever registration path ran.
export async function notifyNewCustomerSignup(sb, { fullName, phone, email, isCompany }) {
  try {
    await sb.from('enquiries').insert({
      source: 'registracija',
      name: fullName || null,
      phone: phone || null,
      email: email || null,
      message: isCompany ? 'Jauns uzņēmuma konts reģistrēts vietnē.' : 'Jauns klienta konts reģistrēts vietnē.',
      status: 'new',
    })
  } catch (e) {
    console.error('notifyNewCustomerSignup: enquiries insert failed', e)
  }

  try {
    if (process.env.MAIL_USER) {
      await sendMail({
        to: process.env.MAIL_USER,
        subject: `Jauns klients reģistrējies — ${fullName || 'nezināms vārds'}`,
        html: wrapEmailHtml(`
          <p>Vietnē reģistrējies jauns klients:</p>
          <p><b>${fullName || '—'}</b><br>${phone || '—'}<br>${email || '—'}</p>
          <p>Skatiet birojā: <b>Jauni pieteikumi</b> vai <b>Klienti</b>.</p>
        `),
        text: `Jauns klients reģistrējies: ${fullName || '—'} · ${phone || '—'} · ${email || '—'}`,
      })
    }
  } catch (e) {
    console.error('notifyNewCustomerSignup: email failed', e)
  }
}
