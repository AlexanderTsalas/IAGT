"use client";

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let rafId = -1;
    let canceled = false;
    let removeGsapTicker: (() => void) | null = null;

    // Drive Lenis immediately with a native RAF loop so scrolling works
    // before GSAP finishes loading.
    function nativeRaf() {
      lenisRef.current?.lenis?.raf(performance.now());
      rafId = requestAnimationFrame(nativeRaf);
    }
    rafId = requestAnimationFrame(nativeRaf);

    // Load GSAP + ScrollTrigger asynchronously — they are not on the critical
    // path. Once loaded, swap the native RAF for GSAP's higher-precision ticker
    // and sync ScrollTrigger with Lenis scroll events.
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (canceled) return;
      cancelAnimationFrame(rafId);

      gsap.registerPlugin(ScrollTrigger);
      gsap.ticker.lagSmoothing(0);

      const update = (time: number) => {
        lenisRef.current?.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(update);
      lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update);

      removeGsapTicker = () => gsap.ticker.remove(update);
    });

    return () => {
      canceled = true;
      cancelAnimationFrame(rafId);
      removeGsapTicker?.();
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.08, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
