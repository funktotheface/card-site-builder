export default function ContactCard({ content }) {
	if (!content) return null;

	const { contactInfo = {}, form = {} } = content;

	return (
		<section className="card contact" id="contact">
			<h2>{content.headline || "Get in touch"}</h2>
			{content.description && <p className="muted">{content.description}</p>}

			<div className="contact-grid">
				<div className="contact-info">
					{contactInfo.phone && <p><strong>Phone:</strong> {contactInfo.phone}</p>}
					{contactInfo.email && <p><strong>Email:</strong> {contactInfo.email}</p>}
					{contactInfo.socials && (
						<div className="socials">
							{Object.entries(contactInfo.socials).map(([network, url]) => (
								<a key={network} href={url} target="_blank" rel="noreferrer" className="muted">
									{network}
								</a>
							))}
						</div>
					)}
				</div>

				{Array.isArray(form.fields) && form.fields.length > 0 && (
					<form className="contact-form" action={form.submitEndpoint || "#"}>
						{form.fields.map((field) => (
							<label key={field.name} className="form-field">
								<span>{field.label}</span>
								{field.type === "textarea" ? (
									<textarea name={field.name} required={field.required} />
								) : (
									<input type={field.type || "text"} name={field.name} required={field.required} />
								)}
							</label>
						))}
						<button type="submit" className="button">
							{form.submitLabel || "Send"}
						</button>
					</form>
				)}
			</div>
		</section>
	);
}
