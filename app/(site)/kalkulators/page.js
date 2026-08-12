import { Suspense } from 'react'
import Calculator from '../../../components/Calculator'

export const metadata = {
  title: 'Cenas kalkulators — cik maksā jūsu apkures apkope? — AP Komforts',
  description:
    'Četri jautājumi, orientējoša cena uzreiz. Uzziniet, cik maksā apkures katla vai siltumsūkņa apkopes plāns jūsu mājai.',
}

export default function KalkulatorsPage() {
  return (
    <section className="block" style={{ paddingTop: 56 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="section-head center">
          <div className="eyebrow">Cenas kalkulators</div>
          <h2>Cik maksā jūsu apkures apkope?</h2>
          <p>
            Atbildiet uz četriem jautājumiem, un mēs sagatavosim jūsu personalizēto piedāvājumu —
            to paziņosim īsā zvanā, bez saistībām.
          </p>
        </div>
        <Suspense fallback={null}>
          <Calculator />
        </Suspense>
      </div>
    </section>
  )
}
