'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['/panelis', 'Sākums'],
  ['/panelis/pieteikt-vizu', 'Pieteikt vizīti'],
  ['/panelis/rekini', 'Mani rēķini'],
]
export default function Nav() {
  const p = usePathname()
  return (
    <nav>
      {items.map(([href, label]) => (
        <Link key={href} href={href} className={p === href ? 'on' : ''}>{label}</Link>
      ))}
    </nav>
  )
}
