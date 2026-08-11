'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/apkopes-plani/', label: 'Apkopes plāni' },
  { href: '/komforta-klubs/', label: 'Komforta klubs' },
  { href: '/apkures-katlu-apkope/', label: 'Pakalpojumi' },
  { href: '/par-mums/', label: 'Par mums' },
  { href: '/kontakti/', label: 'Kontakti' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="bar">
        <Link href="/" className="logo" aria-label="AP Komfort — sākums">
          <img src="/logo/APKomfort-Mark.svg" alt="" />
          <span className="logo-word">
            Komforts
            <em>Rīga · Pierīga</em>
          </span>
        </Link>
        <nav aria-label="Galvenā navigācija" className="desktop-nav">
          <ul style={{ display: 'flex', gap: 26, listStyle: 'none' }}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-right">
          <a className="tel" href="tel:+37126275983">
            +371 26 275 983
          </a>
          <Link href="/kalkulators/" className="btn-s desktop-only">
            Pieteikties
          </Link>
          <button
            type="button"
            className="burger"
            aria-label={open ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="btn-p btn-block" href="tel:+37126275983" onClick={() => setOpen(false)}>
            Zvanīt +371 26 275 983
          </a>
        </div>
      )}
    </header>
  )
}
