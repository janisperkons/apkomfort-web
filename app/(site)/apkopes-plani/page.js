import { Suspense } from 'react'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import Calculator from '../../../components/Calculator'
import { supabaseServer } from '../../../lib/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Apkopes plāni — Apkope, Komforts, Komforts Pilns — AP Komforts',
  description:
    'Trīs apkures katlu un siltumsūkņu apkopes plāni Rīgā un Pierīgā — kas iekļauts, kas neietilpst, un kā izvēlēties sev piemērotāko.',
}

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
    a: 'Tas notiek reti — vairumam māju pietiek ar iekļauto skaitu. Ja tomēr vajag vairāk, papildu izsaukumam piemēro 10% atlaidi no standarta izsaukuma cenas, nevis pilnu tirgus cenu.',
  },
  {
    q: 'Vai apkopes maksa ir ikmēneša vai vienreizēja?',
    a: 'Plāna maksu var kārtot ikmēneša maksājumos vai kā vienu ikgadēju maksājumu — precīzus nosacījumus vienojamies zvanā pēc pieteikuma.',
  },
]

export default async function ApkopesPlaniPage() {
  const sb = await supabaseServer()
  const [{ data: plans }, { data: benefits }] = await Promise.all([
    sb.from('membership_tier_plans').select('*').eq('is_active', true).order('sort_order'),
    sb.from('membership_tier_benefits').select('*').order('sort_order'),
  ])
  const activeTierKeys = (plans || []).map(p => p.tier)

  return (
    <>
      <PageIntro
        eyebrow="Apkopes plāni"
        h1={plans?.length === 3 ? 'Trīs apkopes plāni' : `${plans?.length || 0} apkopes plāni`}
        intro="Ikgadēja apkope ir likumā noteikts minimums. Komforts un Komforts Pilns plāns pievieno iekļautus bojājumu izsaukumus un rezerves daļu atlaidi vai segumu — atkarībā no tā, cik daudz paredzamības jūsu mājai vajag. Plāns nav priekšnoteikums sadarbībai — atsevišķu remontu vai uzstādīšanas darbu varat pieteikt arī bez tā."
        secondaryLabel="Pieteikt darbu bez plāna"
        secondaryHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="plans-grid">
            {(plans || []).map(p => {
              const tierBenefits = (benefits || []).filter(b => b.tier === p.tier)
              const included = tierBenefits.filter(b => b.kind === 'included')
              const excluded = tierBenefits.filter(b => b.kind === 'excluded')
              return (
                <div className={`plan${p.is_featured ? ' featured' : ''}`} key={p.tier}>
                  {p.is_featured && <div className="match-badge">Populārākais</div>}
                  <div className="plan-badge">{p.badge}</div>
                  <h3>{p.name}</h3>
                  <p className="plan-desc" style={{ marginTop: 14 }}>{p.lead}</p>
                  <ul className="plan-includes">
                    {included.map(i => <li key={i.id}>{i.body}</li>)}
                  </ul>
                  {excluded.length > 0 && (
                    <div style={{ marginTop: -10, marginBottom: 22, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: 'var(--muted)' }}>
                        Neietilpst
                      </div>
                      {excluded.map(e => (
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)', marginTop: 4 }} key={e.id}>
                          {e.body}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
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
            <Calculator activeTierKeys={activeTierKeys} />
          </Suspense>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par apkopes plāniem" />
    </>
  )
}
