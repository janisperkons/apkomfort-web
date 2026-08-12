import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Granulu un cietā kurināmā katlu apkope — AP Komforts',
  description:
    'Granulu, malkas un cietā kurināmā katlu apkope Rīgā un Pierīgā — tīrīšana, degļa un dūmvada pieslēguma pārbaude, drošības sistēmu pārbaude.',
}

const INCLUDED = [
  'Sadegšanas kameras, degļa un siltummaiņa tīrīšana no pelniem un nogulsnēm',
  'Granulu padeves mehānisma pārbaude',
  'Apkures sistēmas darba spiediena un izplešanās trauka pārbaude',
  'Drošības un pretsprādziena vārstu pārbaude',
  'Dūmvada pieslēguma un pieejamās dūmgāzu izvades daļas pārbaude',
  'Sadegšanas efektivitātes mērījums',
  'Servisa atskaite ar konstatētajiem defektiem un rekomendācijām',
]

const CHIMNEY_NOTE =
  'Apkopes ietvaros pārbaudām dūmvada pieslēgumu un pieejamo dūmgāzu izvades daļu pie katla. Pilna skursteņa tehniskā apsekošana ir atsevišķs sertificēta skursteņslauķa pakalpojums, ne apkopes sastāvdaļa.'

const FAQ_ITEMS = [
  {
    q: 'Cik bieži jātīra granulu katls?',
    a: 'Profesionāla apkope ieteicama reizi gadā, pirms apkures sezonas sākuma. Pelnu tvertni un degli ieteicams pārbaudīt un iztīrīt pašam biežāk — reizi 2–4 nedēļās intensīvas lietošanas laikā.',
  },
  {
    q: 'Kāpēc netīrs katls ir bīstams, ne tikai neefektīvs?',
    a: 'Nogulsnes degļa zonā var traucēt pareizu sadegšanu un palielināt oglekļa monoksīda risku, kā arī paaugstina ugunsgrēka risku skursteņa zonā. Tāpēc katras apkopes ietvaros pārbaudām dūmvada pieslēgumu un pieejamo dūmgāzu izvades daļu — pilnu skursteņa tehnisko apsekošanu veic sertificēts skursteņslauķis, un to organizējam pēc nepieciešamības.',
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
          <p className="fine" style={{ maxWidth: 560, marginTop: 18 }}>{CHIMNEY_NOTE}</p>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
