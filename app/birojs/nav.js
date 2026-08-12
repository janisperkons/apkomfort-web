'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ADMIN_ITEMS = [
  ['/birojs', 'Pārskats'],
  ['/birojs/pieteikumi', 'Jauni pieteikumi'],
  ['/birojs/klienti', 'Klienti'],
  ['/birojs/ipasumi', 'Īpašumi'],
  ['/birojs/darbi', 'Darbi'],
  ['/birojs/kalendars', 'Kalendārs'],
  ['/birojs/gramatvediba', 'Grāmatvedība'],
  ['/birojs/statistika', 'Statistika'],
  ['/birojs/mailings', 'E-pasti'],
  ['/birojs/komanda', 'Komanda'],
]

// A bookkeeper only ever needs the financial view — everything else
// (jobs, equipment, communications, enquiries, analytics) is blocked at
// the database level for that role anyway, so there's nothing useful for
// them behind the other links.
const BOOKKEEPER_ITEMS = [
  ['/birojs/gramatvediba', 'Grāmatvedība'],
]

export default function Nav({ newPieteikumiCount = 0, isAdmin = true }) {
  const p = usePathname()
  const items = isAdmin ? ADMIN_ITEMS : BOOKKEEPER_ITEMS
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
