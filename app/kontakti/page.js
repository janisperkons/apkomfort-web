import Link from 'next/link'
import PageIntro from '../../components/PageIntro'
import ContactForm from '../../components/ContactForm'

export const metadata = {
  title: 'Kontakti — Rīga un Pierīga — AP Komfort',
  description: 'Sazinieties ar AP Komfort — apkures katlu apkope, siltumsūkņi un santehnika Rīgā un Pierīgā. Telefons, apkalpošanas zona un pieteikuma forma.',
}

const TOWNS = ['Mārupē', 'Ādažos', 'Ķekavā', 'Ropažos', 'Salaspilī', 'Jūrmalā', 'Olainē', 'Babītē']

export default function KontaktiPage() {
  return (
    <>
      <PageIntro eyebrow="Kontakti" h1="Kontakti — Rīga un Pierīga" />

      <section className="block">
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: 'start' }}>
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Aleksejs Perkons</h3>
                <p style={{ marginTop: 10 }}>
                  <a href="tel:+37158860194" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>
                    +371 58 860 194
                  </a>
                </p>
                <p style={{ marginTop: 14 }}>
                  Pieejami darba dienās. Zvanus ārpus darba laika izskatām pēc iespējas — precīzu
                  ierašanās laiku avārijas gadījumos vienmēr apstiprinām sarunas laikā, nevis
                  solām iepriekš.
                </p>
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <h3>Apkalpojam</h3>
                <div className="town-list" style={{ marginTop: 14 }}>
                  {TOWNS.map((t) => (
                    <span key={t} style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: 999, background: 'var(--cream)', border: '1px solid var(--line)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: 14 }}>Rīga un tuvākie novadi. Jūsu novada šeit nav? Piezvaniet — visdrīzāk braucam arī tur.</p>
              </div>

              <div className="note">
                <strong>Jūtat gāzes smaku?</strong> Zvaniet Gaso avārijas dienestam <strong>114</strong>{' '}
                — pirms zvana mums. Skatiet arī{' '}
                <Link href="/avarijas-izsaukums/">avārijas izsaukuma lapu</Link>.
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
