"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect fires synchronously before the browser paints, so setting
  // opacity: 0 here prevents any flash of full-opacity content on route change.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
    );
  }, [pathname]);

  // opacity: 0 as inline style covers the initial server-render before JS runs
  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
