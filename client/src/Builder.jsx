import { useEffect, useState } from "react";
import "./Builder.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const DEFAULT_COLORS = {
  bg: "#ffffff",
  highlight: "#2563eb",
  secondary: "#000000",
};

const CARD_TYPES = ["hero", "text", "services", "about", "gallery", "contact", "features", "quote", "footer"];

export default function Builder({ initialSite, mode = "create", onSaved }) {
  const [tab, setTab] = useState("site");
  const [site, setSite] = useState(
    initialSite || {
      name: "",
      slug: "",
      status: "draft",
      theme: DEFAULT_COLORS,
      cards: [],
    }
  );
  const [newCard, setNewCard] = useState({ type: "text", order: 0, content: {} });
  const [galleryItem, setGalleryItem] = useState({ src: "", alt: "", caption: "" });
  const [serviceItem, setServiceItem] = useState({ title: "", description: "" });
  const [featureItem, setFeatureItem] = useState({ title: "", description: "", icon: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Refresh state when editing a different site
  useEffect(() => {
    if (initialSite) {
      setSite(initialSite);
      setNewCard({ type: "text", order: 0, content: {} });
      setGalleryItem({ src: "", alt: "", caption: "" });
      setServiceItem({ title: "", description: "" });
      setFeatureItem({ title: "", description: "", icon: "" });
      setTab("site");
    }
  }, [initialSite]);

  const handleSiteChange = (key, value) => {
    setSite((prev) => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (key, value) => {
    setSite((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  };

  const addCard = () => {
    const card = {
      id: `card-${Date.now()}`,
      type: newCard.type,
      order: site.cards.length,
      visibility: "public",
      content: newCard.content,
    };
    setSite((prev) => ({
      ...prev,
      cards: [...prev.cards, card],
    }));
    setNewCard({ type: "text", order: 0, content: {} });
    setGalleryItem({ src: "", alt: "", caption: "" });
    setServiceItem({ title: "", description: "" });
    setFeatureItem({ title: "", description: "", icon: "" });
  };

  const removeCard = (id) => {
    setSite((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!site.name || !site.slug) {
      setError("Name and slug are required");
      return;
    }

    const newSiteSlug = site.slug;

    try {
      const res = await fetch(`${API_BASE}/sites${mode === "edit" ? `/${initialSite?.slug || site.slug}` : ""}`, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `site-${Date.now()}`,
          ...site,
          meta: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg = data.details 
          ? `${data.error}: ${JSON.stringify(data.details)}`
          : data.error || "Failed to save site";
        throw new Error(msg);
      }

      setSuccess(`Site "${site.name}" ${mode === "edit" ? "updated" : "created"}! Redirecting...`);
      setTimeout(() => {
        if (onSaved) onSaved(site);
        window.location.href = `/${newSiteSlug}`;
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="builder">
      <header className="builder-head">
        <h1>Build a Site</h1>
        <p className="muted">Create a card-based site in minutes</p>
      </header>

      <div className="builder-tabs">
        <button
          className={`tab ${tab === "site" ? "active" : ""}`}
          onClick={() => setTab("site")}
        >
          Site Info
        </button>
        <button
          className={`tab ${tab === "theme" ? "active" : ""}`}
          onClick={() => setTab("theme")}
        >
          Theme
        </button>
        <button
          className={`tab ${tab === "cards" ? "active" : ""}`}
          onClick={() => setTab("cards")}
        >
          Cards ({site.cards.length})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="builder-form">
        {tab === "site" && (
          <fieldset>
            <legend>Site Information</legend>

            <label>
              <span>Site Name *</span>
              <input
                type="text"
                value={site.name}
                onChange={(e) => handleSiteChange("name", e.target.value)}
                placeholder="My Awesome Site"
                required
              />
            </label>

            <label>
              <span>Slug (URL) *</span>
              <input
                type="text"
                value={site.slug}
                onChange={(e) => handleSiteChange("slug", e.target.value)}
                placeholder="my-awesome-site"
                pattern="^[a-z0-9-]+$"
                title="Lowercase letters, numbers, and hyphens only"
                required
              />
            </label>

            <label>
              <span>Status</span>
              <select
                value={site.status}
                onChange={(e) => handleSiteChange("status", e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </fieldset>
        )}

        {tab === "theme" && (
          <fieldset>
            <legend>Theme Colors</legend>
            <p className="muted">Customize your site's appearance</p>

            <label>
              <span>Background</span>
              <div className="color-input">
                <input
                  type="color"
                  value={site.theme.bg}
                  onChange={(e) => handleThemeChange("bg", e.target.value)}
                />
                <input
                  type="text"
                  value={site.theme.bg}
                  onChange={(e) => handleThemeChange("bg", e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </label>

            <label>
              <span>Highlight (CTAs)</span>
              <div className="color-input">
                <input
                  type="color"
                  value={site.theme.highlight}
                  onChange={(e) => handleThemeChange("highlight", e.target.value)}
                />
                <input
                  type="text"
                  value={site.theme.highlight}
                  onChange={(e) => handleThemeChange("highlight", e.target.value)}
                  placeholder="#2563eb"
                />
              </div>
            </label>

            <label>
              <span>Secondary (Text)</span>
              <div className="color-input">
                <input
                  type="color"
                  value={site.theme.secondary}
                  onChange={(e) => handleThemeChange("secondary", e.target.value)}
                />
                <input
                  type="text"
                  value={site.theme.secondary}
                  onChange={(e) => handleThemeChange("secondary", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </label>
          </fieldset>
        )}

        {tab === "cards" && (
          <fieldset>
            <legend>Content Cards</legend>

            <div className="card-list">
              {site.cards.length === 0 ? (
                <p className="muted">No cards yet. Add one below.</p>
              ) : (
                site.cards.map((card) => (
                  <div key={card.id} className="card-item">
                    <div>
                      <p className="card-type">{card.type}</p>
                      {card.content?.headline && (
                        <p className="card-title">{card.content.headline}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCard(card.id)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="add-card">
              <h3>Add a Card</h3>
              <label>
                <span>Card Type</span>
                <select
                  value={newCard.type}
                  onChange={(e) => setNewCard({ type: e.target.value, order: site.cards.length, content: {} })}
                >
                  {CARD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              {newCard.type === "hero" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="Welcome to my site"
                    />
                  </label>
                  <label>
                    <span>Subheadline</span>
                    <input
                      type="text"
                      value={newCard.content.subheadline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, subheadline: e.target.value },
                        })
                      }
                      placeholder="A brief description"
                    />
                  </label>
                </>
              )}

              {newCard.type === "text" && (
                <>
                  <label>
                    <span>Title</span>
                    <input
                      type="text"
                      value={newCard.content.title || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, title: e.target.value },
                        })
                      }
                      placeholder="Section title"
                    />
                  </label>
                  <label>
                    <span>Body</span>
                    <textarea
                      value={newCard.content.body || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, body: e.target.value },
                        })
                      }
                      placeholder="Your text content"
                      rows="4"
                    />
                  </label>
                </>
              )}

              {newCard.type === "about" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="About Us"
                    />
                  </label>
                  <label>
                    <span>Text</span>
                    <textarea
                      value={newCard.content.text || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, text: e.target.value },
                        })
                      }
                      placeholder="Tell your story"
                      rows="4"
                    />
                  </label>
                </>
              )}

              {newCard.type === "services" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="What We Offer"
                    />
                  </label>
                  <div className="list-add">
                    <label>
                      <span>Service Title</span>
                      <input
                        type="text"
                        value={serviceItem.title}
                        onChange={(e) => setServiceItem({ ...serviceItem, title: e.target.value })}
                        placeholder="Fast Websites"
                      />
                    </label>
                    <label>
                      <span>Service Description</span>
                      <textarea
                        rows="3"
                        value={serviceItem.description}
                        onChange={(e) => setServiceItem({ ...serviceItem, description: e.target.value })}
                        placeholder="Optimized builds that load instantly"
                      />
                    </label>
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        if (!serviceItem.title) return;
                        const existing = Array.isArray(newCard.content.services) ? newCard.content.services : [];
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, services: [...existing, serviceItem] },
                        });
                        setServiceItem({ title: "", description: "" });
                      }}
                    >
                      + Add Service
                    </button>
                    <div className="pill-list">
                      {(newCard.content.services || []).map((svc, idx) => (
                        <span key={idx} className="pill">
                          {svc.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {newCard.type === "gallery" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="Gallery"
                    />
                  </label>
                  <div className="list-add">
                    <label>
                      <span>Image URL</span>
                      <input
                        type="text"
                        value={galleryItem.src}
                        onChange={(e) => setGalleryItem({ ...galleryItem, src: e.target.value })}
                        placeholder="https://..."
                      />
                    </label>
                    <label>
                      <span>Alt text</span>
                      <input
                        type="text"
                        value={galleryItem.alt}
                        onChange={(e) => setGalleryItem({ ...galleryItem, alt: e.target.value })}
                        placeholder="Description"
                      />
                    </label>
                    <label>
                      <span>Caption</span>
                      <input
                        type="text"
                        value={galleryItem.caption}
                        onChange={(e) => setGalleryItem({ ...galleryItem, caption: e.target.value })}
                        placeholder="Optional caption"
                      />
                    </label>
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        if (!galleryItem.src) return;
                        const existing = Array.isArray(newCard.content.images) ? newCard.content.images : [];
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, images: [...existing, galleryItem] },
                        });
                        setGalleryItem({ src: "", alt: "", caption: "" });
                      }}
                    >
                      + Add Image
                    </button>
                    <div className="pill-list">
                      {(newCard.content.images || []).map((img, idx) => (
                        <span key={idx} className="pill">
                          {img.src?.slice(0, 24) || "Image"}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {newCard.type === "contact" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="Get in Touch"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      value={newCard.content.contactInfo?.email || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: {
                            ...newCard.content,
                            contactInfo: { ...newCard.content.contactInfo, email: e.target.value },
                          },
                        })
                      }
                      placeholder="hello@example.com"
                    />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      type="text"
                      value={newCard.content.contactInfo?.phone || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: {
                            ...newCard.content,
                            contactInfo: { ...newCard.content.contactInfo, phone: e.target.value },
                          },
                        })
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </label>
                </>
              )}

              {newCard.type === "features" && (
                <>
                  <label>
                    <span>Headline</span>
                    <input
                      type="text"
                      value={newCard.content.headline || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, headline: e.target.value },
                        })
                      }
                      placeholder="Key Features"
                    />
                  </label>
                  <div className="list-add">
                    <label>
                      <span>Feature Title</span>
                      <input
                        type="text"
                        value={featureItem.title}
                        onChange={(e) => setFeatureItem({ ...featureItem, title: e.target.value })}
                        placeholder="Fast Setup"
                      />
                    </label>
                    <label>
                      <span>Description</span>
                      <textarea
                        rows="3"
                        value={featureItem.description}
                        onChange={(e) => setFeatureItem({ ...featureItem, description: e.target.value })}
                        placeholder="Spin up a new site quickly"
                      />
                    </label>
                    <label>
                      <span>Icon (optional)</span>
                      <input
                        type="text"
                        value={featureItem.icon}
                        onChange={(e) => setFeatureItem({ ...featureItem, icon: e.target.value })}
                        placeholder="zap"
                      />
                    </label>
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        if (!featureItem.title) return;
                        const existing = Array.isArray(newCard.content.items) ? newCard.content.items : [];
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, items: [...existing, featureItem] },
                        });
                        setFeatureItem({ title: "", description: "", icon: "" });
                      }}
                    >
                      + Add Feature
                    </button>
                    <div className="pill-list">
                      {(newCard.content.items || []).map((it, idx) => (
                        <span key={idx} className="pill">
                          {it.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {newCard.type === "quote" && (
                <>
                  <label>
                    <span>Quote</span>
                    <textarea
                      value={newCard.content.quote || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, quote: e.target.value },
                        })
                      }
                      placeholder="A meaningful quote"
                      rows="3"
                    />
                  </label>
                  <label>
                    <span>Author</span>
                    <input
                      type="text"
                      value={newCard.content.author || ""}
                      onChange={(e) =>
                        setNewCard({
                          ...newCard,
                          content: { ...newCard.content, author: e.target.value },
                        })
                      }
                      placeholder="Author name"
                    />
                  </label>
                </>
              )}

              {newCard.type === "footer" && (
                <label>
                  <span>Text</span>
                  <input
                    type="text"
                    value={newCard.content.text || ""}
                    onChange={(e) =>
                      setNewCard({
                        ...newCard,
                        content: { ...newCard.content, text: e.target.value },
                      })
                    }
                    placeholder="© 2026 My Site"
                  />
                </label>
              )}

              <button type="button" onClick={addCard} className="button">
                + Add Card
              </button>
            </div>
          </fieldset>
        )}

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="button primary">
            Save Site
          </button>
        </div>
      </form>
    </main>
  );
}
