'use client'
import { useEffect, useRef } from 'react'
import { SERVICES } from './content'

// Service detail view. The backdrop is the real room behind the wall the
// visitor just opened (or the underground cutaway for buried systems) —
// sharp, softly graded, with the panel floating beside it.

export default function ServicePanel({ serviceId, fallbackSrc, onClose, onEnquire }) {
  const svc = SERVICES[serviceId]
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'forwards' })
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!svc) return null
  const backdrop = svc.interior || svc.backdrop || fallbackSrc
  const isRoom = Boolean(svc.interior)

  return (
    <div className="mj-panelwrap" ref={ref} role="dialog" aria-modal="true" aria-label={svc.label}>
      <div className="mj-panel-bg">
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          className={isRoom ? 'room' : 'site'}
        />
      </div>
      <button type="button" className="mj-close" onClick={onClose} aria-label="Aizvērt">×</button>
      <div className="mj-panel">
        <span className="mj-eyebrow">Pakalpojums</span>
        <h2 className="mj-serif">{svc.label}</h2>
        <p className="lead mj-serif">{svc.lead}</p>
        <ul>
          {svc.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="mj-panel-actions">
          <button type="button" className="mj-btn" onClick={onEnquire}>
            Pieteikt konsultāciju
          </button>
          <button type="button" className="mj-btn ghost" onClick={onEnquire}>
            Saņemt piedāvājumu
          </button>
        </div>
        <button type="button" className="mj-back" onClick={onClose}>← Atpakaļ uz māju</button>
      </div>
    </div>
  )
}
