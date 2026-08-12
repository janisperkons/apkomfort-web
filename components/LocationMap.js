'use client'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const RIGA_CENTER = [56.9496, 24.1052]

// Shared Leaflet primitive: readOnly=true shows a single fixed pin (property
// detail pages), readOnly=false lets the user click/drag to place one
// (registration + edit forms). Uses circleMarker instead of the default
// L.marker icon to sidestep Leaflet's well-known broken-icon-path-under-a-
// bundler issue.
export default function LocationMap({ lat, lng, onChange, readOnly = false, height = 320 }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current || mapRef.current) return

      const start = (lat != null && lng != null) ? [lat, lng] : RIGA_CENTER
      const map = L.map(containerRef.current, {
        dragging: true, scrollWheelZoom: !readOnly,
      }).setView(start, lat != null ? 15 : 11)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      function placeMarker(latlng) {
        if (markerRef.current) { markerRef.current.setLatLng(latlng); return }
        markerRef.current = L.circleMarker(latlng, {
          radius: 9, weight: 2, color: '#26251F', fillColor: '#7A5C3E', fillOpacity: 0.9,
        }).addTo(map)
      }

      if (lat != null && lng != null) placeMarker([lat, lng])

      if (!readOnly) {
        map.on('click', e => {
          placeMarker(e.latlng)
          onChange?.(e.latlng.lat, e.latlng.lng)
        })
      }

      mapRef.current = map
    }

    init()
    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height, borderRadius: 10, overflow: 'hidden' }} />
}
