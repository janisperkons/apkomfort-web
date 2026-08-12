import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Apkures katlu apkope un serviss Rīgā un Pierīgā — AP Komforts',
  description:
    'Apkures katlu apkope un serviss — gāzes, elektrības, granulu un cietā kurināmā katli. Sertificēts inženieris, skaidrs apkopes plāns, cenas aprēķins tiešsaistē.',
}

const SUB_SERVICES = [
  { title: 'Gāzes katlu apkope', body: 'Sertificēta apkope, kas atbilst likumā noteiktajam grafikam.', href: '/gazes-katlu-apkope/' },
  { title: 'Siltumsūkņu apkope', body: 'Gaiss-gaiss, gaiss-ūdens un grunts siltumsūkņu serviss.', href: '/siltumsuknu-apkope/' },
  { title: 'Granulu katlu apkope', body: 'Granulu un cietā kurināmā katlu tīrīšana un regulēšana.', href: '/granulu-katlu-apkope/' },
  { title: 'Remonts un diagnostika', body: 'Bojājumu noteikšana pēc kļūdas koda vai simptoma.', href: '/apkures-remonts/' },
]

const INCLUDED = [
  'Katla un tā mezglu vizuāla pārbaude',
  'Degļa un siltummaiņa tīrīšana',
  'Drošības vārstu un spiediena pārbaude',
  'Sadegšanas efektivitātes un emisiju mērījums',
  'Skursteņa vai izvades trakta pārbaude',
  'Pilna servisa atskaite un nākamās apkopes atgādinājums',
]

const FAQ_ITEMS = [
  {
    q: 'Cik bieži jāveic apkures katla apkope?',
    a: 'Vismaz reizi gadā — gāzes katliem tas ir arī likumā noteikts pienākums (MK noteikumi Nr. 78). Citiem katlu veidiem ikgadēja apkope ir stingri ieteicama ražotāja garantijas un drošas ekspluatācijas dēļ.',
  },
  {
    q: 'Cik ilgst viena apkope?',
    a: 'Vidēji 45–90 minūtes atkarībā no katla veida un tā, cik sen tas iepriekš apkopts.',
  },
  {
    q: 'Vai apkope ietver arī siltumsūkņus un santehniku?',
    a: 'Jā — apkalpojam visas jūsu mājas siltuma un ūdens sistēmas. Skatiet siltumsūkņu apkopes un santehnikas darbu lapas.',
  },
]

export default function ApkuresKatluApkopePage() {
  return (
    <>
      <PageIntro
        eyebrow="Pakalpojumi"
        h1="Apkures katlu apkope un serviss Rīgā un Pierīgā"
        intro="Gāzes, elektrības, granulu vai cietā kurināmā katls — apkopjam visus veidus pēc viena principa: ikgadēja plānota apkope, kas novērš avārijas, nevis tikai reaģē uz tām."
        ctaLabel="Pieteikt apkopi"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kas iekļauts</div>
            <h2>Ko ietver apkures katla apkope</h2>
          </div>
          <ul className="plan-includes" style={{ maxWidth: 560 }}>
            {INCLUDED.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Pēc katla veida</div>
            <h2>Izvēlieties savu sistēmu</h2>
          </div>
          <div className="grid g4">
            {SUB_SERVICES.map((s) => (
              <Link href={s.href} className="card service-card" key={s.href}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="service-link">Uzzināt vairāk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="prose">
            <h2>Cik bieži jāveic apkope</h2>
            <p>
              Gāzes iekārtām ikgadēja apkope ir tiešs pienākums saskaņā ar MK noteikumiem Nr. 78 —
              par to un ko tas praksē nozīmē, lasiet{' '}
              <Link href="/gazes-katla-apkope-obligata/">atsevišķā lapā</Link>. Citiem katlu veidiem
              ikgadēja apkope nav juridisks pienākums, taču tā ir vienīgais veids, kā saglabāt
              ražotāja garantiju un izvairīties no dārgiem pārsteigumiem apkures sezonas vidū.
            </p>
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
