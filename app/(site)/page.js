import Link from 'next/link'
import HeroCalculator from '../../components/HeroCalculator'
import CtaBand from '../../components/CtaBand'

const DIFFERENTIATORS = [
  {
    num: '01',
    title: 'Cena atbilst jūsu sistēmai',
    body: 'Nevis vienota likme visiem — cenu nosakām pēc jūsu konkrētās iekārtas un apstiprinām sarunā, pirms darbs sākas.',
  },
  {
    num: '02',
    title: 'Viens pastāvīgs speciālists',
    body: 'Plānotu apkopi vai atsevišķu remontu — katru izsaukumu veic tas pats sertificēts inženieris, kas pazīst jūsu māju.',
  },
  {
    num: '03',
    title: 'Skaidri noteikts apkopes plāns',
    body: 'Ikgadēja apkope, pilna servisa vēsture un prioritāte remonta gadījumā par fiksētu ikmēneša maksu.',
  },
  {
    num: '04',
    title: 'Ātra atsaukšanās',
    body: 'Piesakāties tiešsaistē vai piezvanāt — atbildam un vienojamies par nākamo soli īsā laikā.',
  },
]

const WORK_TYPES = [
  {
    eyebrow: 'Apkopes plāns',
    title: 'Regulāra, paredzama apkope',
    body: 'Ikgadēja apkope, pilna servisa vēsture un — atkarībā no izvēlētā plāna — neierobežoti bojājumu izsaukumi par fiksētu ikmēneša maksu. Piemērots, ja vēlaties nedomāt par to, kad pienācis laiks nākamajai apkopei.',
    cta: 'Skatīt apkopes plānus',
    href: '/apkopes-plani/',
  },
  {
    eyebrow: 'Atsevišķs darbs',
    title: 'Remonts, uzstādīšana vai santehnikas darbs',
    body: 'Katla nomaiņa, avārijas remonts, jauna sildķermeņa uzstādīšana vai cita konkrēta vajadzība — piesakāties bez abonēšanas un bez ilgtermiņa saistībām, tieši tad, kad vajadzība rodas.',
    cta: 'Pieteikt darbu',
    href: '/kontakti/',
  },
]

const SERVICES = [
  {
    title: 'Apkures katlu apkope un serviss',
    body: 'Gāzes, elektrības, granulu un cietā kurināmā katlu apkope, regulēšana un remonts.',
    href: '/apkures-katlu-apkope/',
  },
  {
    title: 'Siltumsūkņu apkope',
    body: 'Gaiss-gaiss, gaiss-ūdens un grunts siltumsūkņu apkope, serviss un diagnostika.',
    href: '/siltumsuknu-apkope/',
  },
  {
    title: 'Santehnikas darbi',
    body: 'Cauruļvadu, sildķermeņu, ūdens sildītāju un santehnikas sistēmu uzstādīšana un remonts.',
    href: '/santehnikas-darbi/',
  },
  {
    title: 'Avārijas remonts un diagnostika',
    body: 'Ātra bojājumu diagnostika un remonts, kad apkure, siltumsūknis vai santehnika atsakās strādāt.',
    href: '/apkures-remonts/',
  },
]

const STEPS = [
  { n: '1', title: 'Piesakāties', body: 'Aizpildiet kalkulatoru vai izvēlieties plānu tieši — īss pieteikums bez liekiem jautājumiem.' },
  { n: '2', title: 'Sarunājam zvanā', body: 'Precizējam detaļas un vienojamies par galīgo cenu — bez pārsteigumiem.' },
  { n: '3', title: 'Apkope notiek', body: 'Sertificēts inženieris ierodas, veic apkopi un atstāj pilnu servisa vēsturi.' },
]

const TOWNS = [
  { href: '/apkures-serviss-marupe/', label: 'Mārupē' },
  { href: '/apkures-serviss-adazi/', label: 'Ādažos' },
  { href: '/apkures-serviss-kekava/', label: 'Ķekavā' },
  { href: '/apkures-serviss-ropazi/', label: 'Ropažos' },
  { href: '/apkures-serviss-salaspils/', label: 'Salaspilī' },
  { href: '/apkures-serviss-jurmala/', label: 'Jūrmalā' },
  { href: '/apkures-serviss-olaine/', label: 'Olainē' },
  { href: '/apkures-serviss-babite/', label: 'Babītē' },
]

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="liquid">
          <div className="blob bl1" />
          <div className="blob bl2" />
          <div className="blob bl3" />
        </div>
        <div className="inner">
          <div className="copy">
            <div className="eyebrow">Apkure · Siltumsūkņi · Santehnika · Rīga un Pierīga</div>
            <h1>
              Jūsu personīgais
              <br />
              apkures speciālists
            </h1>
            <p className="sub">
              Apkures katlu apkope, siltumsūkņi, santehnika un avārijas remonts —
              <br />
              viens sertificēts speciālists visām jūsu mājas sistēmām.
            </p>
            <div className="cta">
              <Link href="/kalkulators/" className="btn-p">
                Aprēķināt cenu
              </Link>
              <Link href="/kontakti/" className="btn-g">
                Pieteikt darbu
              </Link>
            </div>
            <p className="fine" style={{ marginTop: 16 }}>
              Nav vajadzīgs apkopes plāns — piesakāties arī pēc atsevišķa remonta vai uzstādīšanas darba.
            </p>
            <ul className="trust">
              <li>20 gadu pieredze</li>
              <li>Sertificēts speciālists</li>
              <li>Rīga un Pierīga</li>
            </ul>
          </div>
          <div className="right">
            <HeroCalculator />
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Mūsu pieeja</div>
            <h2>Kā strādājam ar jūsu māju</h2>
            <p>Šie principi paliek nemainīgi — neatkarīgi no tā, vai runa ir par plānotu apkopi vai vienreizēju izsaukumu.</p>
          </div>
          <div className="grid g4">
            {DIFFERENTIATORS.map((d) => (
              <div className="card" key={d.num}>
                <div className="num">{d.num}</div>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kā strādāt ar mums</div>
            <h2>Divi veidi, kā pieteikties</h2>
            <p>Daļa klientu izvēlas ikgadēju apkopes plānu, daļa sazinās tikai tad, kad rodas konkrēta vajadzība. Abi ceļi ir vienlīdz dabiski.</p>
          </div>
          <div className="grid g2">
            {WORK_TYPES.map((w) => (
              <div className="card" key={w.title}>
                <div className="plan-badge">{w.eyebrow}</div>
                <h3>{w.title}</h3>
                <p style={{ marginTop: 10, marginBottom: 22 }}>{w.body}</p>
                <Link href={w.href} className="btn-outline">
                  {w.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Pakalpojumi</div>
            <h2>Viss, kas saistīts ar siltumu un ūdeni jūsu mājā</h2>
            <p>
              No ikgadējas apkures katlu apkopes līdz avārijas remontam — viena kontaktpersona
              apkurei, siltumsūkņiem un santehnikai.
            </p>
          </div>
          <div className="grid g4">
            {SERVICES.map((s) => (
              <Link href={s.href} className="card service-card" key={s.href}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="service-link">Uzzināt vairāk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Apkopes plāni</div>
            <h2>Trīs apkopes plāni</h2>
            <p>Izvēlieties līmeni, kas atbilst jūsu sistēmai — vai turpiniet pieteikties atsevišķiem darbiem bez plāna.</p>
          </div>
          <div className="plans-grid">
            <div className="plan">
              <div className="plan-badge">Apkope</div>
              <h3>Apkope plāns</h3>
              <p className="plan-desc" style={{ marginTop: 14 }}>Ikgadēja apkope, kas atbilst likumā noteiktajam apkopes grafikam.</p>
              <ul className="plan-includes">
                <li>Ikgadēja plānota apkope</li>
                <li>Izbraukums un darba laiks iekļauts</li>
                <li>Pilna servisa vēsture un atgādinājumi</li>
                <li>Prioritāte pierakstoties uz remontu</li>
              </ul>
              <Link href="/kalkulators/?plan=tier1" className="btn-outline btn-block">
                Pieteikties izvērtēšanai
              </Link>
            </div>
            <div className="plan featured">
              <div className="match-badge">Populārākais</div>
              <div className="plan-badge">Komforts</div>
              <h3>Komforts plāns</h3>
              <p className="plan-desc" style={{ marginTop: 14 }}>Viss no Apkope plāna, plus neierobežoti izsaukumi bojājumu gadījumā.</p>
              <ul className="plan-includes">
                <li>Viss, kas iekļauts Apkope plānā</li>
                <li>Neierobežoti bojājumu izsaukumi</li>
                <li>Mērķis — ierasties tajā pašā dienā</li>
                <li>Bez papildu maksas par izsaukumu</li>
              </ul>
              <Link href="/kalkulators/?plan=tier2" className="btn-p btn-block">
                Pieteikties izvērtēšanai
              </Link>
            </div>
            <div className="plan">
              <div className="plan-badge">Komforts Pilns</div>
              <h3>Komforts Pilns plāns</h3>
              <p className="plan-desc" style={{ marginTop: 14 }}>Viss no Komforts plāna, plus daļu izmaksas iekļautas noteiktā apmērā.</p>
              <ul className="plan-includes">
                <li>Viss, kas iekļauts Komforts plānā</li>
                <li>Daļu izmaksas iekļautas noteiktā apmērā</li>
                <li>Pieejams sistēmām līdz 10 gadu vecumam</li>
                <li>Nav pieejams vecākām sistēmām</li>
              </ul>
              <Link href="/kalkulators/?plan=tier3" className="btn-outline btn-block">
                Pieteikties izvērtēšanai
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head center">
            <div className="eyebrow">Kā tas notiek</div>
            <h2>No pieteikuma līdz pabeigtai apkopei</h2>
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

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Apkalpojam</div>
            <h2>Rīga un Pierīga</h2>
            <p>Un ja jūsu novada šeit nav — piezvaniet, visdrīzāk braucam arī tur.</p>
          </div>
          <div className="town-list">
            {TOWNS.map((t) => (
              <Link href={t.href} key={t.href}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Apkope vai atsevišķs darbs — sākam ar īsu sarunu"
        secondaryHref="/kontakti/"
        secondaryLabel="Pieteikt darbu"
      />
    </>
  )
}
