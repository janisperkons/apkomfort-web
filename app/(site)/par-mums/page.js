import PageIntro from '../../../components/PageIntro'
import CtaBand from '../../../components/CtaBand'

export const metadata = {
  title: 'Par mums — 20 gadu pieredze apkures sistēmās — AP Komfort',
  description: 'AP Komfort — apkures katlu apkope, siltumsūkņi un santehnika Rīgā un Pierīgā. Iepazīstieties ar inženieri, kas apkalpo jūsu māju.',
}

const PRINCIPLES = [
  { num: '01', title: 'Viens speciālists', body: 'Ne mainīgs darbinieks no zvanu centra — cilvēks, kas atceras jūsu māju un tās vēsturi.' },
  { num: '02', title: 'Pilna servisa vēsture', body: 'Katra apkope tiek pierakstīta, lai zinātu, kas darīts un kad nākamā reize.' },
  { num: '03', title: 'Cena vienmēr pirms darba', body: 'Nekad nesākam darbu, pirms cena nav apstiprināta sarunā.' },
]

export default function ParMumsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Par mums"
        h1="20 gadu pieredze apkures sistēmās"
        intro="AP Komfort ir jauns uzņēmums — bet aiz tā stāv inženieris ar divdesmit gadu personīgo pieredzi apkures katlu, siltumsūkņu un santehnikas sistēmās."
        ctaLabel="Sazināties"
        ctaHref="/kontakti/"
      />

      <section className="block">
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: 'center' }}>
            <div className="card">
              <div className="plan-badge">Sertificēts inženieris</div>
              <h3>Aleksejs Perkons</h3>
              <p className="plan-desc" style={{ marginTop: 14 }}>
                Divdesmit gadu pieredze apkures katlu, siltumsūkņu un santehnikas sistēmu apkopē un
                remontā. Katru izsaukumu veic personīgi — bez apakšuzņēmējiem un bez nejaušiem
                darbiniekiem, kurus redzat pirmo reizi.
              </p>
              <p className="fine" style={{ marginTop: 14 }}>Sertifikāta Nr. — pievienots tuvākajā laikā.</p>
            </div>
            <div className="prose">
              <h2>Jauns uzņēmums, pieredzējis speciālists</h2>
              <p>
                AP Komfort kā uzņēmums ir dibināts nesen, un mēs to nekad nemēģināsim slēpt aiz
                pārspīlētiem apgalvojumiem par gadu desmitiem tirgū. Pieredze, kas faktiski stāv aiz
                katras apkopes, ir viena cilvēka — Alekseja — divdesmit gadu praktiskā darba
                apkures, siltumsūkņu un santehnikas sistēmās. Tas ir tas, ko saņemat, kad
                piesakāties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Kā strādājam</div>
            <h2>Trīs principi, kas nemainās</h2>
          </div>
          <div className="grid g3">
            {PRINCIPLES.map((p) => (
              <div className="card" key={p.num}>
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading="Iepazīstiet mūs klātienē" body="Pirmā apskate palīdz izprast jūsu sistēmu — un mums iepazīt jūsu māju." primaryLabel="Sazināties" primaryHref="/kontakti/" />
    </>
  )
}
