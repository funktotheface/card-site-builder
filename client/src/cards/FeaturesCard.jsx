export default function FeaturesCard({ content }) {
  if (!content) return null;
  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="card features">
      {content.headline && <h2>{content.headline}</h2>}
      {content.description && <p className="muted">{content.description}</p>}
      <div className="feature-grid">
        {items.map((item, idx) => (
          <div key={item.title || idx} className="feature">
            {item.icon && <span className="feature-icon">{item.icon}</span>}
            <h3>{item.title}</h3>
            {item.description && <p className="muted">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
