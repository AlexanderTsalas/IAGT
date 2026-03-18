"use client";

import dynamic from "next/dynamic";

// ssr: false must be declared in a Client Component.
// ServicesScroll uses GSAP ScrollTrigger, window, and D3 geo projections
// that produce different floating-point results server vs client.
const ServicesScroll = dynamic(() => import("./ServicesScroll"), { ssr: false });

export default function ServicesScrollClient() {
  return <ServicesScroll />;
}
