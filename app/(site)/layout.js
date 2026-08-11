import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PageViewBeacon from '../../components/PageViewBeacon'

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

export default function SiteLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <PageViewBeacon />
      <Header />
      {children}
      <Footer />
    </>
  )
}
