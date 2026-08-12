import { supabaseServerPages } from '../../../../lib/server'
import { renderInvoicePdf } from '../../../../lib/invoice-pdf'
import { sendMail, wrapEmailHtml } from '../../../../lib/mailer'

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }
function dateFmt(v) {
  if (!v) return null
  const dt = new Date(v)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${dt.getFullYear()}`
}

const PAYMENT_TERMS_LABEL = {
  full_on_completion: 'Pilna apmaksa pēc darbu pabeigšanas.',
  partial_upfront: 'Nepieciešama daļēja apmaksa pirms darbu sākuma, atlikums pēc pabeigšanas.',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { id } = req.query
  const { paymentTerms } = req.body || {}
  if (!PAYMENT_TERMS_LABEL[paymentTerms]) {
    return res.status(400).json({ error: 'Jānorāda apmaksas nosacījumi (pilna apmaksa vai daļēja apmaksa pirms darba).' })
  }

  const sb = supabaseServerPages(req)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return res.status(403).json({ error: 'Nav autorizēts.' })

  const { data: staffProfile } = await sb.from('profiles').select('id, role').eq('id', user.id).maybeSingle()
  if (!staffProfile || staffProfile.role !== 'admin') return res.status(403).json({ error: 'Nav autorizēts.' })

  const { data: invoice, error: invErr } = await sb.from('invoices')
    .select('*, invoice_items(*), customers(full_name, email, customer_type, company_name, registration_number, legal_address, vat_number), properties(address_line, municipality)')
    .eq('id', id).single()
  if (invErr || !invoice) return res.status(404).json({ error: 'Rēķins nav atrasts.' })

  const customer = invoice.customers
  if (!customer?.email) return res.status(400).json({ error: 'Klientam nav norādīts e-pasts.' })
  invoice.payment_terms = paymentTerms

  const items = (invoice.invoice_items || []).sort((a, b) => a.sort_order - b.sort_order)

  try {
    const pdfBuffer = await renderInvoicePdf({
      invoice, items, customer, property: invoice.properties,
    })

    const dueLabel = dateFmt(invoice.due_date) || 'pēc vienošanās'
    const bodyHtml = `
      <p>Labdien, ${customer.full_name || ''}!</p>
      <p>Pielikumā rēķins Nr. <b>${invoice.invoice_number}</b> par summu <b>${eurFmt(invoice.total)}</b>.</p>
      <p>Apmaksas termiņš: ${dueLabel}.</p>
      <p>${PAYMENT_TERMS_LABEL[paymentTerms]}</p>
    `

    await sendMail({
      to: customer.email,
      subject: `Rēķins Nr. ${invoice.invoice_number} — AP Komforts`,
      html: wrapEmailHtml(bodyHtml),
      text: `Pielikumā rēķins Nr. ${invoice.invoice_number} par summu ${eurFmt(invoice.total)}. Apmaksas termiņš: ${dueLabel}. ${PAYMENT_TERMS_LABEL[paymentTerms]}`,
      attachments: [{ filename: `rekins-${invoice.invoice_number}.pdf`, content: pdfBuffer }],
    })

    const sentAt = new Date().toISOString()
    const { error: updErr } = await sb.from('invoices')
      .update({ status: 'sent', sent_at: sentAt, payment_terms: paymentTerms }).eq('id', id)
    if (updErr) throw updErr

    res.status(200).json({ ok: true, sentAt })
  } catch (err) {
    console.error('send invoice failed:', err)
    res.status(500).json({ error: 'Neizdevās nosūtīt rēķinu.' })
  }
}
