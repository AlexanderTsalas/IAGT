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
    loading: () => (
      <div style={{ minHeight: "100vh", background: "var(--dark)" }} />
    ),
  },
);

interface Props {
  initialService?: string;
}

export default function ServicesScrollClient({ initialService }: Props) {
  return <ServicesScroll initialService={initialService} />;
}
