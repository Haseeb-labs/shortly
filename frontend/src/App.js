import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:8000";

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

/* ── Copy Button ── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={copy} className={`copy-btn ${copied ? "copied" : ""}`}>
      {copied ? "copied!" : "copy"}
    </button>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

/* ── URL Row ── */
function UrlRow({ url, onDelete, isDeleting }) {
  const truncate = (str, n = 55) =>
    str.length > n ? str.slice(0, n) + "…" : str;

  return (
    <div className="url-row">
      <div className="url-info">
        <div className="url-code-row">
          <span className="url-short-code">/{url.short_code}</span>
          <CopyButton text={url.short_url} />
        </div>
        <p className="url-original" title={url.original_url}>
          {truncate(url.original_url)}
        </p>
      </div>
      <div className="row-actions">
        <a
          href={url.short_url}
          target="_blank"
          rel="noreferrer"
          className="open-link"
          title="Open"
        >
          ↗
        </a>
        <button
          onClick={() => onDelete(url.short_code)}
          disabled={isDeleting}
          className="delete-btn"
        >
          {isDeleting ? "…" : "delete"}
        </button>
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [deletingCode, setDeletingCode] = useState(null);
  const [lastCreated, setLastCreated] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUrls(data);
    } catch {
      showToast("Could not fetch URLs", "error");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: urlInput }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLastCreated(data);
      setUrlInput("");
      showToast("Short URL created!");
      fetchAll();
    } catch {
      showToast("Failed to shorten URL", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (short_code) => {
    setDeletingCode(short_code);
    try {
      const res = await fetch(`${API}/delete/${short_code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      if (lastCreated?.short_code === short_code) setLastCreated(null);
      showToast("URL deleted");
      fetchAll();
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeletingCode(null);
    }
  };

  const filtered = urls.filter(
    (u) =>
      u.original_url.toLowerCase().includes(search.toLowerCase()) ||
      u.short_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 10L10 6M8 4l2-2a3 3 0 014 4l-2 2M8 12l-2 2a3 3 0 01-4-4l2-2"
                stroke="#000"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="header-title">snip.io</span>
        </div>
        <span className="header-meta">localhost:8000</span>
      </header>

      <main className="main">
        {/* Hero */}
        <div className="hero">
          <h1 className="hero-heading">
            Shorten.<br />
            <span className="accent">Share.</span>
          </h1>
          <p className="hero-sub">
            Paste a long URL, get a clean short link instantly.
          </p>
        </div>

        {/* Form */}
        <form className="shorten-form" onSubmit={handleShorten}>
          <input
            type="url"
            className="url-input"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://very-long-url.com/with/a/really/long/path"
            required
          />
          <button type="submit" className="shorten-btn" disabled={loading}>
            {loading ? "..." : "Shorten →"}
          </button>
        </form>

        {/* Just created */}
        {lastCreated && (
          <div className="just-created">
            <p className="just-created-label">Just created</p>
            <div className="just-created-body">
              <div>
                <p className="just-created-short">{lastCreated.short_url}</p>
                <p className="just-created-original">
                  {lastCreated.original_url}
                </p>
              </div>
              <div className="just-created-actions">
                <CopyButton text={lastCreated.short_url} />
                <a
                  href={lastCreated.short_url}
                  target="_blank"
                  rel="noreferrer"
                  className="open-btn"
                >
                  open ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <StatCard label="Total Links" value={urls.length} />
          <StatCard
            label="Showing"
            value={search ? filtered.length : urls.length}
          />
        </div>

        {/* List */}
        <div className="list-header">
          <h2 className="list-title">All Links</h2>
          <input
            type="text"
            className="search-input"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {fetching ? (
          <div className="url-list">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">∅</p>
            <p className="empty-text">
              {search
                ? "No links match your search."
                : "No links yet — shorten something!"}
            </p>
          </div>
        ) : (
          <div className="url-list">
            {filtered.map((u) => (
              <UrlRow
                key={u.short_code}
                url={u}
                onDelete={handleDelete}
                isDeleting={deletingCode === u.short_code}
              />
            ))}
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
