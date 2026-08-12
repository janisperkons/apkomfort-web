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
export default function Nav({ newPieteikumiCount = 0 }) {
  const p = usePathname()
  return (
    <nav>
      {items.map(([href, label]) => {
        const active = href === '/birojs' ? p === href : (p === href || p.startsWith(href + '/'))
        const badge = href === '/birojs/pieteikumi' && newPieteikumiCount > 0
        return (
          <Link key={href} href={href} className={active ? 'on' : ''}>
            {label}{badge && <span className="navbadge">{newPieteikumiCount}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
