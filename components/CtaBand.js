import Link from 'next/link'

export default function CtaBand({
  heading = 'Gatavi pieteikties?',
  body = 'Bez saistībām — galīgo cenu vienmēr apstiprinām sarunā pa telefonu.',
  primaryHref = '/kalkulators/',
  primaryLabel = 'Aprēķināt cenu',
  secondaryHref,
  secondaryLabel,
  showPhone = true,
}) {
  return (
    <section className="block">
      <div className="wrap">
        <div className="cta-band">
          <div>
            <h2>{heading}</h2>
            <p>{body}</p>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={primaryHref} className="btn-p">
              {primaryLabel}
            </Link>
            {secondaryLabel && (
              <Link href={secondaryHref} className="btn-outline">
                {secondaryLabel}
              </Link>
            )}
            {showPhone && (
              <a href="tel:+37126275983" className="btn-outline">
                Zvanīt +371 26 275 983
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
