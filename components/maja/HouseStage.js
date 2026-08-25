'use client'
import { useMemo, useState, useCallback, useRef } from 'react'
import { ZONES, OFFICE } from './content'

// The interactive stage: hero photograph + an SVG overlay in the image's own
// 1600x900 space. preserveAspectRatio "slice" on both keeps polygons glued to
// the photo pixels at every viewport size. Labels are drawn as SVG so they
// can never drift from the geometry they belong to.

function centroid(poly) {
  const pts = poly.split(' ').map((p) => p.split(',').map(Number))
  const n = pts.length
  return pts.reduce(([cx, cy], [x, y]) => [cx + x / n, cy + y / n], [0, 0])
}

function ZoneLabel({ zone, isOffice }) {
  const [ax, ay] = zone.anchor
  const text = zone.label
  const hint = isOffice ? 'IENĀKT' : 'IZPĒTĪT'
  const w = text.length * 8.6 + 44
  const x = Math.min(Math.max(ax - w / 2, 12), 1600 - w - 12)
  const y = ay < 140 ? ay + 26 : ay - 64
  return (
    <g className="mj-label-g">
      <rect x={x} y={y} width={w} height={50} rx={8} />
      <text x={x + 16} y={y + 21}>{text}</text>
      <text className="hintline" x={x + 16} y={y + 39}>{hint} →</text>
    </g>
  )
}

export default function HouseStage({ heroSrc, onOpenZone, onOpenOffice, interactive = true }) {
  const [hovered, setHovered] = useState(null)
  const touchArm = useRef(null)
  const all = useMemo(() => [...ZONES, OFFICE], [])
  const hoveredZone = all.find((z) => z.id === hovered) || null

  // Desktop: hover reveals, click explores. Touch: first tap reveals, second
  // tap (or the label hint) explores — per the separate mobile design.
  const activate = useCallback(
    (zone, e) => {
      const isTouch = e.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)
      if (isTouch && touchArm.current !== zone.id) {
        touchArm.current = zone.id
        setHovered(zone.id)
        return
      }
      touchArm.current = null
      if (zone.id === OFFICE.id) onOpenOffice()
      else onOpenZone(zone.id)
    },
    [onOpenZone, onOpenOffice]
  )

  return (
    <div className="mj-stagewrap" aria-hidden={!interactive}>
      <img
        className="mj-hero-img"
        src={heroSrc}
        alt="Privātmāja priežu meža malā Latvijā — AP Komforts apkalpotās sistēmas slēpjas aiz tās sienām"
        draggable={false}
      />
      <div className="mj-grade" />
      <svg
        className="mj-overlay"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <mask id="mj-dim-mask">
            <rect x="0" y="0" width="1600" height="900" fill="white" />
            {hoveredZone && <polygon points={hoveredZone.poly} fill="black" />}
          </mask>
        </defs>

        {/* everything except the active zone falls into shadow */}
        <rect
          className="mj-dim"
          x="0" y="0" width="1600" height="900"
          mask="url(#mj-dim-mask)"
          style={{ opacity: hoveredZone ? 1 : 0 }}
        />

        {hoveredZone && (
          <polygon
            className={`zone-outline${hoveredZone.id === OFFICE.id ? ' office' : ''}`}
            points={hoveredZone.poly}
          />
        )}

        {interactive && all.map((z) => (
          <polygon
            key={z.id}
            className="zone"
            points={z.poly}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHovered(z.id) }}
            onPointerLeave={(e) => { if (e.pointerType !== 'touch') { setHovered(null); touchArm.current = null } }}
            onPointerUp={(e) => activate(z, e)}
            aria-label={z.label}
          />
        ))}

        {hoveredZone && <ZoneLabel zone={hoveredZone} isOffice={hoveredZone.id === OFFICE.id} />}
      </svg>

      {/* keyboard path: every zone reachable without hover */}
      {interactive && (
        <nav className="mj-zonenav" aria-label="Mājas zonas">
          {all.map((z) => (
            <button
              key={z.id}
              type="button"
              onFocus={() => setHovered(z.id)}
              onBlur={() => setHovered(null)}
              onClick={() => (z.id === OFFICE.id ? onOpenOffice() : onOpenZone(z.id))}
            >
              {z.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
