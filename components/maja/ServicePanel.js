'use client'
import { useEffect, useRef } from 'react'
import { ZONES } from './content'

// Service detail view. The backdrop is the hero pushed toward the zone the
// visitor clicked — reads as the camera travelling into the room. When the
// generated interiors (A11–A14) land, they slot in as per-zone backdrops with
// zero structural change here.

export default function ServicePanel({ zoneId, heroSrc, onClose, onEnquire }) {
  const zone = ZONES.find((z) => z.id === zoneId)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el) {
      el.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 420, easing: 'ease-out', fill: 'forwards' }
      )
    }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!zone) return null
  const [ax, ay] = zone.anchor
  const origin = `${(ax / 1600) * 100}% ${(ay / 900) * 100}%`

  return (
    <div className="mj-panelwrap" ref={ref} role="dialog" aria-modal="true" aria-label={zone.label}>
      <div className="mj-panel-bg" style={{ '--mj-zoom-origin': origin }}>
        <img src={heroSrc} alt="" aria-hidden="true" />
      </div>
      <button type="button" className="mj-close" onClick={onClose} aria-label="Aizvērt">×</button>
      <div className="mj-panel">
        <span className="mj-eyebrow">Pakalpojums</span>
        <h2 className="mj-serif">{zone.label}</h2>
        <p className="lead mj-serif">{zone.lead}</p>
        <ul>
          {zone.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="mj-panel-actions">
          <button type="button" className="mj-btn" onClick={() => onEnquire(zone.label)}>
            Pieteikt konsultāciju
          </button>
          <button type="button" className="mj-btn ghost" onClick={() => onEnquire(zone.label)}>
            Saņemt piedāvājumu
          </button>
        </div>
        <button type="button" className="mj-back" onClick={onClose}>← Atpakaļ uz māju</button>
      </div>
    </div>
  )
}
