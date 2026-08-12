import { supabaseServerPages } from '../../../../lib/server'
import { renderQuotePdf } from '../../../../lib/quote-pdf'
import { sendMail, wrapEmailHtml } from '../../../../lib/mailer'

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }
function dateFmt(v) {
  if (!v) return null
  const dt = new Date(v)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${dt.getFullYear()}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const { id } = req.query
  const sb = supabaseServerPages(req)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return res.status(403).json({ error: 'Nav autorizēts.' })

  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!staffProfile) return res.status(403).json({ error: 'Nav autorizēts.' })

  const { data: quote, error: qErr } = await sb.from('quotes')
    .select('*, quote_items(*)')
    .eq('id', id).single()
  if (qErr || !quote) return res.status(404).json({ error: 'Kvote nav atrasta.' })
  if (!quote.contact_email) return res.status(400).json({ error: 'Nav norādīts e-pasts.' })

  const items = (quote.quote_items || []).sort((a, b) => a.sort_order - b.sort_order)

  try {
    const pdfBuffer = await renderQuotePdf({ quote, items })

    const validLabel = dateFmt(quote.valid_until)
    const bodyHtml = `
      <p>Labdien, ${quote.contact_name || ''}!</p>
      <p>Pielikumā cenas piedāvājums Nr. <b>${quote.quote_number}</b> par summu <b>${eurFmt(quote.total)}</b>.</p>
      ${validLabel ? `<p>Derīgs līdz: ${validLabel}.</p>` : ''}
      <p>Ja piedāvājums der, atbildiet uz šo e-pastu vai piezvaniet, un mēs vienosimies par darbu izpildes laiku.</p>
    `

    await sendMail({
      to: quote.contact_email,
      subject: `Cenas piedāvājums Nr. ${quote.quote_number} — AP Komforts`,
      html: wrapEmailHtml(bodyHtml),
      text: `Pielikumā cenas piedāvājums Nr. ${quote.quote_number} par summu ${eurFmt(quote.total)}.${validLabel ? ` Derīgs līdz: ${validLabel}.` : ''}`,
      attachments: [{ filename: `kvote-${quote.quote_number}.pdf`, content: pdfBuffer }],
    })

    const sentAt = new Date().toISOString()
    const { error: updErr } = await sb.from('quotes')
      .update({ status: 'sent', sent_at: sentAt }).eq('id', id)
    if (updErr) throw updErr

    res.status(200).json({ ok: true, sentAt })
  } catch (err) {
    console.error('send quote failed:', err)
    res.status(500).json({ error: 'Neizdevās nosūtīt piedāvājumu.' })
  }
}
