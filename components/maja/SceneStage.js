'use client'
import { useMemo, useRef, useState, useCallback } from 'react'
import { SERVICES } from './content'

// One scene of the fixed stage: the photograph plus its interactive layer in
// the image's own 1600x900 space. Hovering an interior zone opens the wall
// into the actual room behind it (the room photograph clipped to the zone
// polygon); outdoor zones get the architectural outline treatment; the
// underground scene uses discreet ring markers on the buried systems.

function polyBBox(poly) {
  const pts = poly.split(' ').map((p) => p.split(',').map(Number))
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

function ZoneLabel({ label, anchor, isOffice, hint }) {
  const [ax, ay] = anchor
  const w = label.length * 8.6 + 44
  const x = Math.min(Math.max(ax - w / 2, 12), 1600 - w - 12)
  const y = ay < 140 ? ay + 26 : ay - 64
  return (
    <g className="mj-label-g">
      <rect x={x} y={y} width={w} height={50} rx={8} />
      <text x={x + 16} y={y + 21}>{label}</text>
      <text className="hintline" x={x + 16} y={y + 39}>{hint || (isOffice ? 'IENĀKT' : 'IESKATĪTIES')} →</text>
    </g>
  )
}

export default function SceneStage({ scene, active, onOpenService }) {
  const [hovered, setHovered] = useState(null)
  const touchArm = useRef(null)

  const zones = scene.zones || []
  const markers = scene.markers || []
  const hoveredZone = zones.find((z) => z.serviceId === hovered) || null
  const hoveredMarker = markers.find((m) => m.serviceId === hovered) || null
  const hoveredService = hovered ? SERVICES[hovered] : null

  const bbox = useMemo(
    () => (hoveredZone ? polyBBox(hoveredZone.poly) : null),
    [hoveredZone]
  )

  const activate = useCallback(
    (serviceId, e) => {
      const isTouch = e.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)
      if (isTouch && touchArm.current !== serviceId) {
        touchArm.current = serviceId
        setHovered(serviceId)
        return
      }
      touchArm.current = null
      setHovered(null)
      onOpenService(serviceId)
    },
    [onOpenService]
  )

  const clear = () => { setHovered(null); touchArm.current = null }

  return (
    <div className="mj-scene" data-active={active ? '1' : '0'} aria-hidden={!active}>
      <img
        className="mj-scene-img"
        src={scene.src}
        srcSet={scene.src2x ? `${scene.src} 1600w, ${scene.src2x} 2560w` : undefined}
        sizes="100vw"
        style={scene.pos ? { objectPosition: scene.pos } : undefined}
        alt=""
        draggable={false}
      />
      <div className="mj-grade" />
      <div className="mj-grain" />

      <svg className="mj-overlay" viewBox="0 0 1600 900" preserveAspectRatio={scene.svgAlign || 'xMidYMid slice'} role="presentation">
        <defs>
          <mask id={`mj-dim-${scene.key}`}>
            <rect x="0" y="0" width="1600" height="900" fill="white" />
            {hoveredZone && <polygon points={hoveredZone.poly} fill="black" />}
            {hoveredMarker && <circle cx={hoveredMarker.x} cy={hoveredMarker.y} r="90" fill="black" />}
          </mask>
          {hoveredZone && (
            <clipPath id={`mj-clip-${scene.key}`}>
              <polygon points={hoveredZone.poly} />
            </clipPath>
          )}
        </defs>

        {/* everything except the focus falls into shadow */}
        <rect
          className="mj-dim"
          x="0" y="0" width="1600" height="900"
          mask={`url(#mj-dim-${scene.key})`}
          style={{ opacity: hovered ? 1 : 0 }}
        />

        {/* the wall opens into the actual room behind it */}
        {hoveredZone && hoveredService?.interior && bbox && (
          <g clipPath={`url(#mj-clip-${scene.key})`}>
            <image
              className="mj-reveal"
              href={hoveredService.interior}
              x={bbox.x - bbox.w * 0.12}
              y={bbox.y - bbox.h * 0.12}
              width={bbox.w * 1.24}
              height={bbox.h * 1.24}
              preserveAspectRatio="xMidYMid slice"
            />
            <polygon points={hoveredZone.poly} className="mj-reveal-rim" />
          </g>
        )}

        {hoveredZone && (
          <polygon
            className={`zone-outline${SERVICES[hoveredZone.serviceId]?.isOffice ? ' office' : ''}`}
            points={hoveredZone.poly}
          />
        )}

        {/* underground markers — quiet gold rings on the buried systems */}
        {markers.map((m) => (
          <g
            key={m.serviceId + m.x}
            className={`mj-marker${hovered === m.serviceId ? ' on' : ''}`}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHovered(m.serviceId) }}
            onPointerLeave={(e) => { if (e.pointerType !== 'touch') clear() }}
            onPointerUp={(e) => activate(m.serviceId, e)}
          >
            <circle className="ring" cx={m.x} cy={m.y} r="16" />
            <circle className="core" cx={m.x} cy={m.y} r="4" />
            <circle className="hit" cx={m.x} cy={m.y} r="44" />
          </g>
        ))}

        {/* interactive zone surfaces */}
        {active && zones.map((z) => (
          <polygon
            key={z.serviceId}
            className="zone"
            points={z.poly}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHovered(z.serviceId) }}
            onPointerLeave={(e) => { if (e.pointerType !== 'touch') clear() }}
            onPointerUp={(e) => activate(z.serviceId, e)}
            aria-label={SERVICES[z.serviceId]?.label}
          />
        ))}

        {hoveredZone && (
          <ZoneLabel
            label={SERVICES[hoveredZone.serviceId].label}
            anchor={hoveredZone.anchor}
            isOffice={SERVICES[hoveredZone.serviceId]?.isOffice}
          />
        )}
        {hoveredMarker && (
          <ZoneLabel
            label={SERVICES[hoveredMarker.serviceId].label}
            anchor={[hoveredMarker.x, hoveredMarker.y - 20]}
            hint="APSKATĪT"
          />
        )}
      </svg>

      {/* keyboard path: every zone reachable without hover */}
      {active && (zones.length > 0 || markers.length > 0) && (
        <nav className="mj-zonenav" aria-label="Interaktīvās zonas">
          {[...zones, ...markers].map((z) => (
            <button
              key={'kb-' + z.serviceId}
              type="button"
              onFocus={() => setHovered(z.serviceId)}
              onBlur={clear}
              onClick={() => onOpenService(z.serviceId)}
            >
              {SERVICES[z.serviceId]?.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
