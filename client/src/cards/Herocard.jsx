export default function HeroCard({ content, media }) {
  if (!content) return null;

  const bgImage = media?.background?.url;

  return (
    <section
      className="card hero"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <div className="hero-overlay">
        <h1>{content.headline || "Hero heading"}</h1>
        {content.subheadline && <p className="muted lead">{content.subheadline}</p>}
        {content.tagline && <p className="muted">{content.tagline}</p>}

        {content.cta?.label && (
          <a className="button" href={content.cta.target || "#"}>
            {content.cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
