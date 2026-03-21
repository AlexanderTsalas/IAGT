"use client";

import dynamic from "next/dynamic";

// ssr: false must be declared in a Client Component.
// ServicesScroll uses GSAP ScrollTrigger, window, and D3 geo projections
// that produce different floating-point results server vs client.
//
// The loading placeholder reserves the full viewport height so the page has
// no layout shift (CLS) when the real component hydrates on the client.
const ServicesScroll = dynamic<{ initialService?: string }>(
  () => import("./ServicesScroll"),
  {
    ssr: false,
    // This loading state IS server-rendered — it's the LCP element.
    // It matches HeroOverlay's exact layout so there is no CLS when
    // ServicesScroll mounts and renders its own HeroOverlay on top.
    loading: () => (
      <div
        style={{
          height: "100vh",
          background: "var(--dark)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            paddingTop: "64px",
            paddingBottom: "10vh",
            paddingLeft: "6%",
            paddingRight: "50%",
            pointerEvents: "none",
          }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <h1
              style={{
                color: "white",
                fontWeight: 300,
                lineHeight: 1.25,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                maxWidth: "600px",
                marginBottom: "1rem",
              }}
            >
              Your operational gateway to{" "}
              <span style={{ color: "var(--pink)" }}>
                Greece &amp; Southeast Europe
              </span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                fontWeight: 300,
              }}
            >
              We don&apos;t just advise — we execute.
            </p>
          </div>
        </div>
      </div>
    ),
  },
);

interface Props {
  initialService?: string;
}

export default function ServicesScrollClient({ initialService }: Props) {
  return <ServicesScroll initialService={initialService} />;
}
