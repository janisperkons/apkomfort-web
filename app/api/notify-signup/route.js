import { supabaseServer } from '../../../lib/server'
import { notifyNewCustomerSignup } from '../../../lib/notify'

export async function POST(req) {
  const body = await req.json().catch(() => ({}))
  const sb = await supabaseServer()
  await notifyNewCustomerSignup(sb, {
    fullName: body.fullName, phone: body.phone, email: body.email, isCompany: body.isCompany,
    customerId: body.customerId,
  })
  return Response.json({ ok: true })
}
