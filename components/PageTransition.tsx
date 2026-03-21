"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip animation on initial page load — content is immediately visible,
    // which lets the LCP element paint without waiting for GSAP to evaluate.
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Route changes: GSAP is already cached in the browser at this point.
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";

    import("gsap").then(({ default: gsap }) => {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    });
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
