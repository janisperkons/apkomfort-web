'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HouseStage from './HouseStage'
import ServicePanel from './ServicePanel'
import OfficeContact from './OfficeContact'
import { ZONES, ZONE_TO_SERVICE, PHONE_DISPLAY, PHONE_HREF } from './content'

// The cinematic homepage experience. Act 1 is currently a slow Ken Burns
// approach on the master photograph — the exact slot the Seedance frame
// sequence (V1) drops into once approved, scrubbed by the same ScrollTrigger
// progress value. Everything else (X-ray hover, panels, office) is final
// architecture, not placeholder.

const HERO_SRC = '/maja/hero-1600.jpg'
const HERO_SRC_LG = '/maja/hero-2560.jpg'

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

// Reduced-motion / fallback experience: same content, no camera travel.
function StaticExperience({ onOpenZone, onOpenOffice }) {
  return (
    <div>
      <section className="mj-static-hero">
        <img src={HERO_SRC_LG} alt="Privātmāja priežu meža malā Latvijā" />
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
        {ZONES.map((z) => (
          <button key={z.id} type="button" className="mj-static-card" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }} onClick={() => onOpenZone(z.id)}>
            <h3 className="mj-serif">{z.label}</h3>
            <p>{z.lead}</p>
          </button>
        ))}
        <button type="button" className="mj-static-card" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit', borderColor: 'var(--mj-gold-soft)' }} onClick={onOpenOffice}>
          <h3 className="mj-serif">Sazināties ar mums</h3>
          <p>Pastāstiet par savu projektu, un mēs ar jums sazināsimies.</p>
        </button>
      </div>
    </div>
  )
}

export default function Experience() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const [activeZone, setActiveZone] = useState(null)
  const [officeOpen, setOfficeOpen] = useState(false)
  const [presetService, setPresetService] = useState('')
  const [headerSolid, setHeaderSolid] = useState(false)
  const reduced = usePrefersReducedMotion()

  // Deep-link support: /?skats=<zone-id> opens straight into a service.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const skats = params.get('skats')
    if (skats === 'birojs') setOfficeOpen(true)
    else if (skats && ZONES.some((z) => z.id === skats)) setActiveZone(skats)
  }, [])

  useEffect(() => {
    if (reduced) return undefined
    let lenis, gsap, ScrollTrigger, raf
    let cancelled = false

    async function boot() {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap = gsapMod.gsap
      ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
      lenis.on('scroll', ScrollTrigger.update)
      // Programmatic navigation (anchors, tests) must go through Lenis,
      // otherwise it rubber-bands back to its own virtual position.
      window.__lenis = lenis

      // Act 1 — the approach. Scroll scrubs a slow push toward the house;
      // this same timeline will scrub the Seedance frame sequence.
      gsap.fromTo(
        heroRef.current,
        { scale: 1.22, yPercent: 2.5, filter: 'brightness(0.82) saturate(0.92)' },
        {
          scale: 1.0, yPercent: 0, filter: 'brightness(1) saturate(1)',
          ease: 'none',
          scrollTrigger: { trigger: '.mj-act1', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        }
      )
      // Scene copy floats through the approach.
      gsap.fromTo(text1Ref.current, { opacity: 0 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.mj-act1', start: '4% top', end: '18% top', scrub: true },
      })
      gsap.to(text1Ref.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.mj-act1', start: '26% top', end: '36% top', scrub: true },
      })
      gsap.fromTo(text2Ref.current, { opacity: 0 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.mj-act1', start: '42% top', end: '54% top', scrub: true },
      })
      gsap.to(text2Ref.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.mj-act1', start: '64% top', end: '74% top', scrub: true },
      })

      ScrollTrigger.create({
        start: 60,
        onUpdate: (self) => setHeaderSolid(self.scroll() > 60),
      })
    }

    boot()
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      if (lenis) lenis.destroy()
      if (ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [reduced])

  const openZone = (id) => { setActiveZone(id); setOfficeOpen(false) }
  const openOffice = (preset) => { setPresetService(typeof preset === 'string' ? preset : ''); setOfficeOpen(true); setActiveZone(null) }
  const closeAll = () => { setActiveZone(null); setOfficeOpen(false); setPresetService('') }

  return (
    <div className="mj-root" ref={rootRef}>
      <MajaHeader onContact={() => openOffice()} solid={headerSolid} />

      {reduced ? (
        <StaticExperience onOpenZone={openZone} onOpenOffice={() => openOffice()} />
      ) : (
        <>
          {/* ACT 1 — the approach */}
          <section className="mj-act1" aria-label="Ievads">
            <div className="mj-sticky">
              <img
                ref={heroRef}
                className="mj-hero-img"
                src={HERO_SRC_LG}
                srcSet={`${HERO_SRC} 1600w, ${HERO_SRC_LG} 2560w`}
                sizes="100vw"
                alt="Privātmāja priežu meža malā Latvijā vakara krēslā"
                fetchPriority="high"
              />
              <div className="mj-fog" />
              <div className="mj-fog b" />
              <div className="mj-grade" />
              <div className="mj-grain" />
              <div className="mj-scenetext" ref={text1Ref}>
                <p className="mj-serif">
                  <span className="mj-eyebrow">AP Komforts</span>
                  Klusums priežu mežā. Kaut kur aiz kokiem — māja, kurā viss vienkārši strādā.
                </p>
              </div>
              <div className="mj-scenetext" ref={text2Ref}>
                <p className="mj-serif">
                  Siltums. Ūdens. Klusums.<br />
                  Kamēr sistēmas strādā nevainojami, neviens par tām nedomā.
                </p>
              </div>
              <div className="mj-scrollhint">Ritiniet</div>
            </div>
          </section>

          {/* ACT 2 — the message */}
          <section className="mj-message">
            <h1 className="mj-serif">Atklājiet, kas slēpjas aiz sienām</h1>
            <p className="mj-sub">
              Apkure, ūdensapgāde, kanalizācija — labākā santehnika ir tā, kuru neredz.
              Pavirziet kursoru pār māju un ieraugiet sistēmas, kas dara to dzīvu.
            </p>
          </section>

          {/* ACT 3 — the interactive house */}
          <section className="mj-house" id="maja" aria-label="Interaktīvā māja">
            <div className="mj-sticky">
              <HouseStage
                heroSrc={HERO_SRC_LG}
                onOpenZone={openZone}
                onOpenOffice={() => openOffice()}
              />
              <div className="mj-house-intro">
                <span className="chip">Izpētiet māju</span>
              </div>
            </div>
          </section>

          {/* ACT 4 — the company */}
          <section className="mj-company">
            <h2 className="mj-serif">Komforts sākas ar sistēmām, kuras ikdienā neredzam.</h2>
            <div className="mj-stats">
              <div className="mj-stat"><div className="n">20</div><div className="l">Gadu pieredze</div></div>
              <div className="mj-stat"><div className="n">1</div><div className="l">Pastāvīgs meistars</div></div>
              <div className="mj-stat"><div className="n">9</div><div className="l">Apkalpotas pilsētas</div></div>
            </div>
            <div className="mj-quietlinks">
              <Link href="/apkopes-plani/">Apkopes plāni</Link>
              <Link href="/kalkulators/">Cenas kalkulators</Link>
              <Link href="/komforta-klubs/">Komforta klubs</Link>
              <Link href="/par-mums/">Par mums</Link>
            </div>
          </section>

          {/* ACT 5 — the invitation */}
          <section className="mj-cta">
            <h2 className="mj-serif">Vai plānojat savu projektu?</h2>
            <p>Parunāsim par to.</p>
            <button type="button" className="mj-btn" onClick={() => openOffice()}>
              Sazināties ar mums
            </button>
          </section>
        </>
      )}

      {activeZone && (
        <ServicePanel
          zoneId={activeZone}
          heroSrc={HERO_SRC_LG}
          onClose={closeAll}
          onEnquire={() => openOffice(ZONE_TO_SERVICE[activeZone] || '')}
        />
      )}
      {officeOpen && (
        <OfficeContact heroSrc={HERO_SRC_LG} presetService={presetService} onClose={closeAll} />
      )}
    </div>
  )
}
