'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function deviceType() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobilais' : 'Dators'
}

function browserName() {
  const ua = navigator.userAgent
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome/')) return 'Chrome'
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Safari/')) return 'Safari'
  return 'Cits'
}

export default function PageViewBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        device_type: deviceType(),
        browser: browserName(),
      }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
