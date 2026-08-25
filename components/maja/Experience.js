'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SceneStage from './SceneStage'
import ServicePanel from './ServicePanel'
import OfficeContact from './OfficeContact'
import { SCENES, SERVICES, PHONE_DISPLAY, PHONE_HREF } from './content'

// V2 — the still stage. No scrollytelling: the house is a fixed full-screen
// photograph. Scrolling steps the camera between angles of the same property
// (facade → garden side → aerial → underground works); hovering a wall opens
// it into the real room behind. After the last angle, scroll releases into
// the normal page below (services directory, footer).

const STEP_THRESHOLD = 70
const STEP_COOLDOWN_MS = 950

function MajaHeader({ onContact, solid }) {
  return (
    <header className={`mj-header${solid ? ' solid' : ''}`}>
      <Link href="/" aria-label="AP Komforts — sākums">
        <img src="/logo/APKomfort-Lockup-Reversed.svg" alt="AP Komforts" />
      </Link>
      <nav className="mj-nav" aria-label="Galvenā izvēlne">
        <a className="mj-hide-m" href="#pakalpojumi">Pakalpojumi</a>
        <Link className="mj-hide-m" href="/par-mums/">Par mums</Link>
        <button type="button" onClick={onContact}>Kontakti</button>
        <a className="mj-tel mj-hide-m" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        <Link className="mj-login" href="/pieslegties/">Pieslēgties</Link>
      </nav>
    </header>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = (e) => setReduced(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

// Reduced-motion fallback: same content, no transitions.
function StaticExperience({ onOpenService }) {
  return (
    <div>
      <section className="mj-static-hero">
        <img src={SCENES[0].src} alt="Privātmāja priežu meža malā Latvijā" />
        <div className="mj-grade" />
        <div className="inner">
          <span className="mj-eyebrow">AP Komforts · Rīga un Pierīga</span>
          <h1 className="mj-serif" style={{ fontSize: 'clamp(28px,5vw,46px)', margin: '0 0 14px', lineHeight: 1.2 }}>
            Atklājiet, kas slēpjas aiz sienām
          </h1>
          <p style={{ color: 'var(--mj-cream-dim)', maxWidth: 480, lineHeight: 1.7 }}>
            Apkure, ūdens un kanalizācija — sistēmas, kas mājā strādā nemanāmi.
            Izvēlieties sistēmu un apskatiet, ko varam izbūvēt jūsu mājai.
          </p>
        </div>
      </section>
      <div className="mj-static-list">
        {Object.entries(SERVICES).map(([id, s]) => (
          <button key={id} type="button" className="mj-static-card" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit', borderColor: s.isOffice ? 'var(--mj-gold-soft)' : undefined }} onClick={() => onOpenService(id)}>
            <h3 className="mj-serif">{s.label}</h3>
            <p>{s.lead}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Experience() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [activeService, setActiveService] = useState(null)
  const [officeOpen, setOfficeOpen] = useState(false)
  const [presetService, setPresetService] = useState('')
  const [released, setReleased] = useState(false)
  const [headerSolid, setHeaderSolid] = useState(false)
  const reduced = usePrefersReducedMotion()

  const stateRef = useRef({ acc: 0, coolingUntil: 0, touchY: null })
  const openRef = useRef(false)
  openRef.current = activeService !== null || officeOpen

  const sceneRef = useRef(sceneIndex)
  sceneRef.current = sceneIndex
  const releasedRef = useRef(released)
  releasedRef.current = released

  const step = useCallback((dir) => {
    const now = performance.now()
    const st = stateRef.current
    if (now < st.coolingUntil) return
    const cur = sceneRef.current
    if (dir > 0) {
      if (cur < SCENES.length - 1) {
        setSceneIndex(cur + 1)
        st.coolingUntil = now + STEP_COOLDOWN_MS
      } else {
        // last angle reached — release the page for normal scrolling
        setReleased(true)
      }
    } else if (dir < 0 && cur > 0) {
      setSceneIndex(cur - 1)
      st.coolingUntil = now + STEP_COOLDOWN_MS
    }
    st.acc = 0
  }, [])

  // Wheel + touch stepping, active only while the stage owns the viewport.
  useEffect(() => {
    if (reduced) return undefined

    const onWheel = (e) => {
      if (openRef.current) return
      const atTop = window.scrollY <= 1
      if (!atTop) return // normal scrolling below the stage
      if (releasedRef.current) {
        if (e.deltaY < 0) {
          // scrolling up at the very top re-locks the stage
          e.preventDefault()
          setReleased(false)
          stateRef.current.coolingUntil = performance.now() + STEP_COOLDOWN_MS
        }
        return
      }
      e.preventDefault()
      const st = stateRef.current
      if (performance.now() < st.coolingUntil) return
      st.acc += e.deltaY
      if (Math.abs(st.acc) > STEP_THRESHOLD) step(st.acc > 0 ? 1 : -1)
    }

    const onTouchStart = (e) => { stateRef.current.touchY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (openRef.current) return
      const atTop = window.scrollY <= 1
      if (!atTop || releasedRef.current) return
      const st = stateRef.current
      if (st.touchY == null) return
      const dy = st.touchY - e.touches[0].clientY
      if (Math.abs(dy) > 6) e.preventDefault()
      if (Math.abs(dy) > 46 && performance.now() >= st.coolingUntil) {
        st.touchY = e.touches[0].clientY
        step(dy > 0 ? 1 : -1)
      }
    }
    const onKey = (e) => {
      if (openRef.current || window.scrollY > 1 || releasedRef.current) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); step(1) }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); step(-1) }
    }
    const onScroll = () => setHeaderSolid(window.scrollY > 40)

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced, step])

  // Preload every scene up front, interiors right after.
  useEffect(() => {
    SCENES.forEach((s) => { const i = new Image(); i.src = s.src })
    const t = setTimeout(() => {
      Object.values(SERVICES).forEach((s) => {
        if (s.interior) { const i = new Image(); i.src = s.interior }
      })
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  // Deep links: /?skats=<service-id> or ?skats=birojs
  useEffect(() => {
    const skats = new URLSearchParams(window.location.search).get('skats')
    if (!skats) return
    if (skats === 'birojs') setOfficeOpen(true)
    else if (SERVICES[skats]) setActiveService(skats)
  }, [])

  const openService = (id) => {
    if (SERVICES[id]?.isOffice) { setOfficeOpen(true); setActiveService(null) }
    else { setActiveService(id); setOfficeOpen(false) }
  }
  const openOffice = (preset) => {
    setPresetService(typeof preset === 'string' ? preset : '')
    setOfficeOpen(true)
    setActiveService(null)
  }
  const closeAll = () => { setActiveService(null); setOfficeOpen(false); setPresetService('') }

  const scene = SCENES[sceneIndex]

  return (
    <div className="mj-root">
      <MajaHeader onContact={() => openOffice()} solid={headerSolid} />

      {reduced ? (
        <StaticExperience onOpenService={openService} />
      ) : (
        <section className="mj-stagehold" aria-label="Interaktīvā māja">
          <div className="mj-stagepin">
            {SCENES.map((s, i) => (
              <SceneStage
                key={s.key}
                scene={s}
                active={i === sceneIndex}
                onOpenService={openService}
              />
            ))}

            {/* scene chrome: number, caption, dots — quiet, bottom-left */}
            <div className="mj-chrome">
              {scene.tagline && <div className="mj-tagline mj-serif">{scene.tagline}</div>}
              <div className="mj-caption">
                <span className="num">{String(sceneIndex + 1).padStart(2, '0')}</span>
                <span className="sep" />
                <span>{scene.caption}</span>
              </div>
              <div className="mj-dots" role="tablist" aria-label="Skati">
                {SCENES.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={i === sceneIndex}
                    aria-label={s.caption}
                    className={i === sceneIndex ? 'on' : ''}
                    onClick={() => { setSceneIndex(i); setReleased(false) }}
                  />
                ))}
              </div>
            </div>

            <div className="mj-stagehint">
              {sceneIndex < SCENES.length - 1 ? 'Ritiniet — nākamais skats' : 'Ritiniet tālāk'}
            </div>
          </div>
        </section>
      )}

      {activeService && !SERVICES[activeService]?.isOffice && (
        <ServicePanel
          serviceId={activeService}
          fallbackSrc={scene.src}
          onClose={closeAll}
          onEnquire={() => openOffice(SERVICES[activeService]?.formService || '')}
        />
      )}
      {officeOpen && (
        <OfficeContact presetService={presetService} onClose={closeAll} />
      )}
    </div>
  )
}
