import { supabaseServer } from '../../../../../lib/server'
import { sendMail, wrapEmailHtml } from '../../../../../lib/mailer'
import { generateClientCode } from '../../../../../lib/clientCode'

export async function POST(req, { params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })
  const { data: staffProfile } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!staffProfile) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: customer, error: custErr } = await sb.from('customers')
    .select('id, full_name, company_name, customer_type, email, client_code, properties(id, address_line, postcode, assigned_engineer, created_at)')
    .eq('id', id).single()
  if (custErr || !customer) return Response.json({ error: 'Klients nav atrasts.' }, { status: 404 })

  const properties = (customer.properties || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const engineerId = properties.map(p => p.assigned_engineer).find(Boolean)
  let engineerName = null
  if (engineerId) {
    const { data: eng } = await sb.from('profiles').select('full_name').eq('id', engineerId).maybeSingle()
    engineerName = eng?.full_name || null
  }

  // The registration number doubles as the future contract number, so it's
  // generated once here (on approval) and never touched again.
  let clientCode = customer.client_code
  if (!clientCode) {
    const primaryProperty = properties[0]
    const base = generateClientCode({
      addressLine: primaryProperty?.address_line,
      postcode: primaryProperty?.postcode,
      fullName: customer.customer_type === 'commercial' ? customer.company_name : customer.full_name,
    })
    const { data: taken } = await sb.from('customers').select('client_code').like('client_code', `${base}%`)
    const usedCodes = new Set((taken || []).map(t => t.client_code))
    clientCode = base
    let n = 2
    while (usedCodes.has(clientCode)) { clientCode = `${base}-${n}`; n++ }
  }

  const { error: updErr } = await sb.from('customers')
    .update({ approved_at: new Date().toISOString(), client_code: clientCode }).eq('id', id)
  if (updErr) return Response.json({ error: 'Neizdevās apstiprināt.' }, { status: 500 })

  // Approving is what "handles" this client's enquiry (however they first
  // came in) — mark it converted so it drops out of the active Jauni
  // pieteikumi view instead of sitting there marked "new" forever.
  await sb.from('enquiries').update({ status: 'converted' }).eq('customer_id', id)

  const displayName = customer.customer_type === 'commercial' && customer.company_name ? customer.company_name : customer.full_name

  if (customer.email) {
    try {
      await sendMail({
        to: customer.email,
        subject: 'Jūsu konts apstiprināts — AP Komforts',
        html: wrapEmailHtml(`
          <p>Labdien, ${displayName}!</p>
          <p>Priecājamies apstiprināt — jūsu konts ir pievienots mūsu klientu sarakstam.</p>
          <p>Jūsu klienta numurs: <b>${clientCode}</b>.</p>
          ${engineerName ? `<p>Jums piešķirtais inženieris: <b>${engineerName}</b>.</p>` : ''}
          <p>Ja rodas jautājumi vai nepieciešama vizīte, sazinieties ar mums vai piesakiet to tieši savā kontā.</p>
        `),
        text: `Jūsu konts apstiprināts un pievienots klientu sarakstam.${engineerName ? ` Piešķirtais inženieris: ${engineerName}.` : ''}`,
      })
    } catch (e) {
      console.error('approve: email failed', e)
    }
  }

  return Response.json({ ok: true, clientCode })
}
