'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['/panelis', 'Sākums'],
  ['/panelis/pieteikt-vizu', 'Pieteikt vizīti'],
  ['/panelis/tames', 'Manas tāmes'],
  ['/panelis/rekini', 'Mani rēķini'],
]
export default function Nav({ newInvoiceCount = 0, newQuoteCount = 0 }) {
  const p = usePathname()
  return (
    <nav>
      {items.map(([href, label]) => {
        const count = href === '/panelis/rekini' ? newInvoiceCount
          : href === '/panelis/tames' ? newQuoteCount : 0
        return (
          <Link key={href} href={href} className={p === href ? 'on' : ''}>
            {label}{count > 0 && <span className="navbadge">{count}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
