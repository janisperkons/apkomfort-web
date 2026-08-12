'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['/birojs', 'Pārskats'],
  ['/birojs/pieteikumi', 'Jauni pieteikumi'],
  ['/birojs/klienti', 'Klienti'],
  ['/birojs/ipasumi', 'Īpašumi'],
  ['/birojs/darbi', 'Darbi'],
  ['/birojs/gramatvediba', 'Grāmatvedība'],
  ['/birojs/statistika', 'Statistika'],
  ['/birojs/mailings', 'E-pasti'],
]
export default function Nav() {
  const p = usePathname()
  return (
    <nav>
      {items.map(([href, label]) => {
        const active = href === '/birojs' ? p === href : (p === href || p.startsWith(href + '/'))
        return <Link key={href} href={href} className={active ? 'on' : ''}>{label}</Link>
      })}
    </nav>
  )
}
