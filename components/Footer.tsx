"use client";

import Link from "next/link";
import { LogoMark } from "./FlyingLogo";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--dark)",
        borderTop: "1px solid rgba(255,31,142,0.15)",
        padding: "2.5rem 5%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "start",
        gap: "2rem",
      }}
    >
      {/* ── Left — brand + contact ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.1rem" }}>
          <LogoMark size={26} />
          <span style={{ color: "white", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.22em" }}>
            INTELLIAGTECH
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <a
            href="mailto:hello@iagt.com"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", fontWeight: 300, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            hello@iagt.com
          </a>
          <a
            href="tel:+302102603751"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", fontWeight: 300, textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            +30 210 260 3751
          </a>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", fontWeight: 300, lineHeight: 1.5 }}>
            Grammou 71, Marousi 151 24, Greece
            <br />BCO Business Center Offices
          </span>
        </div>
      </div>

      {/* ── Center — legal links ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Legal
        </span>
        {[
          { label: "Privacy Policy",      href: "/privacy" },
          { label: "Terms of Service",    href: "/terms" },
          { label: "Cookie Policy",       href: "/cookies" },
          { label: "GDPR Data Request",   href: "/gdpr" },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontWeight: 300, textDecoration: "none", letterSpacing: "0.03em", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* ── Right — registry ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Company
        </span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.03em" }}>
          IntelliAGTech Μονοπροσωπη ΙΚΕ
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontWeight: 300 }}>
          Business Registry No.
        </span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.06em" }}>
          ΓΕΜΗ 190197803000
        </span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontWeight: 300, marginTop: "0.75rem" }}>
          © {new Date().getFullYear()} IntelliAgTech. All rights reserved.
        </span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontWeight: 300 }}>
          Developed and Maintained by{" "}
          <a
            href="https://distarter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--pink)", textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Distarter
          </a>
        </span>
      </div>
    </footer>
  );
}
