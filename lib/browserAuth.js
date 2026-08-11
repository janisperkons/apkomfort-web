'use client'
import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_KEY } from './config'

// Cookie-based client for the authenticated /panelis and /birojs sections, so the
// session is readable by proxy.js and server components. Distinct from lib/supabase.js,
// which the anonymous public forms (calculator, contact) use.
export const supabaseBrowser = () => createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
