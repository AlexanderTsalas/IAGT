"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { articles, allTags, type Article } from "@/lib/articles";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

function TagPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 16px",
        borderRadius: 4,
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 500,
        fontFamily: "inherit",
        cursor: "pointer",
        border: `1px solid ${active ? "var(--pink)" : "rgba(255,31,142,0.22)"}`,
        background: active ? "rgba(255,31,142,0.12)" : "transparent",
        color: active ? "var(--pink)" : "rgba(255,255,255,0.4)",
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/news/${article.slug}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          border: `1px solid ${hovered ? "rgba(255,31,142,0.4)" : "rgba(255,31,142,0.14)"}`,
          borderRadius: 8,
          overflow: "hidden",
          background: hovered ? "rgba(255,31,142,0.03)" : "transparent",
          transition: "border-color 0.2s ease, background 0.2s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Cover label */}
        <div
          style={{
            background: "rgba(255,31,142,0.06)",
            borderBottom: "1px solid rgba(255,31,142,0.12)",
            padding: "1.4rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "var(--pink)", fontWeight: 500, textTransform: "uppercase" }}>
            {article.coverLabel}
          </span>
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
            {article.readingTime} min read
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 400, color: "white", lineHeight: 1.45, margin: "0 0 0.75rem" }}>
            {article.title}
          </h2>
          <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 1.25rem", flex: 1 }}>
            {article.excerpt}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
            {article.tags.map(t => (
              <span
                key={t}
                style={{
                  fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "rgba(255,31,142,0.7)", border: "1px solid rgba(255,31,142,0.2)",
                  borderRadius: 3, padding: "3px 8px", fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,31,142,0.15)",
              border: "1px solid rgba(255,31,142,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem", color: "var(--pink)", fontWeight: 600, letterSpacing: "0.02em", flexShrink: 0,
            }}>
              {article.author.initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>
                {article.author.name}
              </p>
              <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.28)", fontWeight: 300 }}>
                {formatDate(article.publishedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/news/${article.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          border: `1px solid ${hovered ? "rgba(255,31,142,0.45)" : "rgba(255,31,142,0.18)"}`,
          borderRadius: 8,
          overflow: "hidden",
          background: hovered ? "rgba(255,31,142,0.03)" : "transparent",
          transition: "border-color 0.2s ease, background 0.2s ease",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Left — stats panel */}
        <div
          style={{
            background: "rgba(255,31,142,0.05)",
            borderRight: "1px solid rgba(255,31,142,0.12)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>
              Featured · {article.coverLabel}
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {article.tags.map(t => (
                <span key={t} style={{ fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,31,142,0.65)", border: "1px solid rgba(255,31,142,0.18)", borderRadius: 3, padding: "3px 7px", fontWeight: 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem", marginTop: "2rem" }}>
            {article.keyStats.map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 300, color: "var(--pink)", lineHeight: 1.1 }}>{s.value}</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.68rem", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — title + excerpt */}
        <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)", fontWeight: 300, color: "white", lineHeight: 1.35, margin: "0 0 1rem" }}>
              {article.title}
            </h2>
            <p style={{ fontSize: "0.92rem", fontWeight: 300, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, margin: 0 }}>
              {article.subtitle}
            </p>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,31,142,0.15)", border: "1px solid rgba(255,31,142,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", color: "var(--pink)", fontWeight: 600,
              }}>
                {article.author.initials}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>{article.author.name}</p>
                <p style={{ margin: 0, fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>{article.author.title}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>{formatDate(article.publishedAt)}</p>
              <p style={{ margin: "0.15rem 0 0", fontSize: "0.65rem", color: "rgba(255,31,142,0.6)" }}>{article.readingTime} min read →</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────────*/

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const featured = articles[0];
  const filteredArticles = activeTag
    ? articles.filter(a => a.tags.includes(activeTag))
    : articles;

  const gridArticles = activeTag ? filteredArticles : articles.slice(1);

  return (
    <>
      <Header rightLabel="Home" rightHref="/" />
      <div style={{ minHeight: "100vh", background: "var(--dark)", paddingTop: 64 }}>
        <div style={{ padding: "6vh 8% 10vh" }}>

          {/* ── Page header ── */}
          <div style={{ marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>
              Market Intelligence
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "white", margin: "0.6rem 0 0.5rem", lineHeight: 1.1 }}>
              Market News
            </h1>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 300, margin: 0 }}>
              Perspectives on market entry, regulation, and investment across Greece, the Balkans, and South-East Europe.
            </p>
            <div style={{ width: 48, height: 1, background: "rgba(255,31,142,0.4)", marginTop: "1.5rem" }} />
          </div>

          {/* ── Featured article (only when no tag filter active) ── */}
          {!activeTag && (
            <div style={{ marginBottom: "3rem" }}>
              <FeaturedArticle article={featured} />
            </div>
          )}

          {/* ── Tag filters ── */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500, marginRight: "0.25rem" }}>
              Filter:
            </span>
            <TagPill
              label="All"
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            />
            {allTags.map(tag => (
              <TagPill
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>

          {/* ── Article grid ── */}
          {gridArticles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {gridArticles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", fontWeight: 300 }}>
              No articles match this filter.
            </p>
          )}

          {/* ── Footer nav ── */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,31,142,0.12)", flexWrap: "wrap" }}>
            {[
              { label: "Home",           href: "/" },
              { label: "Services",       href: "/#services" },
              { label: "Contact",        href: "/contact" },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label} →
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
