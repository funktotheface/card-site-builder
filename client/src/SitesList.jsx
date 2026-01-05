import { useEffect, useState } from "react";
import "./Builder.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function SitesList({ onView, onEdit, onCreate }) {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/sites`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then(setSites)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="builder"><p>Loading sites…</p></div>;
  if (error) return <div className="builder"><p className="alert error">{error}</p></div>;

  return (
    <div className="builder">
      <header className="builder-head">
        <h1>Sites</h1>
        <p className="muted">Browse, view, and edit existing sites</p>
        <button className="button" onClick={onCreate}>+ New Site</button>
      </header>
      <div className="card-list">
        {sites.length === 0 && <p className="muted">No sites yet.</p>}
        {sites.map((s) => (
          <div key={s.id || s.slug} className="card-item">
            <div>
              <p className="card-type">{s.status || "draft"}</p>
              <p className="card-title">{s.name || s.slug}</p>
              <p className="muted">/{s.slug}</p>
            </div>
            <div className="pill-list">
              <button className="button" onClick={() => onView && onView(s.slug)}>View</button>
              <button className="button" onClick={() => onEdit && onEdit(s.slug)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
