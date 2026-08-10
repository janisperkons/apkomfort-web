'use client'
import { useMemo, useState } from 'react'
import {
  SYSTEM_TYPES,
  SYSTEM_AGES,
  PROPERTY_SIZES,
  SERVICE_HISTORIES,
  calculate,
  recommendTier,
} from '../lib/pricing'
import { supabaseBrowser } from '../lib/supabase'

const label = (list, value) => list.find((o) => o.value === value)?.label ?? null

const TIER_NAMES = { tier1: 'Apkope plāns', tier2: 'Komforts plāns', tier3: 'Komforts Pilns plāns' }

export default function Calculator() {
  const [systemType, setSystemType] = useState('')
  const [systemAge, setSystemAge] = useState('')
  const [propertySize, setPropertySize] = useState('')
  const [serviceHistory, setServiceHistory] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const showResult = systemType && systemAge

  const result = useMemo(() => {
    if (!showResult) return null
    return calculate({ systemType, systemAge, propertySize, serviceHistory })
  }, [systemType, systemAge, propertySize, serviceHistory, showResult])

  const match = useMemo(() => {
    if (!result || result.overCeiling) return null
    return recommendTier({ tier3Gated: result.tier3Gated, flagged: result.flagged })
  }, [result])

  async function submitEnquiry(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setSending(true)
    setError('')
    try {
      const { error: dbError } = await supabaseBrowser()
        .from('enquiries')
        .insert({
          source: 'kalkulators',
          name: name.trim(),
          phone: phone.trim(),
          system_type: label(SYSTEM_TYPES, systemType),
          system_age: label(SYSTEM_AGES, systemAge),
          property_size: label(PROPERTY_SIZES, propertySize),
          service_history: label(SERVICE_HISTORIES, serviceHistory),
          tier1_from: result?.tier1?.from ?? null,
          tier1_to: result?.tier1?.to ?? null,
          tier2_from: result?.tier2?.from ?? null,
          tier2_to: result?.tier2?.to ?? null,
          tier3_from: result?.tier3?.from ?? null,
          tier3_to: result?.tier3?.to ?? null,
          tier3_offered: result ? !result.tier3Gated : null,
          flagged: result?.flagged ?? false,
        })
      if (dbError) throw dbError
      setSent(true)
    } catch (err) {
      setError('Neizdevās nosūtīt. Lūdzu, piezvaniet +371 58 860 194.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="calc-wrap">
      <div className="glass-card plain-card calc-form">
        <div className="q-grid">
          <div className="q">
            <label htmlFor="q1">1. Kāda ir jūsu apkures sistēma?</label>
            <select id="q1" value={systemType} onChange={(e) => setSystemType(e.target.value)}>
              <option value="">Izvēlieties…</option>
              {SYSTEM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="q">
            <label htmlFor="q2">2. Cik veca tā ir?</label>
            <select id="q2" value={systemAge} onChange={(e) => setSystemAge(e.target.value)}>
              <option value="">Izvēlieties…</option>
              {SYSTEM_AGES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="q">
            <label htmlFor="q3">3. Cik liels ir īpašums?</label>
            <select id="q3" value={propertySize} onChange={(e) => setPropertySize(e.target.value)}>
              <option value="">Izvēlieties…</option>
              {PROPERTY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="q">
            <label htmlFor="q4">4. Kad tā pēdējo reizi apkopta?</label>
            <select id="q4" value={serviceHistory} onChange={(e) => setServiceHistory(e.target.value)}>
              <option value="">Izvēlieties…</option>
              {SERVICE_HISTORIES.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!showResult && (
          <p className="fine" style={{ marginTop: 18 }}>
            Atbildiet uz pirmajiem diviem jautājumiem, lai sagatavotu jūsu personalizēto
            piedāvājumu.
          </p>
        )}
      </div>

      {result && (
        <div className="result-panel">
          {result.overCeiling ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <h3>Šai sistēmai vajadzīgs individuāls izvērtējums</h3>
              <p>
                Jūsu sistēma ir ārpus standarta plānu klāsta. Iesniedziet pieteikumu — mūsu
                inženieris izvērtēs to un sagatavos individuālu piedāvājumu.
              </p>
            </div>
          ) : (
            <>
              <div className="match-head">
                <div className="eyebrow">Balstoties uz jūsu atbildēm</div>
                <h3>{TIER_NAMES[match.tier]}</h3>
                <p>{match.reason}</p>
              </div>
              <div className="plans-grid tiers-compact">
                <TierCard
                  badge="Apkope"
                  name="Apkope plāns"
                  matched={match.tier === 'tier1'}
                  bullets={['Ikgadēja plānota apkope', 'Izbraukums iekļauts', 'Servisa vēsture un atgādinājumi']}
                />
                <TierCard
                  badge="Komforts"
                  name="Komforts plāns"
                  matched={match.tier === 'tier2'}
                  bullets={['Viss no Apkope plāna', 'Neierobežoti bojājumu izsaukumi', 'Mērķis — tajā pašā dienā']}
                />
                {result.tier3Gated ? (
                  <div className="plan gated">
                    <div className="plan-badge">Komforts Pilns</div>
                    <h3>Komforts Pilns plāns</h3>
                    <p className="plan-desc" style={{ marginTop: 14 }}>
                      Nav pieejams sistēmām, kas vecākas par 10 gadiem — reāls ierobežojums, ne
                      mārketings. Pieejams Apkope un Komforts plāns.
                    </p>
                  </div>
                ) : (
                  <TierCard
                    badge="Komforts Pilns"
                    name="Komforts Pilns plāns"
                    matched={match.tier === 'tier3'}
                    bullets={['Viss no Komforts plāna', 'Daļu izmaksas iekļautas', 'Pieejams līdz 10 gadu vecumam']}
                  />
                )}
              </div>
            </>
          )}

          {result.flagged && (
            <div className="note" style={{ marginTop: 20 }}>
              Jūsu sistēmai nav bijusi nesena apkope — pirmajā vizītē varam atklāt papildu darbus.
              To pārrunāsim zvanā, pirms kaut kas tiek darīts.
            </div>
          )}

          {!sent ? (
            <form className="lead-form" onSubmit={submitEnquiry}>
              <h3 style={{ marginBottom: 4 }}>
                Pieteikums izvērtēšanai{match ? ` — ${TIER_NAMES[match.tier]}` : ''}
              </h3>
              <p className="fine" style={{ marginBottom: 14 }}>
                Atstājiet vārdu un telefonu. Mūsu inženieris izvērtēs jūsu sistēmu un apstiprinās
                precīzu cenu zvanā.
              </p>
              <div className="lead-fields">
                <div>
                  <label htmlFor="name">Vārds</label>
                  <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="phone">Telefons</label>
                  <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              {error && <p className="fine" style={{ color: 'var(--bad)', marginTop: 10 }}>{error}</p>}
              <button type="submit" className="btn-p btn-block" disabled={sending} style={{ marginTop: 16 }}>
                {sending ? 'Sūta…' : 'Iesniegt pieteikumu'}
              </button>
              <p className="fine" style={{ marginTop: 10, textAlign: 'center' }}>
                Pieņemam ierobežotu klientu skaitu mēnesī.
              </p>
            </form>
          ) : (
            <div className="card" style={{ marginTop: 24, textAlign: 'center' }}>
              <h3>Paldies, {name.split(' ')[0]}!</h3>
              <p>Pieteikums saņemts. Izskatīsim to un sazināsimies 1 darba dienas laikā.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TierCard({ badge, name, bullets, matched }) {
  return (
    <div className={`plan${matched ? ' featured' : ''}`}>
      {matched && <div className="match-badge">Ieteicams jums</div>}
      <div className="plan-badge">{badge}</div>
      <h3>{name}</h3>
      <ul className="plan-includes" style={{ marginTop: 16 }}>
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
