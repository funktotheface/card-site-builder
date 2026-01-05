export default function QuoteCard({ content }) {
  if (!content) return null;
  return (
    <section className="card quote">
      {content.quote && <blockquote>“{content.quote}”</blockquote>}
      {content.author && <p className="muted">— {content.author}</p>}
    </section>
  );
}
