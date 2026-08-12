import { supabaseServerPages } from '../../../../lib/server'
import { renderInvoicePdf } from '../../../../lib/invoice-pdf'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const { id } = req.query
  const sb = supabaseServerPages(req)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return res.status(403).json({ error: 'Nav autorizēts.' })

  // No separate staff-only gate here — RLS on invoices/invoice_items already
  // scopes this to staff (staff_all) or the invoice's own customer
  // (customer_self_select), so a blocked/nonexistent row both read as 404.
  const { data: invoice, error: invErr } = await sb.from('invoices')
    .select('*, invoice_items(*), customers(full_name, email, customer_type, company_name, registration_number, legal_address, vat_number), properties(address_line, municipality)')
    .eq('id', id).single()
  if (invErr || !invoice) return res.status(404).json({ error: 'Rēķins nav atrasts.' })

  const items = (invoice.invoice_items || []).sort((a, b) => a.sort_order - b.sort_order)

  try {
    const pdfBuffer = await renderInvoicePdf({
      invoice, items, customer: invoice.customers, property: invoice.properties,
    })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="rekins-${invoice.invoice_number}.pdf"`)
    res.status(200).send(pdfBuffer)
  } catch (err) {
    console.error('invoice pdf generation failed:', err)
    res.status(500).json({ error: 'Neizdevās izveidot PDF.' })
  }
}
