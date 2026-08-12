import { Suspense } from 'react'
import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import Calculator from '../../../components/Calculator'

export const metadata = {
  title: 'Apkopes plāni — Apkope, Komforts, Komforts Pilns — AP Komforts',
  description:
    'Trīs apkures katlu un siltumsūkņu apkopes plāni Rīgā un Pierīgā — kas iekļauts, kas neietilpst, un kā izvēlēties sev piemērotāko.',
}

const PLANS = [
  {
    badge: 'Apkope',
    name: 'Apkope plāns',
    lead: 'Pamats — ikgadēja plānota apkope pēc likumā noteiktā grafika.',
    included: [
      'Ikgadēja plānota apkope pēc grafika',
      'Izbraukums un darba laiks iekļauts',
      'Pilna servisa vēsture un atgādinājumi',
      'Prioritāte, pierakstoties uz remontu',
    ],
    excluded: ['Avārijas izsaukumi ārpus plānotās apkopes', 'Rezerves daļu izmaksas'],
  },
  {
    badge: 'Komforts',
    name: 'Komforts plāns',
    lead: 'Visbiežāk izvēlētais — apkope plus līdz 3 iekļautiem izsaukumiem gadā, ja kaut kas salūst.',
    included: [
      'Viss, kas iekļauts Apkope plānā',
      'Līdz 3 iekļautiem bojājumu izsaukumiem gadā (darbaspēks)',
      'Steidzamiem gadījumiem — prioritāte, mērķis ierasties tajā pašā dienā',
      '10% atlaide rezerves daļām',
    ],
    excluded: ['Izsaukumi virs 3 gadā — par pazeminātu abonenta cenu, nevis pilnu maksu'],
    featured: true,
  },
  {
    badge: 'Komforts Pilns',
    name: 'Komforts Pilns plāns',
    lead: 'Sistēmām līdz 10 gadu vecumam — līdz 5 izsaukumiem gadā un rezerves daļu izmaksas segtas līdz €150.',
    included: [
      'Viss, kas iekļauts Komforts plānā',
      'Līdz 5 iekļautiem bojājumu izsaukumiem gadā',
      'Rezerves daļu izmaksas segtas līdz €150 gadā',
      'Pieejams sistēmām līdz 10 gadu vecumam',
    ],
    excluded: [
      'Nav pieejams sistēmām, kas vecākas par 10 gadiem',
      'Daļu izmaksas virs €150 gadā — 10% atlaide',
    ],
  },
]

const FAQ_ITEMS = [
  {
    q: 'Vai man obligāti jāizvēlas kāds plāns?',
    a: 'Nē. Apkopes plāns ir domāts tiem, kas vēlas paredzamu, regulāru apkopi par fiksētu maksu. Ja jums vajadzīgs tikai atsevišķs remonts, uzstādīšana vai santehnikas darbs, to varat pieteikt tieši — bez abonēšanas.',
  },
  {
    q: 'Kā zināt, kurš plāns man der?',
    a: 'Aizpildiet kalkulatoru zemāk — pamatojoties uz sistēmas vecumu un apkopes vēsturi, uzreiz redzēsiet, kurš plāns jums visdrīzāk piemērots, un varēsiet pieteikties izvērtēšanai.',
  },
  {
    q: 'Vai plānu var mainīt vēlāk?',
    a: 'Jā. Ja jūsu sistēma vai vajadzības mainās, pārejam uz citu plānu nākamajā apkopes reizē — bez soda naudas.',
  },
  {
    q: 'Kāpēc Komforts Pilns plāns nav pieejams vecākām sistēmām?',
    a: 'Sistēmām, kas vecākas par 10 gadiem, detaļu nolietojuma risks ir ievērojami augstāks — tas ir reāls tehnisks ierobežojums, nevis mārketinga triks. Šīm sistēmām piemērotāks ir Komforts plāns.',
  },
  {
    q: 'Kas notiek, ja man vajadzīgs izsaukums virs iekļautā skaita?',
    a: 'Tas notiek reti — vairumam māju pietiek ar iekļauto skaitu. Ja tomēr vajag vairāk, papildu izsaukumu piesakāt par pazeminātu abonenta cenu, nevis par pilnu tirgus cenu. Precīzu likmi pateiksim zvanā.',
  },
  {
    q: 'Vai apkopes maksa ir ikmēneša vai vienreizēja?',
    a: 'Plāna maksu var kārtot ikmēneša maksājumos vai kā vienu ikgadēju maksājumu — precīzus nosacījumus vienojamies zvanā pēc pieteikuma.',
  },
]

export default function ApkopesPlaniPage() {
  return (
    <>
      <PageIntro
        eyebrow="Apkopes plāni"
        h1="Trīs apkopes plāni"
        intro="Ikgadēja apkope ir likumā noteikts minimums. Komforts un Komforts Pilns plāns pievieno iekļautus bojājumu izsaukumus un rezerves daļu atlaidi vai segumu — atkarībā no tā, cik daudz paredzamības jūsu mājai vajag. Plāns nav priekšnoteikums sadarbībai — atsevišķu remontu vai uzstādīšanas darbu varat pieteikt arī bez tā."
        secondaryLabel="Pieteikt darbu bez plāna"
        secondaryHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="plans-grid">
            {PLANS.map((p) => (
              <div className={`plan${p.featured ? ' featured' : ''}`} key={p.name}>
                {p.featured && <div className="match-badge">Populārākais</div>}
                <div className="plan-badge">{p.badge}</div>
                <h3>{p.name}</h3>
                <p className="plan-desc" style={{ marginTop: 14 }}>{p.lead}</p>
                <ul className="plan-includes">
                  {p.included.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <div style={{ marginTop: -10, marginBottom: 22 }}>
                  <div className="fine" style={{ fontWeight: 600, marginBottom: 6, color: 'var(--muted2)' }}>
                    NEIETILPST
                  </div>
                  {p.excluded.map((e) => (
                    <p className="fine" style={{ marginTop: 4 }} key={e}>
                      {e}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt" id="kalkulators">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="section-head center">
            <div className="eyebrow">Uzziniet savu</div>
            <h2>Kurš plāns der jūsu mājai?</h2>
            <p>Četri jautājumi — mēs pateiksim, kurš plāns visdrīzāk der, un pamatosim, kāpēc.</p>
          </div>
          <Suspense fallback={null}>
            <Calculator />
          </Suspense>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par apkopes plāniem" />
    </>
  )
}
