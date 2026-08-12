import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'
import { d } from '../../../../../lib/format'

function eurFmt(n) { return '€' + Number(n || 0).toFixed(2).replace('.', ',') }

export async function POST(req, { params }) {
  const { id } = await params
  const { proposedStartDate } = await req.json().catch(() => ({}))

  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: ok, error: rpcErr } = await sb.rpc('approve_quote_by_client', {
    p_quote_id: id, p_proposed_start_date: proposedStartDate || null,
  })
  if (rpcErr) return Response.json({ error: 'Neizdevās apstiprināt piedāvājumu.' }, { status: 500 })
  if (!ok) return Response.json({ error: 'Šo piedāvājumu pašlaik nevar apstiprināt.' }, { status: 409 })

  try {
    if (process.env.MAIL_USER) {
      const { data: quote } = await sb.from('quotes')
        .select('quote_number, total, contact_name, client_proposed_start_date').eq('id', id).maybeSingle()
      if (quote) {
        const dateLine = quote.client_proposed_start_date
          ? `<p>Ierosinātais darba sākuma datums: <b>${d(quote.client_proposed_start_date)}</b>.</p>` : ''
        await sendMail({
          to: process.env.MAIL_USER,
          subject: `Klients apstiprināja piedāvājumu — Nr. ${quote.quote_number}`,
          html: wrapEmailHtml(`
            <p><b>${quote.contact_name}</b> apstiprināja cenas piedāvājumu Nr. <b>${quote.quote_number}</b> (${eurFmt(quote.total)}).</p>
            ${dateLine}
            <p>Lūdzu vienojieties par darba sākuma datumu un pabeidziet apstiprināšanu birojā (Tāmes), lai izveidotu rēķinu.</p>
          `),
          text: `${quote.contact_name} apstiprināja piedāvājumu Nr. ${quote.quote_number} (${eurFmt(quote.total)}).${quote.client_proposed_start_date ? ` Ierosinātais sākums: ${d(quote.client_proposed_start_date)}.` : ''} Pabeidziet apstiprināšanu birojā.`,
        })
      }
    }
  } catch (e) {
    console.error('quote approve: notify email failed', e)
  }

  return Response.json({ ok: true })
}
