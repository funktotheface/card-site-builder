export default function FooterCard({ content }) {
  if (!content) return null;
  const links = Array.isArray(content.links) ? content.links : [];

  return (
    <footer className="card footer">
      {content.text && <p>{content.text}</p>}
      {links.length > 0 && (
        <div className="footer-links">
          {links.map((link) => (
            <a key={link.url} href={link.url} className="muted">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
