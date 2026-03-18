"use client";

import { useRef, forwardRef } from "react";

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Markets", href: "#markets" },
  { label: "About", href: "#about" },
];

interface HeaderProps {
  /** Ref forwarded to the logo slot — FlyingLogo animates into this position */
  logoSlotRef: React.RefObject<HTMLDivElement | null>;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logoSlotRef }, ref) => {
    return (
      <header
        ref={ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 5%",
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(0px)", // subtle — keeps it truly transparent
        }}
      >
        {/* LEFT — Navigation */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "white")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CENTER — Logo slot + brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {/* This div is the landing target for the FlyingLogo */}
          <div
            ref={logoSlotRef}
            style={{
              width: "28px",
              height: "24px",
              flexShrink: 0,
              // Invisible placeholder — FlyingLogo flies into this spot
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: "0.88rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            INTELLIAGTECH
          </span>
        </div>

        {/* RIGHT — CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid rgba(255,31,142,0.5)",
              color: "var(--pink)",
              padding: "8px 20px",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,31,142,0.1)";
              e.currentTarget.style.borderColor = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,31,142,0.5)";
            }}
          >
            Book a Conversation
          </button>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
export default Header;
