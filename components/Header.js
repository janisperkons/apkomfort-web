'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/apkopes-plani/', label: 'Apkopes plāni' },
  { href: '/cenas/', label: 'Cenas' },
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
          <a className="tel" href="tel:+37158860194">
            +371 58 860 194
          </a>
          <Link href="/kalkulators/" className="btn-s desktop-only">
            Pieteikt apkopi
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
          <a className="btn-p btn-block" href="tel:+37158860194" onClick={() => setOpen(false)}>
            Zvanīt +371 58 860 194
          </a>
        </div>
      )}
    </header>
  )
}
