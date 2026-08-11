import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'
import Faq from '../../../components/Faq'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Vai gāzes katla apkope ir obligāta? MK noteikumi Nr. 78 — AP Komfort',
  description:
    'Gāzes iekārtu apkope ir juridisks pienākums, ne ieteikums — MK noteikumi Nr. 78. Kas atbild, kas notiek, ja apkope nav veikta, un ko saņemat pēc apkopes.',
}

const FAQ_ITEMS = [
  {
    q: 'Kas atbild par apkopes veikšanu — īpašnieks vai īrnieks?',
    a: 'Pienākums gulstas uz īpašumu — praksē to organizē tas, kurš pārvalda objektu. Ja māja tiek izīrēta, ieteicams to skaidri atrunāt īres līgumā.',
  },
  {
    q: 'Cik bieži jāveic apkope, lai izpildītu šo pienākumu?',
    a: 'Reizi gadā. Retāka apkope nozīmē, ka objekts vairs neatbilst noteikumiem, arī tad, ja katls turpina darboties bez redzamām problēmām.',
  },
  {
    q: 'Ko darīt, ja neatceros, kad bija pēdējā apkope?',
    a: 'Piesakieties — apkopes laikā izveidosim jums pilnu servisa vēsturi, lai turpmāk to vairs nevajadzētu atcerēties pašiem.',
  },
]

export default function GazesKatlaApkopeObligataPage() {
  return (
    <>
      <PageIntro
        eyebrow="Regulējums"
        h1="Vai gāzes katla apkope ir obligāta?"
        intro="Īsā atbilde: jā. Tas nav ieteikums vai labā prakse — tas ir juridisks pienākums, ko nosaka MK noteikumi Nr. 78."
        ctaLabel="Pieteikt obligāto apkopi"
        ctaHref="/kalkulators/"
      />

      <section className="block">
        <div className="wrap">
          <div className="prose">
            <h2>Ko nosaka MK noteikumi Nr. 78</h2>
            <p>
              Ministru kabineta noteikumi Nr. 78 nosaka gāzes iekārtu tehniskās uzraudzības kārtību
              Latvijā, tostarp pienākumu ikgadēji apkopt gāzes apkures katlus un citas gāzes iekārtas.
              Atbildība par to gulstas uz iekārtas īpašnieku — ne uz gāzes piegādātāju un ne uz
              apkopes uzņēmumu, kamēr apkope nav pieteikta.
            </p>

            <h2>Kas notiek, ja apkope nav veikta</h2>
            <p>
              Ja apkope nav veikta noteiktajā termiņā, Gaso ir tiesības pārtraukt gāzes padevi
              objektam, līdz pienākums tiek izpildīts. Bez juridiskajām sekām pastāv arī reāls drošības
              risks — neapkopta iekārta biežāk rada oglekļa monoksīda vai noplūdes risku.
            </p>

            <h2>Ko saņemat pēc apkopes</h2>
            <p>
              Pēc katras apkopes izsniedzam apkopes aktu — dokumentu, kas apliecina, ka iekārta
              pārbaudīta un atbilst drošas ekspluatācijas noteikumiem. Šo dokumentu varat uzrādīt
              Gaso vai jebkurai citai iestādei, kurai tas nepieciešams.
            </p>

            <div className="note">
              Detalizētu apkopes saturu skatiet{' '}
              <Link href="/gazes-katlu-apkope/">gāzes katlu apkopes lapā</Link>.
            </div>
          </div>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Jautājumi" heading="Biežāk uzdotie jautājumi par obligāto apkopi" />

      <CtaBand heading="Pieteikt obligāto ikgadējo apkopi" primaryLabel="Pieteikt obligāto apkopi" />
    </>
  )
}
