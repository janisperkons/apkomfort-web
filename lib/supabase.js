'use client'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from './config'

let client
export function supabaseBrowser() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_KEY)
  return client
}
