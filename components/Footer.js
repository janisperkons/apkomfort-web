import Link from 'next/link'

const TOWNS = [
  { href: '/apkures-serviss-marupe/', label: 'Mārupē' },
  { href: '/apkures-serviss-adazi/', label: 'Ādažos' },
  { href: '/apkures-serviss-kekava/', label: 'Ķekavā' },
  { href: '/apkures-serviss-ropazi/', label: 'Ropažos' },
  { href: '/apkures-serviss-salaspils/', label: 'Salaspilī' },
  { href: '/apkures-serviss-jurmala/', label: 'Jūrmalā' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <img src="/logo/APKomfort-Mark.svg" alt="" />
              <span>Komforts</span>
            </div>
            <p style={{ maxWidth: 260, fontSize: 13.8, lineHeight: 1.7 }}>
              Apkure, siltumsūkņi, santehnika un avārijas remonts Rīgā un Pierīgā. Viens
              sertificēts speciālists, kas pazīst jūsu māju.
            </p>
            <p style={{ maxWidth: 260, fontSize: 13.8, lineHeight: 1.7, marginTop: 14 }}>
              Aleksejs Perkons
              <br />
              <a href="tel:+37158860194">+371 58 860 194</a>
            </p>
          </div>
          <div>
            <h4>Pakalpojumi</h4>
            <ul>
              <li><Link href="/apkures-katlu-apkope/">Apkures katlu apkope</Link></li>
              <li><Link href="/gazes-katlu-apkope/">Gāzes katlu apkope</Link></li>
              <li><Link href="/siltumsuknu-apkope/">Siltumsūkņu apkope</Link></li>
              <li><Link href="/santehnikas-darbi/">Santehnikas darbi</Link></li>
              <li><Link href="/granulu-katlu-apkope/">Granulu katlu apkope</Link></li>
              <li><Link href="/apkures-remonts/">Remonts un diagnostika</Link></li>
              <li><Link href="/avarijas-izsaukums/">Avārijas izsaukums</Link></li>
            </ul>
          </div>
          <div>
            <h4>Apkalpojam</h4>
            <ul>
              {TOWNS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href}>{t.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Uzņēmums</h4>
            <ul>
              <li><Link href="/par-mums/">Par mums</Link></li>
              <li><Link href="/apkopes-plani/">Apkopes plāni</Link></li>
              <li><Link href="/cenas/">Cenas</Link></li>
              <li><Link href="/biezak-uzdotie-jautajumi/">Biežāk uzdotie jautājumi</Link></li>
              <li><Link href="/kontakti/">Kontakti</Link></li>
              <li><a href="tel:+37158860194">+371 58 860 194</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <span>
            SIA &ldquo;AP Komfort&rdquo; · Reģ. Nr. [aizpildīt pirms palaišanas] · Rīga, Latvija
          </span>
          <span>© {new Date().getFullYear()} AP Komfort</span>
        </div>
      </div>
    </footer>
  )
}
