'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['/birojs', 'Pārskats'],
  ['/birojs/pieteikumi', 'Jauni pieteikumi'],
  ['/birojs/klienti', 'Klienti'],
  ['/birojs/ipasumi', 'Īpašumi'],
  ['/birojs/darbi', 'Darbi'],
  ['/birojs/statistika', 'Statistika'],
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
