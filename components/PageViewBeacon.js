'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabaseBrowser } from '../lib/supabase'

const TZ_COUNTRY = {
  'Europe/Riga': 'Latvija', 'Europe/Tallinn': 'Igaunija', 'Europe/Vilnius': 'Lietuva',
  'Europe/Moscow': 'Krievija', 'Europe/Kaliningrad': 'Krievija', 'Europe/Minsk': 'Baltkrievija',
}

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

function guessCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TZ_COUNTRY[tz] || null
  } catch {
    return null
  }
}

export default function PageViewBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    supabaseBrowser().from('page_views').insert({
      path: pathname,
      referrer: document.referrer || null,
      device_type: deviceType(),
      browser: browserName(),
      country: guessCountry(),
    }).then(() => {}, () => {})
  }, [pathname])

  return null
}
