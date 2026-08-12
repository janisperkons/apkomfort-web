import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Gāzes katlu apkope un serviss — sertificēts speciālists — AP Komforts',
  description:
    'Gāzes katlu apkope un serviss Rīgā un Pierīgā. Sertificēts speciālists, drošības pārbaude, dokumentācija Gaso. Apkope ir likumā noteikts pienākums.',
}

const INCLUDED = [
  'Gāzes noplūdes un savienojumu pārbaude',
  'Degļa tīrīšana un regulēšana',
  'Sadegšanas gāzu (CO) mērījums',
  'Skursteņa un ventilācijas trakta pārbaude',
  'Drošības automātikas pārbaude',
  'Apkopes akts, kas nepieciešams Gaso',
]

const FAQ_ITEMS = [
  {
    q: 'Vai gāzes katla apkope tiešām ir obligāta?',
    a: 'Jā — saskaņā ar MK noteikumiem Nr. 78 ikgadēja apkope ir īpašnieka pienākums, un Gaso var pārtraukt gāzes padevi, ja tā nav veikta. Detalizēti skaidrojam atsevišķā lapā par obligāto apkopi.',
  },
  {
    q: 'Ko darīt, ja jūtu gāzes smaku?',
    a: 'Nekavējoties zvaniet Gaso avārijas dienestam 114 — pirms zvanāt mums vai jebkuram citam. Gāzes noplūde ir dzīvībai bīstama situācija, kurā pirmais solis vienmēr ir Gaso.',
  },
  {
    q: 'Kādu dokumentu saņemu pēc apkopes?',
    a: 'Apkopes aktu, kas apliecina, ka apkope veikta un iekārta atbilst drošas ekspluatācijas noteikumiem — tas ir dokuments, kas var tikt pieprasīts no Gaso puses.',
  },
]

export default function GazesKatluApkopePage() {
  return (
    <>
      <PageIntro
        eyebrow="Gāzes katli"
        h1="Gāzes katlu apkope un serviss — sertificēts speciālists"
        intro="Gāzes darbs ir joma, kurā kvalifikācijai jābūt bez šaubām. Apkope tiek veikta atbilstoši LSGŪTIS (Latvijas Siltuma, gāzes un ūdens tehnoloģijas inženieru savienība) noteikumiem un noslēdzas ar dokumentu, kas derīgs uzrādīšanai Gaso."
        ctaLabel="Pieteikt apkopi"
        ctaHref="/kalkulators/"
      />

      <div className="wrap">
        <div className="note" style={{ maxWidth: 760, margin: '0 auto 8px' }}>
          <strong>Jūtat gāzes smaku?</strong> Nekavējoties zvaniet Gaso avārijas dienestam <strong>114</strong>.
          Tas ir pirmais solis vienmēr — pirms zvana mums vai jebkuram citam speciālistam.
        </div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kas iekļauts</div>
            <h2>Ko ietver gāzes katla apkope</h2>
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
          <div className="prose">
            <h2>Likumā noteikts pienākums</h2>
            <p>
              Gāzes iekārtu ikgadēja apkope Latvijā nav ieteikums — tas ir pienākums, ko nosaka MK
              noteikumi Nr. 78, un par to atbild īpašnieks. Ko tas nozīmē praksē un kādas ir sekas,
              ja apkope nav veikta, skaidrojam{' '}
              <Link href="/gazes-katla-apkope-obligata/">atsevišķā lapā</Link>.
            </p>
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
