import { redirect } from 'next/navigation'
import { supabaseServer } from '../../../lib/server'

export const dynamic = 'force-dynamic'

function topN(rows, key, n = 8) {
  const counts = {}
  for (const r of rows) {
    const v = r[key] || '—'
    counts[v] = (counts[v] || 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n)
}

export default async function Statistika() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (me?.role !== 'admin') redirect('/birojs/gramatvediba')

  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const { data } = await sb.from('page_views').select('*').gte('occurred_at', since).order('occurred_at', { ascending: false })
  const rows = data || []

  const byDay = {}
  for (const r of rows) {
    const day = new Date(r.occurred_at).toLocaleDateString('lv-LV', { day: '2-digit', month: '2-digit' })
    byDay[day] = (byDay[day] || 0) + 1
  }
  const days = Object.entries(byDay).reverse()
  const maxDay = Math.max(1, ...days.map(([, c]) => c))

  const topPages = topN(rows, 'path')
  const topReferrers = topN(rows.filter(r => r.referrer), 'referrer')
  const topCountries = topN(rows.filter(r => r.country), 'country')
  const topDevices = topN(rows, 'device_type')
  const maxPage = Math.max(1, ...topPages.map(([, c]) => c))

  const cityRows = rows.filter(r => r.city).map(r => ({ city: r.city && r.country ? `${r.city}, ${r.country}` : r.city }))
  const topCities = topN(cityRows, 'city')

  return (
    <>
      <div className="head"><div><h1>Statistika</h1><div className="sub">Pēdējās 30 dienas · {rows.length} skatījumi</div></div></div>

      <div className="grid g4">
        <div className="card stat"><div className="n">{rows.length}</div><div className="l">Skatījumi (30 d.)</div></div>
        <div className="card stat"><div className="n">{new Set(rows.map(r => r.path)).size}</div><div className="l">Unikālas lapas</div></div>
        <div className="card stat"><div className="n">{topReferrers.length}</div><div className="l">Novirzītāji</div></div>
        <div className="card stat"><div className="n">{topCountries[0]?.[0] || '—'}</div><div className="l">Biežākā valsts</div></div>
      </div>

      <div className="card sec">
        <h2>Skatījumi pa dienām</h2>
        {days.length ? days.map(([day, count]) => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div className="small muted" style={{ width: 46 }}>{day}</div>
            <div style={{ flex: 1, background: '#EFEADC', borderRadius: 6, height: 14 }}>
              <div style={{ width: `${(count / maxDay) * 100}%`, background: 'var(--ink)', height: '100%', borderRadius: 6 }} />
            </div>
            <div className="small" style={{ width: 30, textAlign: 'right' }}>{count}</div>
          </div>
        )) : <p className="muted small">Vēl nav datu.</p>}
      </div>

      <div className="grid g2 sec">
        <div className="card">
          <h2>Populārākās lapas</h2>
          {topPages.length ? topPages.map(([path, count]) => (
            <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div className="small" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</div>
              <div style={{ width: 80, background: '#EFEADC', borderRadius: 6, height: 10 }}>
                <div style={{ width: `${(count / maxPage) * 100}%`, background: 'var(--acc)', height: '100%', borderRadius: 6 }} />
              </div>
              <div className="small muted" style={{ width: 24, textAlign: 'right' }}>{count}</div>
            </div>
          )) : <p className="muted small">Vēl nav datu.</p>}
        </div>

        <div className="card">
          <h2>Novirzītāji</h2>
          {topReferrers.length ? topReferrers.map(([ref, count]) => (
            <div key={ref} className="small" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EFEADC' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ref}</span>
              <span className="muted">{count}</span>
            </div>
          )) : <p className="muted small">Nav novirzītāju — apmeklētāji nāk tieši.</p>}
        </div>
      </div>

      <div className="grid g3 sec" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="card">
          <h2>Valstis</h2>
          {topCountries.length ? topCountries.map(([c, count]) => (
            <div key={c} className="small" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EFEADC' }}>
              <span>{c}</span><span className="muted">{count}</span>
            </div>
          )) : <p className="muted small">Nav datu.</p>}
        </div>
        <div className="card">
          <h2>Pilsētas</h2>
          {topCities.length ? topCities.map(([c, count]) => (
            <div key={c} className="small" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EFEADC' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span><span className="muted">{count}</span>
            </div>
          )) : <p className="muted small">Nav datu.</p>}
        </div>
        <div className="card">
          <h2>Ierīces</h2>
          {topDevices.length ? topDevices.map(([dv, count]) => (
            <div key={dv} className="small" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EFEADC' }}>
              <span>{dv}</span><span className="muted">{count}</span>
            </div>
          )) : <p className="muted small">Nav datu.</p>}
        </div>
      </div>
    </>
  )
}
