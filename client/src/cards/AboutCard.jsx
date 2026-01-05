export default function AboutCard({ content }) {
	if (!content) return null;

	return (
		<section className="card about">
			<div className="card-body">
				<div className="card-copy">
					<p className="eyebrow">About</p>
					<h2>{content.headline}</h2>
					{content.text && <p className="muted">{content.text}</p>}
					{content.cta?.label && (
						<a className="button" href={content.cta.target || "#"}>
							{content.cta.label}
						</a>
					)}
				</div>
				{content.media?.src && (
					<img
						className="card-media"
						src={content.media.src}
						alt={content.media.alt || ""}
					/>
				)}
			</div>
		</section>
	);
}
