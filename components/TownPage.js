import Link from 'next/link'
import PageIntro from './PageIntro'
import Faq from './Faq'
import CtaBand from './CtaBand'

const SERVICES = [
  { title: 'Apkures katlu apkope un serviss', href: '/apkures-katlu-apkope/' },
  { title: 'Gāzes katlu apkope', href: '/gazes-katlu-apkope/' },
  { title: 'Siltumsūkņu apkope', href: '/siltumsuknu-apkope/' },
  { title: 'Granulu katlu apkope', href: '/granulu-katlu-apkope/' },
  { title: 'Santehnikas darbi', href: '/santehnikas-darbi/' },
  { title: 'Avārijas izsaukums', href: '/avarijas-izsaukums/' },
]

const FAQ_ITEMS = [
  {
    q: 'Cik ilgā laikā jūs varat ierasties?',
    a: 'Plānotu apkopi parasti saskaņojam dažu darba dienu laikā. Komforts un Komforts Pilns plāna dalībniekiem bojājumu gadījumā mērķis ir ierasties tajā pašā dienā.',
  },
  {
    q: 'Vai apkalpojat arī vasarnīcas un sezonas mājas?',
    a: 'Jā — īpaši noderīga ir apkope pirms sezonas sākuma vai pēc ilgākas dīkstāves, kad sistēmā var būt uzkrājušies bojājumi, kas ziemā palikuši nepamanīti.',
  },
  {
    q: 'Kā notiek pieteikšanās?',
    a: 'Aizpildiet īsu pieteikumu tiešsaistē vai piezvaniet — mūsu inženieris izvērtēs jūsu sistēmu un vienosies par apkopes laiku un cenu.',
  },
]

export default function TownPage({ town }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Apkures katlu un santehnikas apkope',
    provider: { '@type': 'HVACBusiness', name: 'AP Komforts', telephone: '+371-26-275-983' },
    areaServed: { '@type': 'Place', name: town.nominative },
  }

  return (
    <>
      <PageIntro
        eyebrow={`Apkalpojam ${town.locative}`}
        h1={`Apkures katlu apkope un serviss ${town.locative}`}
        intro={town.intro}
        ctaLabel="Aprēķināt cenu"
        ctaHref="/kalkulators/"
        secondaryLabel="Pieteikt apkopi"
        secondaryHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="prose">
            <h2>Ko mēs {town.locative} darām visbiežāk</h2>
            <p>{town.focus}</p>
            <p>
              Katru izbraukumu veic viens un tas pats sertificēts inženieris, kas iepazīst jūsu
              māju un tās apkures vēsturi — nevis nejauši mainīgs darbinieks no zvanu centra. Pēc
              katras apkopes saņemat pilnu servisa vēsturi un atgādinājumu, kad pienācis laiks
              nākamajai.
            </p>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Pakalpojumi</div>
            <h2>Viss, kas saistīts ar siltumu un ūdeni jūsu mājā</h2>
          </div>
          <div className="grid g3">
            {SERVICES.map((s) => (
              <Link href={s.href} className="card service-card" key={s.href}>
                <h3>{s.title}</h3>
                <span className="service-link">Uzzināt vairāk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading={`Biežāk uzdotie jautājumi — ${town.locative}`} />

      <CtaBand
        heading={`Piesakiet apkopi ${town.locative}`}
        body="Bez saistībām. Galīgo cenu vienmēr apstiprinām sarunā pa telefonu."
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
