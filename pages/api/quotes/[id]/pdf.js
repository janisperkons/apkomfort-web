import { supabaseServerPages } from '../../../../lib/server'
import { renderQuotePdf } from '../../../../lib/quote-pdf'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })

  const { id } = req.query
  const sb = supabaseServerPages(req)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return res.status(403).json({ error: 'Nav autorizēts.' })

  const { data: quote, error: qErr } = await sb.from('quotes')
    .select('*, quote_items(*)')
    .eq('id', id).single()
  if (qErr || !quote) return res.status(404).json({ error: 'Kvote nav atrasta.' })

  const items = (quote.quote_items || []).sort((a, b) => a.sort_order - b.sort_order)

  try {
    const pdfBuffer = await renderQuotePdf({ quote, items })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="kvote-${quote.quote_number}.pdf"`)
    res.status(200).send(pdfBuffer)
  } catch (err) {
    console.error('quote pdf generation failed:', err)
    res.status(500).json({ error: 'Neizdevās izveidot PDF.' })
  }
}
