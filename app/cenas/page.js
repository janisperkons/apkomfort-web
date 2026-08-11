import PageIntro from '../../components/PageIntro'
import Faq from '../../components/Faq'
import CtaBand from '../../components/CtaBand'

export const metadata = {
  title: 'Cenas — apkures katla apkope, izsaukums, remonts — AP Komfort',
  description:
    'Apkures katlu apkope, siltumsūkņu serviss un avārijas izsaukumu cenas Rīgā un Pierīgā. Cena atkarīga no sistēmas — aprēķiniet savu tiešsaistē.',
}

const FACTORS = [
  { num: '01', title: 'Sistēmas veids', body: 'Gāzes, elektriskais, granulu katls vai siltumsūknis — katram sava apkopes darbietilpība.' },
  { num: '02', title: 'Sistēmas vecums', body: 'Vecākai sistēmai parasti nepieciešama rūpīgāka pārbaude un vairāk laika.' },
  { num: '03', title: 'Īpašuma lielums', body: 'Lielāka sistēma un vairāk sildķermeņu nozīmē garāku apkopes laiku.' },
  { num: '04', title: 'Apkopes vēsture', body: 'Sen neapkoptai sistēmai pirmajā vizītē var atklāties papildu darbi.' },
]

const FAQ_ITEMS = [
  {
    q: 'Kāpēc mājaslapā nav vienas fiksētas cenas?',
    a: 'Tāpēc, ka tā būtu neprecīza. Divu māju apkures sistēmas var atšķirties tik ļoti, ka viena cena visiem nozīmētu vai nu pārmaksu, vai nesegtu reālo darba apjomu. Kalkulators aizņem dažas minūtes un dod precīzāku ainu nekā jebkurš vienots cenrādis.',
  },
  {
    q: 'Vai izvērtēšana un piedāvājums maksā?',
    a: 'Nē. Pieteikuma iesniegšana, kalkulators un zvans, kurā apstiprinām cenu, ir bez maksas un bez saistībām.',
  },
  {
    q: 'Vai cena var mainīties pēc apkopes sākšanas?',
    a: 'Pamatcenu vienmēr apstiprinām zvanā pirms darba sākšanas. Ja apkopes laikā atklājas kaut kas neparedzēts — piemēram, nomaināma detaļa — to izmaksu vienmēr saskaņojam ar jums atsevišķi, pirms to veicam.',
  },
  {
    q: 'Vai cenā iekļauts PVN?',
    a: 'Jā, zvanā apstiprinātā un rēķinā norādītā cena vienmēr ir ar PVN.',
  },
]

export default function CenasPage() {
  return (
    <>
      <PageIntro
        eyebrow="Cenas"
        h1="Cenas — apkope, izsaukums, remonts"
        intro="Nav vienas cenas visiem. Apkures katla vai siltumsūkņa apkopes cena atkarīga no jūsu sistēmas, tās vecuma un stāvokļa — zemāk skaidrojam, kas to ietekmē, un kā uzzināt savu cenu tiešsaistē."
        ctaLabel="Aprēķināt cenu"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kas ietekmē cenu</div>
            <h2>Četri faktori nosaka cenu</h2>
            <p>Tie paši faktori, ko izmanto mūsu kalkulators — bez apslēptiem mainīgajiem.</p>
          </div>
          <div className="grid g4">
            {FACTORS.map((f) => (
              <div className="card" key={f.num}>
                <div className="num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="prose" style={{ maxWidth: 700 }}>
            <h2>Kā strādājam ar cenu</h2>
            <ul>
              <li>
                <strong>Cena vienmēr apstiprināta pa telefonu pirms darba sākšanas</strong> — jūs to
                zināt, pirms inženieris ierodas.
              </li>
              <li>
                <strong>PVN vienmēr iekļauts</strong> galīgajā, apstiprinātajā cenā.
              </li>
              <li>
                <strong>Rezerves daļu izmaksas saskaņojam atsevišķi</strong>, ja apkopes laikā
                atklājas kaut kas neparedzēts — nekad bez jūsu piekrišanas.
              </li>
              <li>
                <strong>Komforts un Komforts Pilns plāna dalībniekiem</strong> bojājumu izsaukums ir
                iekļauts plānā — bez papildu maksas par pašu izsaukumu.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par cenu" />

      <CtaBand />
    </>
  )
}
