export default function Faq({ items, eyebrow = 'Jautājumi', heading = 'Biežāk uzdotie jautājumi' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section className="block alt">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div className="section-head">
          <div className="eyebrow">{eyebrow}</div>
          <h2>{heading}</h2>
        </div>
        <div className="faq">
          {items.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  )
}
