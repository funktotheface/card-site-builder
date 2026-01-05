import { useEffect, useMemo, useState } from "react";
import HeroCard from "./cards/Herocard";
import AboutCard from "./cards/AboutCard";
import ServiceCard from "./cards/ServiceCard";
import GalleryCard from "./cards/GalleryCard";
import ContactCard from "./cards/ContactCard";
import TextCard from "./cards/TextCard";
import FeaturesCard from "./cards/FeaturesCard";
import QuoteCard from "./cards/QuoteCard";
import FooterCard from "./cards/FooterCard";
import Builder from "./Builder";
import SitesList from "./SitesList";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const DEFAULT_THEME = {
  bg: "#ffffff",
  highlight: "#2563eb",
  secondary: "#000000",
  font: "inter",
};

function applyTheme(theme = {}) {
  const root = document.documentElement;
  const normalized = {
    bg: theme.bg || theme.background || theme.primary || DEFAULT_THEME.bg,
    highlight: theme.highlight || theme.accent || theme.secondary || DEFAULT_THEME.highlight,
    secondary: theme.secondary || theme.primary || DEFAULT_THEME.secondary,
    font: theme.font || DEFAULT_THEME.font,
  };

  root.style.setProperty("--bg", normalized.bg);
  root.style.setProperty("--highlight", normalized.highlight);
  root.style.setProperty("--secondary", normalized.secondary);
  root.style.setProperty("--font", normalized.font);
}

function CardRenderer({ card }) {
  const content = card.content || card.data || {};
  const media = card.media || {};

  switch (card.type) {
    case "hero":
      return <HeroCard content={content} media={media} />;
    case "about":
      return <AboutCard content={content} />;
    case "services":
      return <ServiceCard content={content} />;
    case "gallery":
      return <GalleryCard content={content} />;
    case "contact":
      return <ContactCard content={content} />;
    case "text":
      return <TextCard content={content} />;
    case "features":
      return <FeaturesCard content={content} />;
    case "quote":
      return <QuoteCard content={content} />;
    case "footer":
      return <FooterCard content={content} />;
    default:
      return (
        <section className="card unknown">
          <p>Unsupported card type: {card.type}</p>
        </section>
      );
  }
}

function App() {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("viewer"); // "viewer" | "builder" | "list" | "edit"
  const [editSite, setEditSite] = useState(null);
  
  // Get slug from URL or default to my-first-site
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const slug = pathParts[0] || "my-first-site";

  const sortedCards = useMemo(() => {
    if (!site?.cards) return [];
    return [...site.cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [site]);

  useEffect(() => {
    if (view !== "viewer") return;
    
    setLoading(true);
    fetch(`${API_BASE}/sites/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSite(data);
        applyTheme(data.theme);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [view, slug]);

  if (view === "builder") {
    return (
      <>
        <nav className="top-nav">
          <button onClick={() => setView("viewer")} className="nav-link">
            ← Back to Viewer
          </button>
        </nav>
        <Builder key="builder" mode="create" onSaved={() => setView("viewer")} />
      </>
    );
  }

  if (view === "edit" && editSite) {
    return (
      <>
        <nav className="top-nav">
          <button onClick={() => setView("viewer")} className="nav-link">
            ← Back to Viewer
          </button>
        </nav>
        <Builder
          key={`edit-${editSite.slug}`}
          mode="edit"
          initialSite={editSite}
          onSaved={() => setView("viewer")} 
        />
      </>
    );
  }

  if (view === "list") {
    return (
      <>
        <SitesList
          onCreate={() => setView("builder")}
          onView={(slug) => {
            window.location.href = `/${slug}`;
          }}
          onEdit={async (slug) => {
            const res = await fetch(`${API_BASE}/sites/${slug}`);
            if (res.ok) {
              const data = await res.json();
              setEditSite(data);
              setView("edit");
            }
          }}
        />
      </>
    );
  }

  if (loading) return <main className="page"><p>Loading site…</p></main>;
  if (error) return <main className="page"><p>Failed to load: {error}</p></main>;
  if (!site) return <main className="page"><p>No site data</p></main>;

  return (
    <main className="page">
      <header className="site-head">
        <div>
          <p className="site-slug">/{site.meta?.slug || site.slug}</p>
          <h1>{site.meta?.name || site.name}</h1>
          {site.meta?.description && <p className="muted">{site.meta.description}</p>}
        </div>
        <div className="pill-list">
          <button onClick={() => setView("list")} className="button ghost">
            Sites
          </button>
          <button onClick={() => setView("builder")} className="button">
            + New Site
          </button>
        </div>
      </header>

      <div className="cards">
        {sortedCards.map((card) => (
          <CardRenderer key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}

export default App;
