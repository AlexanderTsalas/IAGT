"use client";

import Link from "next/link";
import { type Article } from "@/lib/articles";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{ borderTop: "1px solid rgba(255,31,142,0.14)", padding: "1rem 0", transition: "opacity 0.18s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.7"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
      >
        <span style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--pink)", fontWeight: 500 }}>
          {article.coverLabel}
        </span>
        <p style={{ margin: "0.4rem 0 0.3rem", fontSize: "0.82rem", color: "white", fontWeight: 400, lineHeight: 1.45 }}>
          {article.title}
        </p>
        <p style={{ margin: 0, fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
          {formatDate(article.publishedAt)} · {article.readingTime} min
        </p>
      </div>
    </Link>
  );
}

export default function ArticleSidebar({ related }: { related: Article[] }) {
  return (
    <aside style={{ position: "sticky", top: "80px" }}>
      {/* CTA */}
      <div style={{ border: "1px solid rgba(255,31,142,0.22)", borderRadius: 7, padding: "1.75rem", marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--pink)", fontWeight: 500 }}>
          Work With Us
        </span>
        <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: "0.75rem 0 1.25rem" }}>
          IntelliAgTech advises international companies on market entry, regulatory navigation, and commercial representation across Greece and South-East Europe.
        </p>
        <Link
          href="/contact"
          style={{
            display: "block", textAlign: "center",
            padding: "11px 0",
            background: "rgba(255,31,142,0.1)",
            border: "1px solid rgba(255,31,142,0.35)",
            color: "var(--pink)",
            borderRadius: 5,
            fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase",
            fontWeight: 500, textDecoration: "none",
            transition: "background 0.18s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,31,142,0.18)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,31,142,0.1)"; }}
        >
          Get in Touch →
        </Link>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
            Related
          </span>
          {related.map(a => (
            <RelatedCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </aside>
  );
}
