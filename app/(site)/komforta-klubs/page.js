import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Komforta klubs — AP Komfort',
  description:
    'Pievienojieties Komforta klubam — ikgadēja apkures katla apkope, prioritāte bojājumu gadījumā un viens pastāvīgs speciālists visām mājas siltuma sistēmām.',
}

const BENEFITS = [
  { num: '01', title: 'Nekas nav jāatceras', body: 'Paši atgādinām, kad pienācis laiks nākamajai apkopei — nevis gaidām, kad kaut kas salūst.' },
  { num: '02', title: 'Prioritāte', body: 'Dalībnieku izsaukumus apstrādājam pirms tiem, kam nav dalības.' },
  { num: '03', title: 'Viens pastāvīgs speciālists', body: 'Tas pats sertificēts inženieris katru reizi — cilvēks, kas pazīst jūsu māju.' },
  { num: '04', title: 'Skaidri nosacījumi', body: 'Zināt precīzi, kas iekļauts un kas nē, jau pirms pievienošanās — bez pārsteigumiem.' },
]

const TIERS = [
  { badge: 'Apkope', name: 'Apkope plāns', body: 'Pamats — ikgadēja plānota apkope.' },
  { badge: 'Komforts', name: 'Komforts plāns', body: 'Apkope plus neierobežoti bojājumu izsaukumi.' },
  { badge: 'Komforts Pilns', name: 'Komforts Pilns plāns', body: 'Komforts plāns plus daļu izmaksas iekļautas.' },
]

const STEPS = [
  { n: '1', title: 'Piesakāties', body: 'Aizpildiet kalkulatoru vai izvēlieties dalības līmeni tieši.' },
  { n: '2', title: 'Sarunājam zvanā', body: 'Precizējam jūsu sistēmu un vienojamies par nosacījumiem.' },
  { n: '3', title: 'Kļūstat par dalībnieku', body: 'Pirmā apkope tiek ieplānota, un jūsu apkures vēsture sākas.' },
]

const FAQ_ITEMS = [
  {
    q: 'Kā dalība atšķiras no viena pasūtīta darba?',
    a: 'Vienreizējs darbs atrisina konkrētu problēmu šobrīd. Kluba dalība nozīmē, ka apkure tiek pieskatīta ik gadu, jums nav jāatceras termiņi, un — atkarībā no līmeņa — arī bojājumu izsaukumi ir iekļauti.',
  },
  {
    q: 'Kurš dalības līmenis man der?',
    a: 'Aizpildiet kalkulatoru — pamatojoties uz jūsu sistēmas veidu, vecumu un apkopes vēsturi, ieteiksim piemērotāko līmeni un pamatosim, kāpēc.',
  },
  {
    q: 'Vai dalība pieejama visu veidu apkures sistēmām?',
    a: 'Jā — gāzes, elektriskajiem un granulu katliem, kā arī siltumsūkņiem. Komforts Pilns līmenis pieejams sistēmām līdz 10 gadu vecumam — pārējiem diviem līmeņiem šāda ierobežojuma nav.',
  },
  {
    q: 'Man vajadzīgs tikai vienreizējs remonts, ne dalība — vai tas iespējams?',
    a: 'Jā, protams. Atsevišķu remontu, uzstādīšanu vai santehnikas darbu varat pieteikt jebkurā brīdī bez dalības kluba.',
  },
]

export default function KomfortaKlubsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Komforta klubs"
        h1="Pievienojieties Komforta klubam"
        intro="Vairs nav jādomā, kad pienācis laiks nākamajai apkopei. Komforta kluba dalībniekiem apkure paliek sakārtota — mēs paši atgādinām un pieskatām, jūs par to vairs nedomājat."
        ctaLabel="Aprēķināt savu dalību"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Ko iegūstat</div>
            <h2>Kāpēc pievienoties</h2>
          </div>
          <div className="grid g4">
            {BENEFITS.map((b) => (
              <div className="card" key={b.num}>
                <div className="num">{b.num}</div>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Dalības līmeņi</div>
            <h2>Trīs līmeņi — izvēlieties sev piemērotāko</h2>
            <p>Katrs nākamais līmenis iekļauj visu iepriekšējo, plus vēl kaut ko.</p>
          </div>
          <div className="grid g3">
            {TIERS.map((t) => (
              <div className="card" key={t.name}>
                <div className="plan-badge">{t.badge}</div>
                <h3>{t.name}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/apkopes-plani/" className="btn-outline">
              Skatīt pilnu dalības līmeņu salīdzinājumu
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">Kā tas notiek</div>
            <h2>No pieteikuma līdz dalībai</h2>
          </div>
          <div className="grid g3">
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

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par Komforta klubu" />

      <CtaBand
        heading="Gatavi pievienoties Komforta klubam?"
        primaryLabel="Pievienoties"
        secondaryHref="/apkopes-plani/"
        secondaryLabel="Skatīt dalības plānus"
      />
    </>
  )
}
