import { Suspense } from 'react'
import Link from 'next/link'
import PageIntro from '../../components/PageIntro'
import Faq from '../../components/Faq'
import Calculator from '../../components/Calculator'

export const metadata = {
  title: 'Apkopes plāni — Apkope, Komforts, Komforts Pilns — AP Komfort',
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
    lead: 'Visbiežāk izvēlētais — apkope plus neierobežoti izsaukumi, ja kaut kas salūst.',
    included: [
      'Viss, kas iekļauts Apkope plānā',
      'Neierobežoti bojājumu izsaukumi (darbaspēks)',
      'Mērķis — ierasties tajā pašā dienā',
      'Bez papildu maksas par pašu izsaukumu',
    ],
    excluded: ['Rezerves daļu izmaksas — paziņotas atsevišķi pirms darba sākuma'],
    featured: true,
  },
  {
    badge: 'Komforts Pilns',
    name: 'Komforts Pilns plāns',
    lead: 'Sistēmām līdz 10 gadu vecumam — daļu izmaksas iekļautas noteiktā apmērā.',
    included: [
      'Viss, kas iekļauts Komforts plānā',
      'Daļu izmaksas iekļautas noteiktā apmērā gadā',
      'Pieejams sistēmām līdz 10 gadu vecumam',
    ],
    excluded: [
      'Nav pieejams sistēmām, kas vecākas par 10 gadiem',
      'Daļu izmaksas virs noteiktā apmēra tiek paziņotas atsevišķi',
    ],
  },
]

const FAQ_ITEMS = [
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
    q: 'Vai apkopes maksa ir ikmēneša vai vienreizēja?',
    a: 'Plāna maksu var kārtot ikmēneša maksājumos vai kā vienu ikgadēju maksājumu — precīzus nosacījumus vienojamies zvanā pēc pieteikuma.',
  },
]

export default function ApkopesPlaniPage() {
  return (
    <>
      <PageIntro
        eyebrow="Apkopes plāni"
        h1="Trīs plāni. Nekāda sīkā druka."
        intro="Ikgadēja apkope ir likumā noteikts minimums. Komforts un Komforts Pilns plāns pievieno neierobežotus izsaukumus un iekļautas daļu izmaksas — atkarībā no tā, cik daudz paredzamības jūsu mājai vajag."
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
