import PageIntro from '../../components/PageIntro'
import Faq from '../../components/Faq'
import CtaBand from '../../components/CtaBand'

export const metadata = {
  title: 'Valsts atbalsts siltumsūkņa iegādei — EKII 2026 — AP Komfort',
  description:
    'Valsts atbalsts siltumsūkņa iegādei caur EKII programmu. Kārtojam pieteikumu jūsu vietā — no izvērtēšanas līdz uzstādīšanai.',
}

const STEPS = [
  { n: '1', title: 'Izvērtēšana', body: 'Pārbaudām, vai jūsu mājsaimniecība un plānotā sistēma atbilst aktuālās kārtas nosacījumiem.' },
  { n: '2', title: 'Dokumenti', body: 'Sagatavojam un iesniedzam pieteikumu jūsu vietā — bez veidlapu džungļa.' },
  { n: '3', title: 'Uzstādīšana', body: 'Uzstādām sistēmu atbilstoši programmas tehniskajām prasībām.' },
  { n: '4', title: 'Atbalsta saņemšana', body: 'Pavadām procesu līdz atbalsta izmaksai.' },
]

const FAQ_ITEMS = [
  {
    q: 'Cik lielu atbalstu varu saņemt?',
    a: 'Apmērs atkarīgs no programmas aktuālās kārtas nosacījumiem un jūsu mājsaimniecības situācijas — publicētie procenti laika gaitā mainās, tāpēc precīzu summu pateiksim pēc izvērtēšanas, nevis uzreiz mājaslapā.',
  },
  {
    q: 'Vai varu pieteikties, ja siltumsūkni jau esmu iegādājies?',
    a: 'Parasti nē — atbalsta programmas vairumā gadījumu prasa pieteikumu iesniegt pirms iegādes. Sazinieties ar mums pirms pirkuma, lai neizlaistu iespēju.',
  },
  {
    q: 'Vai konsultācija par atbalstu maksā?',
    a: 'Nē, sākotnējā izvērtēšana un konsultācija ir bez maksas.',
  },
  {
    q: 'Cik ilgs ir process no pieteikuma līdz uzstādīšanai?',
    a: 'Atkarīgs no programmas izskatīšanas termiņiem konkrētajā kārtā — precīzu laika grafiku pateiksim pēc jūsu pieteikuma iesniegšanas.',
  },
]

export default function ValstsAtbalstsSiltumsuknimPage() {
  return (
    <>
      <PageIntro
        eyebrow="Valsts atbalsts"
        h1="Valsts atbalsts siltumsūkņa iegādei"
        intro="EKII programma sedz daļu no siltumsūkņa iegādes un uzstādīšanas izmaksām. Process ietver dokumentus un termiņus, kurus parasti neviens nevēlas kārtot pats — mēs to darām jūsu vietā."
        ctaLabel="Bezmaksas konsultācija"
        ctaHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Process</div>
            <h2>No izvērtēšanas līdz atbalsta saņemšanai</h2>
          </div>
          <div className="grid g4">
            {STEPS.map((s) => (
              <div className="card" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="note" style={{ maxWidth: 700 }}>
            Atbalsta apmērs un nosacījumi programmas kārtu laikā mainās. Precīzus, aktuālos
            nosacījumus vienmēr apstiprinām pirms pieteikuma iesniegšanas — nevis solām skaitli, kas
            var būt novecojis.
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par valsts atbalstu" />

      <CtaBand heading="Uzziniet, vai jūs atbilstat" primaryHref="/kontakti/" primaryLabel="Bezmaksas konsultācija" />
    </>
  )
}
