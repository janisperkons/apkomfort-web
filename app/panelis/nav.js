'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['/panelis', 'Sākums'],
  ['/panelis/pieteikt-vizu', 'Pieteikt vizīti'],
  ['/panelis/rekini', 'Mani rēķini'],
]
export default function Nav({ newInvoiceCount = 0 }) {
  const p = usePathname()
  return (
    <nav>
      {items.map(([href, label]) => {
        const badge = href === '/panelis/rekini' && newInvoiceCount > 0
        return (
          <Link key={href} href={href} className={p === href ? 'on' : ''}>
            {label}{badge && <span className="navbadge">{newInvoiceCount}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
