import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Biežāk uzdotie jautājumi par apkuri — AP Komforts',
  description:
    'Cik bieži jāveic apkures katla apkope, cik tā maksā, kad jāmaina katls un kas ietilpst apkopes plānos — atbildes uz biežākajiem jautājumiem.',
}

const FAQ_ITEMS = [
  {
    q: 'Cik bieži jāveic apkures katla apkope?',
    a: 'Vismaz reizi gadā. Gāzes katliem tas ir arī likumā noteikts pienākums (MK noteikumi Nr. 78) — pārējiem katlu veidiem ikgadēja apkope ir stingri ieteicama garantijas un drošas ekspluatācijas dēļ.',
  },
  {
    q: 'Cik maksā apkures katla apkope?',
    a: 'Cena atkarīga no sistēmas veida, vecuma, īpašuma lieluma un apkopes vēstures — nevis vienota likme visiem. Aizpildiet kalkulatoru, lai uzzinātu savu cenu tiešsaistē.',
  },
  {
    q: 'Kad jāmaina apkures katls, nevis jāremontē?',
    a: 'Parasti, kad katls vecāks par 15 gadiem, remonti kļuvuši biežāki par jaunas iekārtas ikgadējām izmaksām, vai rezerves daļas vairs grūti atrodamas. Skatiet mūsu lapu par katla nomaiņu.',
  },
  {
    q: 'Kas ietilpst apkopes plānos?',
    a: 'Apkope plāns ietver ikgadēju plānotu apkopi. Komforts plāns pievieno līdz 3 iekļautiem bojājumu izsaukumiem gadā un 10% atlaidi rezerves daļām. Komforts Pilns plāns pievieno līdz 5 izsaukumiem gadā un rezerves daļu segumu līdz €150 gadā — pieejams sistēmām līdz 10 gadu vecumam. Detalizēti skatiet apkopes plānu lapā.',
  },
  {
    q: 'Vai plāns ir obligāts, lai pieteiktu remontu vai citu darbu?',
    a: 'Nē. Apkopes plāns ir domāts regulārai, paredzamai apkopei. Atsevišķu remontu, uzstādīšanu vai santehnikas darbu varat pieteikt jebkurā brīdī bez plāna — vienkārši sazinieties ar mums.',
  },
  {
    q: 'Vai apkalpojat arī siltumsūkņus un santehniku, ne tikai gāzes katlus?',
    a: 'Jā — apkalpojam visus apkures sistēmu veidus, siltumsūkņus un vispārējus santehnikas darbus. Viens speciālists visai mājai.',
  },
  {
    q: 'Kāda ir jūsu apkalpošanas zona?',
    a: 'Rīga un Pierīga — Mārupe, Ādaži, Ķekava, Ropaži, Salaspils, Jūrmala, Olaine, Babīte un tuvākie novadi. Ja jūsu novada šajā sarakstā nav, piezvaniet — visdrīzāk braucam arī tur.',
  },
  {
    q: 'Ko darīt, ja jūtu gāzes smaku?',
    a: 'Nekavējoties zvaniet Gaso avārijas dienestam 114 un pametiet telpu — tas ir pirmais solis vienmēr, pirms zvana mums vai jebkuram citam.',
  },
  {
    q: 'Vai varu saņemt valsts atbalstu, mainot uz siltumsūkni?',
    a: 'Bieži jā, caur EKII programmu. Kārtojam pieteikumu jūsu vietā — skatiet lapu par valsts atbalstu.',
  },
]

export default function BiezakUzdotieJautajumiPage() {
  return (
    <>
      <PageIntro
        eyebrow="Jautājumi"
        h1="Biežāk uzdotie jautājumi par apkuri"
        intro="Visbiežākie jautājumi par apkopi, cenu, plāniem un nomaiņu — vienuviet."
      />

      <Faq items={FAQ_ITEMS} eyebrow="BUJ" heading="Jautājumi un atbildes" />

      <CtaBand />
    </>
  )
}
