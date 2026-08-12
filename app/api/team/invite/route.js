import { supabaseServer, supabaseAdmin } from '../../../../lib/server'

export async function POST(req) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const { data: callerProfile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (callerProfile?.role !== 'admin') return Response.json({ error: 'Nav autorizēts.' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const email = (body.email || '').trim()
  const fullName = (body.fullName || '').trim()
  const role = body.role === 'admin' ? 'admin' : 'bookkeeper'
  if (!email || !fullName) return Response.json({ error: 'Norādiet e-pastu un vārdu.' }, { status: 400 })

  const admin = supabaseAdmin()
  if (!admin) {
    return Response.json({
      error: 'SUPABASE_SERVICE_ROLE_KEY nav iestatīts Vercel vidē — bez tā uzaicinājumus nosūtīt nevar.',
    }, { status: 500 })
  }

  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${new URL(req.url).origin}/jauna-parole`,
  })
  if (inviteErr || !invited?.user) {
    return Response.json({ error: inviteErr?.message || 'Neizdevās nosūtīt uzaicinājumu.' }, { status: 500 })
  }

  const { error: profileErr } = await admin.from('profiles').insert({
    id: invited.user.id, full_name: fullName, role, email,
  })
  if (profileErr) {
    return Response.json({ error: 'Uzaicinājums nosūtīts, bet neizdevās izveidot profilu: ' + profileErr.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
