import { Lora } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const lora = Lora({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-lora' })

export const metadata = {
  metadataBase: new URL('https://apkomforts.com'),
  title: 'AP Komfort — Apkures katlu apkope, Siltumsūkņi un Santehnika Rīgā un Pierīgā',
  description:
    'Apkures katlu apkope un serviss, siltumsūkņu apkope, santehnikas darbi un avārijas remonts Rīgā un Pierīgā. Publiskas cenas, sertificēts inženieris, cenas kalkulators tiešsaistē.',
  keywords: [
    'apkures katlu apkope',
    'apkures katlu serviss',
    'gāzes katlu apkope',
    'siltumsūkņu apkope',
    'santehnikas darbi',
    'apkures katla apkope cena',
    'avārijas santehniķis Rīga',
    'apkures serviss Pierīga',
  ],
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/APKomfort-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/APKomfort-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/APKomfort-icon-180.png',
  },
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'AP Komfort',
  description:
    'Apkures katlu apkope, siltumsūkņu serviss, santehnikas darbi un avārijas remonts Rīgā un Pierīgā.',
  areaServed: [
    'Rīga',
    'Mārupe',
    'Ādaži',
    'Ķekava',
    'Ropaži',
    'Salaspils',
    'Jūrmala',
    'Olaine',
    'Babīte',
  ],
  telephone: '+371-26-275-983',
  priceRange: '€€',
  address: { '@type': 'PostalAddress', addressLocality: 'Rīga', addressCountry: 'LV' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="lv" className={lora.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
