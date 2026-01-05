export default function GalleryCard({ content }) {
	if (!content) return null;

	const images = Array.isArray(content.images) ? content.images : [];

	return (
		<section className="card gallery">
			<div className="card-head">
				<h2>{content.headline || "Gallery"}</h2>
				{content.description && <p className="muted">{content.description}</p>}
			</div>
			<div className="gallery-grid">
				{images.map((img, idx) => (
					<figure key={img.src || idx}>
						<img src={img.src} alt={img.alt || ""} />
						{img.caption && <figcaption className="muted">{img.caption}</figcaption>}
					</figure>
				))}
			</div>
			{content.cta?.label && (
				<a className="button ghost" href={content.cta.target || "#"}>
					{content.cta.label}
				</a>
			)}
		</section>
	);
}
