import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Apkures katlu remonts un diagnostika — AP Komfort',
  description:
    'Apkures katlu un siltumsūkņu remonts un diagnostika Rīgā un Pierīgā. Kļūdas kods displejā, katls neieslēdzas vai zaudē spiedienu — noskaidrosim, kas noticis.',
}

const SYMPTOMS = [
  { title: 'Katls neieslēdzas', body: 'Bieži vien iemesls ir vienkāršs — spiediens, aizdedze vai sensors. Diagnosticējam uz vietas.' },
  { title: 'Kļūdas kods displejā', body: 'Katram ražotājam savs kodu saraksts — nosakām, ko tas nozīmē jūsu modelim.' },
  { title: 'Zaudē spiedienu', body: 'Var norādīt uz noplūdi sistēmā vai bojātu izplešanās tvertni.' },
  { title: 'Nav karstā ūdens', body: 'Bieži saistīts ar siltummaini vai trīsceļu vārstu.' },
  { title: 'Dīvaina smaka vai troksnis', body: 'Nekad neignorējiet — pieteikt diagnostiku uzreiz ir drošāk nekā gaidīt.' },
  { title: 'Katls izslēdzas pats no sevis', body: 'Bieži drošības sistēmas reakcija uz kādu citu problēmu — jānoskaidro cēlonis, ne tikai jārestartē.' },
]

const FAQ_ITEMS = [
  {
    q: 'Vai remonts ir iekļauts apkopes plānā?',
    a: 'Komforts un Komforts Pilns plāna dalībniekiem bojājumu izsaukums (darbaspēks) ir iekļauts bez papildu maksas. Rezerves daļu izmaksas vienmēr saskaņojam atsevišķi pirms darba sākšanas.',
  },
  {
    q: 'Man nav apkopes plāna — vai varat tomēr atbraukt?',
    a: 'Jā, remonta un diagnostikas izsaukumus pieņemam arī bez plāna — cenu apstiprinām zvanā pirms darba sākšanas.',
  },
  {
    q: 'Vai varu pateikt jums kļūdas kodu pa telefonu, lai zinātu, ko sagaidīt?',
    a: 'Noteikti — tas palīdz mums ierasties ar pareizajām detaļām un paātrina remontu.',
  },
]

export default function ApkuresRemontsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Remonts un diagnostika"
        h1="Apkures katlu remonts un diagnostika"
        intro="Katls neieslēdzas, rāda kļūdas kodu vai zaudē spiedienu? Nosakām cēloni un salabojam — nevis tikai apstādinām simptomu uz laiku."
        ctaLabel="Pieteikt remontu"
        ctaHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Biežākās pazīmes</div>
            <h2>Kāda ir jūsu situācija?</h2>
          </div>
          <div className="grid g3">
            {SYMPTOMS.map((s) => (
              <div className="card" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand heading="Aprakstiet problēmu — pieteiksim diagnostiku" primaryHref="/kontakti/" primaryLabel="Pieteikt remontu" />
    </>
  )
}
