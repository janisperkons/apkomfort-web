import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { SUPABASE_URL, SUPABASE_KEY } from './lib/config'

export async function proxy(request) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name) { return request.cookies.get(name)?.value },
      set(name, value, options) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const protectedRoute = path.startsWith('/panelis') || path.startsWith('/birojs')

  if (!user && protectedRoute) {
    return NextResponse.redirect(new URL('/pieslegties', request.url))
  }

  if (user && (path === '/pieslegties' || path === '/registracija')) {
    // Single login for everyone — route straight to the right side after auth.
    const { data: staffProfile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle()
    return NextResponse.redirect(new URL(staffProfile ? '/birojs' : '/panelis', request.url))
  }

  return response
}

export const config = { matcher: ['/panelis/:path*', '/birojs/:path*', '/pieslegties', '/registracija'] }
