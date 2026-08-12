import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'
import TierEditor from './tier-editor'

export const dynamic = 'force-dynamic'

export default async function Klubs() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs')

  const [{ data: plans }, { data: benefits }] = await Promise.all([
    sb.from('membership_tier_plans').select('*').order('sort_order'),
    sb.from('membership_tier_benefits').select('*').order('sort_order'),
  ])

  return (
    <>
      <div className="head">
        <div><h1>Komforta klubs</h1>
          <div className="sub">Dalības līmeņi un to priekšrocības — redzams vietnē apkomforts.com/apkopes-plani.</div></div>
      </div>

      <div className="note" style={{ marginBottom: 22 }}>
        Izslēdzot līmeni ("Nav aktīvs"), tas pazūd no vietnes un kalkulatora — dati saglabājas, varat to atkal ieslēgt jebkurā brīdī.
      </div>

      {(plans || []).map(plan => (
        <TierEditor key={plan.tier} plan={plan} benefits={(benefits || []).filter(b => b.tier === plan.tier)} />
      ))}
    </>
  )
}
