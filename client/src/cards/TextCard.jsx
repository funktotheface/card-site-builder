export default function TextCard({ content }) {
  if (!content) return null;
  return (
    <section className="card text">
      {content.title && <p className="eyebrow">{content.title}</p>}
      {content.headline && <h2>{content.headline}</h2>}
      {content.body && <p className="muted">{content.body}</p>}
    </section>
  );
}
