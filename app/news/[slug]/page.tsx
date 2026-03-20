import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getArticle, articles, type Article, type ContentBlock } from "@/lib/articles";
import ArticleSidebar from "./ArticleSidebar";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── content block renderer ─────────────────────────────────────────────── */

const prose = {
  p: {
    fontSize: "1.05rem",
    fontWeight: 300,
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.55)",
    margin: "0 0 1.25rem",
  } as React.CSSProperties,
  intro: {
    fontSize: "1.05rem",
    fontWeight: 300,
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.45)",
    margin: "0 0 0.6rem",
    fontStyle: "italic",
  } as React.CSSProperties,
  ul: {
    margin: "0 0 1.4rem",
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.55rem",
  },
  li: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.7rem",
    fontSize: "1rem",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.55)",
  } as React.CSSProperties,
  bullet: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "var(--pink)",
    flexShrink: 0,
    marginTop: "0.58em",
    opacity: 0.7,
  } as React.CSSProperties,
  h3: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: "0.01em",
    margin: "0 0 0.85rem",
  } as React.CSSProperties,
  subsectionWrap: {
    borderLeft: "2px solid rgba(255,31,142,0.2)",
    paddingLeft: "1.4rem",
    margin: "1.5rem 0",
  } as React.CSSProperties,
};

// Import React for CSSProperties type
import React from "react";

function RenderBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i} style={prose.p}>
              {block.text}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <div key={i}>
              {block.intro && <p style={prose.intro}>{block.intro}</p>}
              <ul style={prose.ul}>
                {block.items.map((item, j) => (
                  <li key={j} style={prose.li}>
                    <span style={prose.bullet} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (block.type === "subsection") {
          return (
            <div key={i} style={prose.subsectionWrap}>
              <h3 style={prose.h3}>{block.heading}</h3>
              <RenderBlocks blocks={block.body} />
            </div>
          );
        }

        return null;
      })}
    </>
  );
}

/* ─── static params ──────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

/* ─── page ──────────────────────────────────────────────────────────────────*/

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter(a => a.slug !== slug).slice(0, 2);

  return (
    <>
      <Header rightLabel="Market News" rightHref="/news" />
      <div style={{ minHeight: "100vh", background: "var(--dark)", paddingTop: 64 }}>

        {/* ── Article header ── */}
        <header style={{ borderBottom: "1px solid rgba(255,31,142,0.12)", padding: "5vh 8% 4vh" }}>

          {/* Breadcrumb nav */}
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <Link href="/news" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Market News
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(255,31,142,0.4)", fontSize: "0.65rem" }}>›</span>
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
              {article.coverLabel}
            </span>
          </nav>

          {/* Topic tags */}
          <div role="list" aria-label="Article topics" style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {article.tags.map(t => (
              <span
                key={t}
                role="listitem"
                style={{
                  fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "rgba(255,31,142,0.7)", border: "1px solid rgba(255,31,142,0.22)",
                  borderRadius: 3, padding: "3px 9px", fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* h1 — only one per page */}
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300, color: "white", lineHeight: 1.2, margin: "0 0 1rem", maxWidth: "72ch" }}>
            {article.title}
          </h1>
          <p style={{ fontSize: "1.05rem", fontWeight: 300, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, margin: "0 0 2rem", maxWidth: "68ch" }}>
            {article.subtitle}
          </p>

          {/* Author + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div
              aria-hidden="true"
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "rgba(255,31,142,0.14)", border: "1px solid rgba(255,31,142,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", color: "var(--pink)", fontWeight: 600, flexShrink: 0,
              }}
            >
              {article.author.initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "white", fontWeight: 400 }}>{article.author.name}</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>{article.author.title}</p>
            </div>
            <div aria-hidden="true" style={{ width: 1, height: 28, background: "rgba(255,31,142,0.2)", margin: "0 0.25rem" }} />
            <time dateTime={article.publishedAt} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
              {formatDate(article.publishedAt)}
            </time>
            <div aria-hidden="true" style={{ width: 1, height: 28, background: "rgba(255,31,142,0.2)", margin: "0 0.25rem" }} />
            <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,31,142,0.6)", fontWeight: 300 }}>
              {article.readingTime} min read
            </p>
          </div>
        </header>

        {/* ── Key stats bar ── */}
        <div
          role="region"
          aria-label="Key statistics"
          style={{
            borderBottom: "1px solid rgba(255,31,142,0.1)",
            padding: "2rem 8%",
            display: "grid",
            gridTemplateColumns: `repeat(${article.keyStats.length}, 1fr)`,
            gap: "1rem",
            background: "rgba(255,31,142,0.025)",
          }}
        >
          {article.keyStats.map(s => (
            <div key={s.label} style={{ borderLeft: "1px solid rgba(255,31,142,0.18)", paddingLeft: "1.25rem" }}>
              <p style={{ margin: 0, fontSize: "clamp(1.4rem, 2vw, 1.9rem)", fontWeight: 300, color: "var(--pink)", lineHeight: 1.1 }}>
                {s.value}
              </p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.68rem", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Body: two-column ── */}
        <div style={{ padding: "5vh 8% 8vh", display: "grid", gridTemplateColumns: "1fr 340px", gap: "5rem", alignItems: "start" }}>

          {/* Main article content */}
          <article>
            {article.sections.map((section, i) => (
              <section
                key={i}
                aria-labelledby={`section-${i}`}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,31,142,0.1)",
                  paddingTop: i === 0 ? 0 : "2.5rem",
                  marginTop: i === 0 ? 0 : "2.5rem",
                }}
              >
                {/* h2 — one per major section */}
                <h2
                  id={`section-${i}`}
                  style={{ fontSize: "1.25rem", fontWeight: 500, color: "white", letterSpacing: "0.01em", margin: "0 0 1.25rem" }}
                >
                  {section.heading}
                </h2>
                <RenderBlocks blocks={section.content} />
              </section>
            ))}

            {/* ── Sources ── */}
            <section aria-label="Sources" style={{ marginTop: "3.5rem", borderTop: "1px solid rgba(255,31,142,0.12)", paddingTop: "2rem" }}>
              <h2 style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,31,142,0.7)", fontWeight: 500, margin: "0 0 1.25rem" }}>
                Sources
              </h2>
              <ol style={{ margin: 0, padding: "0 0 0 1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {article.sources.map((s, i) => (
                  <li key={i} style={{ fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                    <cite style={{ fontStyle: "normal", color: "rgba(255,255,255,0.5)" }}>{s.title}</cite>
                    {" — "}
                    {s.publisher} ({s.year})
                  </li>
                ))}
              </ol>
            </section>
          </article>

          {/* Sidebar — client component */}
          <ArticleSidebar related={related} />

        </div>
      </div>
    </>
  );
}
