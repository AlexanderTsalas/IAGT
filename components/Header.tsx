"use client";

import { useState, useRef, forwardRef } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { LogoMark } from "@/components/FlyingLogo";

const serviceNumbers = ["01", "02", "03", "04", "05", "06"];

interface HeaderProps {
  /** Ref forwarded to the logo slot — FlyingLogo animates into this position.
   *  When omitted the LogoMark is rendered directly. */
  logoSlotRef?: React.RefObject<HTMLDivElement | null>;
  /** Right-side CTA. Defaults to "Get in Touch" → /contact */
  rightLabel?: string;
  rightHref?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logoSlotRef, rightLabel = "Get in Touch", rightHref = "/contact" }, ref) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openDropdown  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropdownOpen(true); };
    const closeDropdown = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 120); };

    return (
      <header
        ref={ref}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: "64px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 5%",
          background: "rgba(17,17,19,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* LEFT — Navigation */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>

          {/* Services — always a dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              style={{
                background: "none", border: "none", padding: 0,
                color: dropdownOpen ? "white" : "rgba(255,255,255,0.55)",
                fontSize: "0.8rem", letterSpacing: "0.08em",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "5px",
                transition: "color 0.2s ease",
              }}
            >
              Services
              <svg
                width="8" height="5" viewBox="0 0 8 5" fill="none"
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  opacity: 0.6,
                }}
              >
                <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown panel */}
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 18px)",
                left: "-1.25rem",
                width: "280px",
                background: "rgba(17,17,19,0.97)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "8px",
                padding: "0.5rem 0",
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                opacity: dropdownOpen ? 1 : 0,
                pointerEvents: dropdownOpen ? "auto" : "none",
                transform: dropdownOpen ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.18s ease, transform 0.18s ease",
              }}
            >
              {services.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  onClick={closeDropdown}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.85rem",
                    padding: "0.65rem 1.1rem", textDecoration: "none",
                    borderBottom: i < services.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,31,142,0.06)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ color: "rgba(255,31,142,0.55)", fontSize: "0.6rem", letterSpacing: "0.15em", flexShrink: 0 }}>
                    {serviceNumbers[i]}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.35 }}>
                    {s.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Market News */}
          <Link
            href="/news"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.8rem", letterSpacing: "0.08em",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
          >
            Market News
          </Link>

        </nav>

        {/* CENTER — Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", textDecoration: "none" }}
          onClick={e => {
            // If already on the home page (no query string), force a full reload so
            // ServicesScroll remounts and the hero is shown — client-side navigation
            // to the same URL is a no-op and wouldn't reset component state.
            if (typeof window !== "undefined" && window.location.pathname === "/" && !window.location.search) {
              e.preventDefault();
              window.location.href = "/";
            }
          }}
        >
          {logoSlotRef ? (
            /* Invisible slot — FlyingLogo flies into this position */
            <div ref={logoSlotRef} style={{ width: "28px", height: "24px", flexShrink: 0 }} />
          ) : (
            <LogoMark size={24} />
          )}
          <span style={{ color: "white", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.22em", whiteSpace: "nowrap" }}>
            INTELLIAGTECH
          </span>
        </Link>

        {/* RIGHT — CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            href={rightHref}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,31,142,0.5)",
              color: "var(--pink)",
              padding: "8px 20px",
              fontSize: "0.78rem", letterSpacing: "0.08em",
              borderRadius: "4px", cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap", textDecoration: "none", display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,31,142,0.1)"; e.currentTarget.style.borderColor = "var(--pink)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,31,142,0.5)"; }}
          >
            {rightLabel}
          </Link>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
export default Header;
