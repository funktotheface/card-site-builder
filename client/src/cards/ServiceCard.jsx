export default function ServiceCard({ content }) {
	if (!content) return null;

	const services = Array.isArray(content.services) ? content.services : [];

	return (
		<section className="card services">
			<div className="card-head">
				<h2>{content.headline || "Services"}</h2>
				{content.intro && <p className="muted">{content.intro}</p>}
			</div>
			<div className="service-list">
				{services.map((item) => (
					<div key={item.id || item.title} className="service-item">
						<h3>{item.title}</h3>
						{item.description && <p className="muted">{item.description}</p>}
					</div>
				))}
			</div>
			{content.cta?.label && (
				<a className="button" href={content.cta.target || "#"}>
					{content.cta.label}
				</a>
			)}
		</section>
	);
}
