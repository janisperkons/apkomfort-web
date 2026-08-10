import Link from 'next/link'

export default function CtaBand({
  heading = 'Uzziniet savu cenu divās minūtēs',
  body = 'Bez saistībām. Galīgo cenu vienmēr apstiprinām sarunā pa telefonu.',
  primaryHref = '/kalkulators/',
  primaryLabel = 'Aprēķināt cenu',
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
            <a href="tel:+37158860194" className="btn-outline">
              Zvanīt +371 58 860 194
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
