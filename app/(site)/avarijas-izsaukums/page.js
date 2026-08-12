import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'

export const metadata = {
  title: 'Avārijas izsaukums — apkure un santehnika — AP Komforts',
  description:
    'Avārijas izsaukums apkures un santehnikas bojājumiem Rīgā un Pierīgā. Gāzes smaka — vispirms zvaniet Gaso 114. Prioritāte apkopes plāna dalībniekiem.',
}

const FAQ_ITEMS = [
  {
    q: 'Jūtu gāzes smaku — ko darīt?',
    a: 'Nekavējoties zvaniet Gaso avārijas dienestam 114 un pametiet telpu. Neieslēdziet un neizslēdziet elektroierīces, nesmēķējiet, neizmantojiet atklātu liesmu. Pēc tam, ja nepieciešams, zvaniet mums.',
  },
  {
    q: 'Cik ātri jūs varat ierasties?',
    a: 'Godīgi — precīzu laiku nekad nesolām, jo tas atkarīgs no attāluma un noslodzes tajā brīdī. Komforts un Komforts Pilns plāna dalībniekiem ir prioritāte, ar mērķi ierasties tajā pašā dienā.',
  },
  {
    q: 'Vai avārijas izsaukums maksā, ja man nav apkopes plāna?',
    a: 'Jā, bez plāna avārijas izsaukumam ir maksa, ko apstiprinām zvanā pirms izbraukšanas. Plāna dalībniekiem izsaukuma darbaspēks ir iekļauts.',
  },
  {
    q: 'Strādājat arī naktīs un brīvdienās?',
    a: 'Pieņemam zvanus ārpus darba laika, taču godīgi jāsaka — ne katru reizi būs iespējams ierasties uzreiz naktī. Zvaniet, un pateiksim patiesību par to, kad varam būt pie jums.',
  },
]

export default function AvarijasIzsaukumsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Avārijas izsaukums"
        h1="Avārijas izsaukums — apkure un santehnika"
        intro="Katls apstājies, applūdusi telpa vai kaut kas smird pēc degošas gāzes — zemāk redzēsiet, kas jādara vispirms."
        ctaLabel="Zvanīt tagad"
        ctaHref="tel:+37126275983"
      />

      <div className="wrap">
        <div className="note" style={{ maxWidth: 760, margin: '0 auto 8px' }}>
          <strong>Jūtat gāzes smaku?</strong> Nekavējoties zvaniet Gaso avārijas dienestam{' '}
          <strong>114</strong> un pametiet telpu. Tas ir pirmais un vienīgais pareizais solis — pirms
          zvana mums vai jebkuram citam.
        </div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="prose">
            <h2>Godīgi par to, ko sagaidīt</h2>
            <p>
              Nevienā tirgū neviens pakalpojumu sniedzējs nevar godīgi solīt fiksētu ierašanās laiku
              avārijas izsaukumam — tas ir atkarīgs no attāluma, satiksmes un tā, cik izsaukumu jau
              ir rindā. Mēs nesolām to, ko nevaram garantēt.
            </p>
            <p>
              <strong>Komforts un Komforts Pilns plāna dalībniekiem</strong> ir prioritāte pār
              izsaukumiem bez plāna, un mērķis ir ierasties tajā pašā dienā. Tas ir viens no
              galvenajiem iemesliem, kāpēc šie plāni pastāv.
            </p>
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <section className="block">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h2>Zvaniet tagad</h2>
              <p>+371 26 275 983 — pastāstiet, kas noticis, un vienosimies par nākamo soli.</p>
            </div>
            <a href="tel:+37126275983" className="btn-p">
              Zvanīt +371 26 275 983
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
