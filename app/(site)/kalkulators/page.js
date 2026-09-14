import { Suspense } from 'react'
import Calculator from '../../../components/Calculator'
import { supabaseServer } from '../../../lib/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Cenas piedāvājums jūsu apkures apkopei — AP Komforts',
  description:
    'Atbildiet uz četriem jautājumiem, un mēs sagatavosim personalizētu apkures apkopes piedāvājumu jūsu mājai.',
}

export default async function KalkulatorsPage() {
  const sb = await supabaseServer()
  const { data: plans } = await sb.from('membership_tier_plans').select('tier').eq('is_active', true)
  const activeTierKeys = (plans || []).map(p => p.tier)

  return (
    <section className="block" style={{ paddingTop: 56 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="section-head center">
          <div className="eyebrow">Cenas piedāvājums</div>
          <h2>Saņemiet piedāvājumu savai apkures apkopei</h2>
          <p>
            Atbildiet uz četriem jautājumiem, un mēs sagatavosim jūsu personalizēto piedāvājumu —
            to paziņosim īsā zvanā, bez saistībām.
          </p>
        </div>
        <Suspense fallback={null}>
          <Calculator activeTierKeys={activeTierKeys} />
        </Suspense>
      </div>
    </section>
  )
}
