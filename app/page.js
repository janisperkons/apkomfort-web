import Link from 'next/link'
import Experience from '../components/maja/Experience'
import PageViewBeacon from '../components/PageViewBeacon'
import { ZONES, PHONE_DISPLAY, PHONE_HREF } from '../components/maja/content'
import './maja.css'

// The cinematic homepage lives OUTSIDE the (site) route group on purpose:
// it owns its full chrome (dark stage, own header/footer), while every other
// public page keeps the standard Header/Footer from (site)/layout.js.
// Back Office (/birojs), portal (/panelis) and auth are untouched.

export const metadata = {
  title: 'AP Komforts — Santehnikas un apkures sistēmas privātmājām Rīgā un Pierīgā',
  description:
    'Atklājiet, kas slēpjas aiz sienām: apkures sistēmas, siltās grīdas, siltumsūkņi, ūdensapgāde un kanalizācija privātmājām Rīgā un Pierīgā. Izpētiet interaktīvo māju un pieteikieties konsultācijai.',
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'AP Komforts',
  description:
    'Apkures, ūdensapgādes un kanalizācijas sistēmu izbūve, apkope un remonts privātmājām Rīgā un Pierīgā.',
  areaServed: ['Rīga', 'Mārupe', 'Ādaži', 'Ķekava', 'Ropaži', 'Salaspils', 'Jūrmala', 'Olaine', 'Babīte'],
  telephone: '+371-26-275-983',
  priceRange: '€€',
  address: { '@type': 'PostalAddress', addressLocality: 'Rīga', addressCountry: 'LV' },
}

const DIRECTORY = [
  ['/apkopes-plani/', 'Apkopes plāni'],
  ['/kalkulators/', 'Cenas kalkulators'],
  ['/komforta-klubs/', 'Komforta klubs'],
  ['/gazes-katlu-apkope/', 'Gāzes katlu apkope'],
  ['/granulu-katlu-apkope/', 'Granulu katlu apkope'],
  ['/siltumsuknu-apkope/', 'Siltumsūkņu apkope'],
  ['/apkures-remonts/', 'Apkures remonts'],
  ['/apkures-katla-nomaina/', 'Apkures katla nomaiņa'],
  ['/santehnikas-darbi/', 'Santehnikas darbi'],
  ['/avarijas-izsaukums/', 'Avārijas izsaukums'],
  ['/valsts-atbalsts-siltumsuknim/', 'Valsts atbalsts siltumsūknim'],
  ['/biezak-uzdotie-jautajumi/', 'Biežāk uzdotie jautājumi'],
  ['/par-mums/', 'Par mums'],
  ['/kontakti/', 'Kontakti'],
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <PageViewBeacon />
      <div className="mj-root">
        <Experience />

        {/* Indexable services layer: every system on the house, in plain HTML,
            plus the full directory of deep pages. Visible content, not a
            hidden SEO trick — this is also the no-JS experience. */}
        <section className="mj-dir" id="pakalpojumi" aria-label="Pakalpojumi">
          <div className="mj-dir-inner">
            <h2 className="mj-serif">Pakalpojumi</h2>
            <p className="sub">Sistēmas, ko projektējam, izbūvējam un apkopjam privātmājās.</p>
            <div className="mj-dir-grid">
              {ZONES.map((z) => (
                <Link key={z.id} href={`/?skats=${z.id}`}>{z.label}</Link>
              ))}
            </div>
            <h2 className="mj-serif" style={{ marginTop: 44 }}>Noderīgi</h2>
            <p className="sub">Cenas, apkopes plāni un atbildes uz biežākajiem jautājumiem.</p>
            <div className="mj-dir-grid">
              {DIRECTORY.map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="mj-footer">
          <div>© {new Date().getFullYear()} AP Komforts · Rīga un Pierīga</div>
          <div>
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <Link href="/pieslegties/">Pieslēgties</Link>
          </div>
        </footer>
      </div>
    </>
  )
}
