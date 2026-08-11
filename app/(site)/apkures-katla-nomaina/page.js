import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Apkures katla nomaiņa un uzstādīšana — AP Komfort',
  description:
    'Apkures katla nomaiņa un uzstādīšana Rīgā un Pierīgā. Izvērtēšana, tāme, uzstādīšana un nodošana ar pilnu dokumentāciju.',
}

const SIGNS = [
  'Katls vecāks par 15 gadiem',
  'Remonti kļuvuši biežāki un dārgāki par jaunas iekārtas ikgadējām izmaksām',
  'Rezerves daļas jūsu modelim vairs grūti atrodamas',
  'Kurināmā vai elektrības patēriņš pieaudzis, lai gan lietošanas paradumi nav mainījušies',
]

const STEPS = [
  { n: '1', title: 'Apskate un izvērtēšana', body: 'Novērtējam esošo sistēmu un jūsu mājas vajadzības — vai nomaiņa tiešām ir izdevīgāka par remontu.' },
  { n: '2', title: 'Piedāvājums un tāme', body: 'Saņemat konkrētu piedāvājumu ar iekārtas izvēli un darbu apjomu.' },
  { n: '3', title: 'Uzstādīšana', body: 'Veco iekārtu demontējam, jauno uzstādām un pieslēdzam atbilstoši normatīviem.' },
  { n: '4', title: 'Nodošana', body: 'Sistēmu nododam ar pilnu dokumentāciju un apmācām, kā to lietot.' },
]

const FAQ_ITEMS = [
  {
    q: 'Kā zināt, vai izdevīgāka ir nomaiņa vai remonts?',
    a: 'Apskates laikā salīdzinām remonta izmaksas un atlikušo kalpošanas laiku ar jaunas iekārtas cenu un efektivitātes ieguvumu — un pasakām godīgu ieteikumu, ne tikai pārdodam jaunu katlu.',
  },
  {
    q: 'Vai piedāvājat maksājumu sadalīšanu?',
    a: 'Lielākiem darbiem varam piedāvāt sadalītu maksājumu grafiku — to pārrunājam, gatavojot piedāvājumu.',
  },
  {
    q: 'Vai nomaiņa uz siltumsūkni saņem valsts atbalstu?',
    a: 'Daudzos gadījumos jā — skatiet mūsu lapu par valsts atbalstu siltumsūkņa iegādei.',
  },
  {
    q: 'Cik ilgs ir uzstādīšanas process?',
    a: 'Vienkāršai katla nomaiņai bieži pietiek ar vienu dienu. Sarežģītākiem gadījumiem — piemēram, pārejai no cietā kurināmā uz siltumsūkni — laiku precizējam apskates laikā.',
  },
]

export default function ApkuresKatlaNomainaPage() {
  return (
    <>
      <PageIntro
        eyebrow="Nomaiņa un uzstādīšana"
        h1="Apkures katla nomaiņa un uzstādīšana"
        intro="Ne katrs vecs katls jāremontē līdz pēdējam. Palīdzam saprast, kad nomaiņa ir gudrāka izvēle, un veicam to no izvērtēšanas līdz nodošanai."
        ctaLabel="Saņemt tāmi"
        ctaHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kad apsvērt nomaiņu</div>
            <h2>Pazīmes, ka remonts vairs nav labākais risinājums</h2>
          </div>
          <ul className="plan-includes" style={{ maxWidth: 560 }}>
            {SIGNS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Process</div>
            <h2>No apskates līdz nodošanai</h2>
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

      <section className="block">
        <div className="wrap">
          <div className="note" style={{ maxWidth: 700 }}>
            Nomaināt uz siltumsūkni? Bieži pieejams valsts atbalsts iegādei —{' '}
            <Link href="/valsts-atbalsts-siltumsuknim/">uzziniet, kā piesakāmies jūsu vietā</Link>.
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par katla nomaiņu" />

      <CtaBand heading="Saņemiet individuālu tāmi" primaryHref="/kontakti/" primaryLabel="Saņemt tāmi" />
    </>
  )
}
