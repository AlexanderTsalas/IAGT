"use client";

import dynamic from "next/dynamic";
import HeroOverlay from "./HeroOverlay";

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
    // It renders the exact HeroOverlay so there is no CLS when
    // ServicesScroll mounts and renders its dynamic map context.
    loading: () => (
      <div
        style={{
          height: "100vh",
          background: "var(--dark)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <HeroOverlay onScrollToServices={() => {}} />
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
