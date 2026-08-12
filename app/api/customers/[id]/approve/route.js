import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'

export async function POST(req, { params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })
  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!staffProfile) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: customer, error: custErr } = await sb.from('customers')
    .select('id, full_name, company_name, customer_type, email, properties(id, assigned_engineer)')
    .eq('id', id).single()
  if (custErr || !customer) return Response.json({ error: 'Klients nav atrasts.' }, { status: 404 })

  const engineerId = (customer.properties || []).map(p => p.assigned_engineer).find(Boolean)
  let engineerName = null
  if (engineerId) {
    const { data: eng } = await sb.from('profiles').select('full_name').eq('id', engineerId).maybeSingle()
    engineerName = eng?.full_name || null
  }

  const { error: updErr } = await sb.from('customers').update({ approved_at: new Date().toISOString() }).eq('id', id)
  if (updErr) return Response.json({ error: 'Neizdevās apstiprināt.' }, { status: 500 })

  const displayName = customer.customer_type === 'commercial' && customer.company_name ? customer.company_name : customer.full_name

  if (customer.email) {
    try {
      await sendMail({
        to: customer.email,
        subject: 'Jūsu konts apstiprināts — AP Komforts',
        html: wrapEmailHtml(`
          <p>Labdien, ${displayName}!</p>
          <p>Priecājamies apstiprināt — jūsu konts ir pievienots mūsu klientu sarakstam.</p>
          ${engineerName ? `<p>Jums piešķirtais inženieris: <b>${engineerName}</b>.</p>` : ''}
          <p>Ja rodas jautājumi vai nepieciešama vizīte, sazinieties ar mums vai piesakiet to tieši savā kontā.</p>
        `),
        text: `Jūsu konts apstiprināts un pievienots klientu sarakstam.${engineerName ? ` Piešķirtais inženieris: ${engineerName}.` : ''}`,
      })
    } catch (e) {
      console.error('approve: email failed', e)
    }
  }

  return Response.json({ ok: true })
}
