import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_KEY } from './config'

export async function supabaseServer() {
  const store = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name) { return store.get(name)?.value },
      set() {},
      remove() {},
    },
  })
}

// For Pages Router API routes (no next/headers access) — used only by the
// invoice PDF routes under pages/api/, which live outside the App Router on
// purpose to avoid a module-graph incompatibility between Next's React
// Server Components conditions and @react-pdf/renderer's custom reconciler
// (see the comment at the top of lib/invoice-pdf.js).
export function supabaseServerPages(req) {
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name) { return req.cookies[name] },
      set() {},
      remove() {},
    },
  })
}

// Service-role client — bypasses RLS entirely. Only ever call this from
// server-only code (Route Handlers) that has already verified the caller is
// an admin; never expose SUPABASE_SERVICE_ROLE_KEY to the browser. Used for
// auth.admin operations (inviting team members) that the publishable key
// can't do. Returns null if the key isn't configured yet.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createClient(SUPABASE_URL, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
