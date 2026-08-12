import { Lora } from 'next/font/google'
import './globals.css'

const lora = Lora({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-lora' })

export const metadata = {
  metadataBase: new URL('https://www.apkomforts.com'),
  title: 'AP Komfort — Apkures katlu apkope, Siltumsūkņi un Santehnika Rīgā un Pierīgā',
  description:
    'Apkures katlu apkope un serviss, siltumsūkņu apkope, santehnikas darbi un avārijas remonts Rīgā un Pierīgā. Sertificēts inženieris, cenas kalkulators tiešsaistē.',
  keywords: [
    'apkures katlu apkope',
    'apkures katlu serviss',
    'gāzes katlu apkope',
    'siltumsūkņu apkope',
    'santehnikas darbi',
    'apkures katla apkope cena',
    'avārijas santehniķis Rīga',
    'apkures serviss Pierīga',
  ],
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/APKomfort-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/APKomfort-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/APKomfort-icon-180.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="lv" className={lora.variable}>
      <body>{children}</body>
    </html>
  )
}
