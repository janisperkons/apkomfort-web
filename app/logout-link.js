'use client'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../lib/browserAuth'

export default function LogoutLink({ dark = true }) {
  const router = useRouter()
  async function logout() {
    await supabaseBrowser().auth.signOut()
    router.push('/pieslegties'); router.refresh()
  }
  return (
    <a href="#" onClick={e => { e.preventDefault(); logout() }} style={{ color: dark ? 'var(--accl)' : 'var(--muted)' }}>
      Iziet
    </a>
  )
}
