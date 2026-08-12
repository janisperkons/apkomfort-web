import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }

export async function POST(req, { params }) {
  const { id } = await params
  const { note } = await req.json().catch(() => ({}))

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: ok, error: rpcErr } = await sb.rpc('report_invoice_payment', { p_invoice_id: id, p_note: note || null })
  if (rpcErr) return Response.json({ error: 'Neizdevās reģistrēt maksājumu.' }, { status: 500 })
  if (!ok) return Response.json({ error: 'Šo rēķinu pašlaik nevar atzīmēt — iespējams, tas vēl nav nosūtīts vai jau apstiprināts.' }, { status: 409 })

  // Best-effort staff notification — the report itself is already saved
  // above regardless of whether this email goes out.
  try {
    if (process.env.MAIL_USER) {
      const { data: invoice } = await sb.from('invoices')
        .select('invoice_number, total, payment_reported_note, customers(full_name, company_name)')
        .eq('id', id).maybeSingle()
      if (invoice) {
        const clientName = invoice.customers?.company_name || invoice.customers?.full_name || 'Klients'
        await sendMail({
          to: process.env.MAIL_USER,
          subject: `Klients ziņo par apmaksu — rēķins Nr. ${invoice.invoice_number}`,
          html: wrapEmailHtml(`
            <p><b>${clientName}</b> atzīmēja rēķinu Nr. <b>${invoice.invoice_number}</b> (${eurFmt(invoice.total)}) kā apmaksātu.</p>
            ${invoice.payment_reported_note ? `<p>Klienta paskaidrojums: ${invoice.payment_reported_note}</p>` : ''}
            <p>Lūdzu pārbaudiet kontā, vai maksājums tiešām saņemts, un tad apstipriniet rēķinu birojā.</p>
          `),
          text: `${clientName} atzīmēja rēķinu Nr. ${invoice.invoice_number} (${eurFmt(invoice.total)}) kā apmaksātu.${invoice.payment_reported_note ? ` Paskaidrojums: ${invoice.payment_reported_note}` : ''} Pārbaudiet un apstipriniet birojā.`,
        })
      }
    }
  } catch (e) {
    console.error('report-payment: notify email failed', e)
  }

  return Response.json({ ok: true })
}
