import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Granulu un cietā kurināmā katlu apkope — AP Komforts',
  description:
    'Granulu, malkas un cietā kurināmā katlu apkope Rīgā un Pierīgā — tīrīšana, degļa un skursteņa pārbaude, drošības sistēmu pārbaude.',
}

const INCLUDED = [
  'Sadegšanas kameras un degļa tīrīšana no pelniem un nogulsnēm',
  'Granulu padeves mehānisma pārbaude',
  'Skursteņa un dūmvada pārbaude',
  'Drošības un pretsprādziena vārstu pārbaude',
  'Sadegšanas efektivitātes mērījums',
  'Servisa atskaite un nākamās apkopes atgādinājums',
]

const FAQ_ITEMS = [
  {
    q: 'Cik bieži jātīra granulu katls?',
    a: 'Profesionāla apkope ieteicama reizi gadā, pirms apkures sezonas sākuma. Pelnu tvertni un degli ieteicams pārbaudīt un iztīrīt pašam biežāk — reizi 2–4 nedēļās intensīvas lietošanas laikā.',
  },
  {
    q: 'Kāpēc netīrs katls ir bīstams, ne tikai neefektīvs?',
    a: 'Nogulsnes degļa zonā var traucēt pareizu sadegšanu un palielināt oglekļa monoksīda risku, kā arī paaugstina ugunsgrēka risku skursteņa zonā. Tāpēc skursteņa un dūmvada pārbaude ir daļa no katras apkopes.',
  },
  {
    q: 'Vai apkalpojat arī malkas un ogļu katlus?',
    a: 'Jā — jebkuru cietā kurināmā katlu, ne tikai granulu tipa.',
  },
]

export default function GranuluKatluApkopePage() {
  return (
    <>
      <PageIntro
        eyebrow="Granulu un cietā kurināmā katli"
        h1="Granulu un cietā kurināmā katlu apkope"
        intro="Cietā kurināmā katliem netīrums nav tikai efektivitātes jautājums — tas ir arī drošības jautājums. Ikgadēja apkope pirms sezonas ir vienkāršākais veids, kā izvairīties no abiem."
        ctaLabel="Pieteikt apkopi"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kas iekļauts</div>
            <h2>Ko ietver granulu katla apkope</h2>
          </div>
          <ul className="plan-includes" style={{ maxWidth: 560 }}>
            {INCLUDED.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
