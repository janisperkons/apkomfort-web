'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SYSTEM_TYPES, SYSTEM_AGES, calculate } from '../lib/pricing'

export default function HeroCalculator() {
  const [systemType, setSystemType] = useState(SYSTEM_TYPES[0].value)
  const [systemAge, setSystemAge] = useState(SYSTEM_AGES[1].value)

  const result = useMemo(() => calculate({ systemType, systemAge }), [systemType, systemAge])
  const plansAvailable = result?.tier3Gated ? 'Apkope, Komforts' : 'Apkope, Komforts, Komforts Pilns'

  return (
    <div className="stack">
      <div className="glass-card">
        <div className="calc-h">Atrodiet savu plānu</div>
        <label htmlFor="hc-type">Kāda ir jūsu apkures sistēma?</label>
        <select id="hc-type" value={systemType} onChange={(e) => setSystemType(e.target.value)}>
          {SYSTEM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <label htmlFor="hc-age">Cik veca tā ir?</label>
        <select id="hc-age" value={systemAge} onChange={(e) => setSystemAge(e.target.value)}>
          {SYSTEM_AGES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <div className="hc-avail">
          <div className="tag">Jums pieejami</div>
          <div className="avail-list">{plansAvailable}</div>
        </div>
        <Link href="/kalkulators/" className="btn-p btn-block">
          Skatīt savu plānu
        </Link>
        <div className="fine">Divi jautājumi vairāk — un iesniegsiet pieteikumu izvērtēšanai.</div>
      </div>
    </div>
  )
}
