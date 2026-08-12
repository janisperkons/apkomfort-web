import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }

export async function POST(req, { params }) {
  const { id } = await params
  const { reason } = await req.json().catch(() => ({}))
  if (!reason || !reason.trim()) return Response.json({ error: 'Lūdzu norādiet iemeslu.' }, { status: 400 })

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: ok, error: rpcErr } = await sb.rpc('reject_quote_by_client', { p_quote_id: id, p_reason: reason })
  if (rpcErr) return Response.json({ error: 'Neizdevās noraidīt piedāvājumu.' }, { status: 500 })
  if (!ok) return Response.json({ error: 'Šo piedāvājumu pašlaik nevar noraidīt.' }, { status: 409 })

  try {
    if (process.env.MAIL_USER) {
      const { data: quote } = await sb.from('quotes')
        .select('quote_number, total, contact_name').eq('id', id).maybeSingle()
      if (quote) {
        await sendMail({
          to: process.env.MAIL_USER,
          subject: `Klients noraidīja piedāvājumu — Nr. ${quote.quote_number}`,
          html: wrapEmailHtml(`
            <p><b>${quote.contact_name}</b> noraidīja cenas piedāvājumu Nr. <b>${quote.quote_number}</b> (${eurFmt(quote.total)}).</p>
            <p>Iemesls: ${reason}</p>
          `),
          text: `${quote.contact_name} noraidīja piedāvājumu Nr. ${quote.quote_number} (${eurFmt(quote.total)}). Iemesls: ${reason}`,
        })
      }
    }
  } catch (e) {
    console.error('quote reject: notify email failed', e)
  }

  return Response.json({ ok: true })
}
