import { createServerClient } from '@supabase/ssr'
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
