import Link from 'next/link'

export default function PageIntro({ eyebrow, h1, intro, ctaHref = '/kalkulators/', ctaLabel, secondaryHref, secondaryLabel }) {
  return (
    <section className="block page-intro">
      <div className="wrap">
        <div className="section-head center" style={{ maxWidth: 720 }}>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{h1}</h1>
          {intro && <p>{intro}</p>}
        </div>
        {(ctaLabel || secondaryLabel) && (
          <div className="cta" style={{ justifyContent: 'center', marginTop: 8 }}>
            {ctaLabel && (
              <Link href={ctaHref} className="btn-p">
                {ctaLabel}
              </Link>
            )}
            {secondaryLabel && (
              <Link href={secondaryHref} className="btn-outline">
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
