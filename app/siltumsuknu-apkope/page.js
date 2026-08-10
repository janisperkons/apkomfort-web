import Link from 'next/link'
import PageIntro from '../../components/PageIntro'
import Faq from '../../components/Faq'
import CtaBand from '../../components/CtaBand'

export const metadata = {
  title: 'Siltumsūkņu apkope un serviss — AP Komfort',
  description:
    'Gaiss-gaiss, gaiss-ūdens un grunts siltumsūkņu apkope un serviss Rīgā un Pierīgā. Ikgadēja apkope saglabā efektivitāti un ražotāja garantiju.',
}

const TYPES = [
  { title: 'Gaiss-gaiss', body: 'Sadzīves siltumsūkņi telpu apkurei un dzesēšanai — visizplatītākais tips Latvijā.' },
  { title: 'Gaiss-ūdens', body: 'Pieslēgti mājas apkures sistēmai un karstā ūdens sagatavei.' },
  { title: 'Grunts (zeme-ūdens)', body: 'Visefektīvākais, bet arī visdārgākais tips — prasa specifiskas zināšanas.' },
]

const INCLUDED = [
  'Ārējā un iekšējā bloka tīrīšana',
  'Filtru pārbaude un tīrīšana',
  'Dzesēšanas kontūra noplūžu pārbaude',
  'Elektrisko savienojumu un darbības pārbaude',
  'Efektivitātes (COP) mērījums',
  'Servisa atskaite un nākamās apkopes atgādinājums',
]

const FAQ_ITEMS = [
  {
    q: 'Vai siltumsūknim tiešām nepieciešama ikgadēja apkope?',
    a: 'Jā — netīrs filtrs vai ārējais bloks var pazemināt efektivitāti par 10–20%, kas tiešā veidā palielina jūsu elektrības rēķinu. Apkope arī saglabā ražotāja garantiju.',
  },
  {
    q: 'Vai palīdzat ar valsts atbalstu siltumsūkņa iegādei?',
    a: 'Jā — ja apsverat sistēmas nomaiņu vai jaunu uzstādīšanu, varam palīdzēt ar EKII atbalsta pieteikumu. Vairāk lasiet valsts atbalsta lapā.',
  },
  {
    q: 'Cik bieži jātīra filtri pašam starp apkopēm?',
    a: 'Ieteicams pārbaudīt iekšējā bloka filtrus reizi 1–2 mēnešos intensīvas lietošanas sezonā — tas ir vienkārši izdarāms pašiem un pagarina laiku līdz nākamajai profesionālajai apkopei.',
  },
]

export default function SiltumsuknuApkopePage() {
  return (
    <>
      <PageIntro
        eyebrow="Siltumsūkņi"
        h1="Siltumsūkņu apkope un serviss"
        intro="Siltumsūknis ir ilgtermiņa ieguldījums — tā efektivitāte tieši ietekmē jūsu elektrības rēķinu. Ikgadēja apkope saglabā gan efektivitāti, gan ražotāja garantiju."
        ctaLabel="Pieteikt apkopi"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Sistēmas veidi</div>
            <h2>Apkalpojam visus siltumsūkņu tipus</h2>
          </div>
          <div className="grid g3">
            {TYPES.map((t) => (
              <div className="card" key={t.title}>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kas iekļauts</div>
            <h2>Ko ietver siltumsūkņa apkope</h2>
          </div>
          <ul className="plan-includes" style={{ maxWidth: 560 }}>
            {INCLUDED.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="note" style={{ maxWidth: 700 }}>
            Apsverat siltumsūkņa iegādi vai nomaiņu? Valsts EKII programma sedz daļu izmaksu —{' '}
            <Link href="/valsts-atbalsts-siltumsuknim/">uzziniet, kā piesakāmies jūsu vietā</Link>.
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} />

      <CtaBand />
    </>
  )
}
