'use client'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const RIGA_CENTER = [56.9496, 24.1052]

export default function PropertyMap({ points }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current).setView(RIGA_CENTER, 10)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const markers = []
      points.forEach(p => {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 8, weight: 2, color: '#26251F', fillColor: '#7A5C3E', fillOpacity: 0.85,
        }).addTo(map)
        marker.bindPopup(`
          <div style="font-size:13px;line-height:1.5">
            <b>${p.clientName || 'Nezināms klients'}</b><br>
            ${p.address}<br>
            <a href="/birojs/klienti/${p.customerId}" style="color:#7A5C3E;font-weight:600">Skatīt klientu →</a>
          </div>
        `)
        markers.push(marker)
      })

      if (markers.length) {
        const group = L.featureGroup(markers)
        map.fitBounds(group.getBounds().pad(0.2))
      }

      mapRef.current = map
    }

    init()
    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: 560 }} />
}
