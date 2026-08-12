import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Santehnikas darbi Rīgā un Pierīgā — AP Komforts',
  description:
    'Santehnikas darbi — cauruļvadu, sildķermeņu un ūdens sildītāju uzstādīšana, remonts un avārijas novēršana. Tas pats speciālists, kas apkopj jūsu apkuri.',
}

const SERVICES = [
  { title: 'Cauruļvadu montāža un remonts', body: 'Ūdens un apkures cauruļvadu ierīkošana, nomaiņa un noplūžu novēršana.' },
  { title: 'Sildķermeņu uzstādīšana', body: 'Radiatoru pieslēgšana, nomaiņa un sistēmas balansēšana.' },
  { title: 'Ūdens sildītāji un boileri', body: 'Uzstādīšana, apkope un remonts — elektriskie un netiešā sildīšana.' },
  { title: 'Santehnikas avārijas', body: 'Caurule plīsusi vai applūst? Ātra diagnostika un bojājuma novēršana.' },
]

const FAQ_ITEMS = [
  {
    q: 'Vai santehnikas darbus veic tas pats speciālists, kas apkopj apkuri?',
    a: 'Jā — tā ir mūsu pieeja: viens sertificēts speciālists visām mājas siltuma un ūdens sistēmām, nevis atsevišķa firma katrai.',
  },
  {
    q: 'Ko darīt, ja ir avārija — plīsusi caurule vai applūdums?',
    a: 'Zvaniet uzreiz — santehnikas avārijas skatām kā prioritāti. Skatiet arī avārijas izsaukuma lapu par to, kā tas notiek ārpus darba laika.',
  },
  {
    q: 'Vai uzstādāt jaunus radiatorus un boilerus, vai tikai remontējat esošos?',
    a: 'Abus — gan jaunu iekārtu uzstādīšanu, gan esošo remontu un apkopi.',
  },
]

export default function SantehnikasDarbiPage() {
  return (
    <>
      <PageIntro
        eyebrow="Santehnika"
        h1="Santehnikas darbi Rīgā un Pierīgā"
        intro="Cauruļvadi, sildķermeņi, ūdens sildītāji un avārijas novēršana — tas pats speciālists, kas pazīst jūsu apkures sistēmu, nevis svešs cilvēks katru reizi no jauna."
        ctaLabel="Pieteikt darbu"
        ctaHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="grid g4">
            {SERVICES.map((s) => (
              <div className="card" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
