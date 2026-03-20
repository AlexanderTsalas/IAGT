"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      // Feed GSAP's high-performance ticker time into Lenis to synchronize their refresh loops perfectly
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    // Disable GSAP's lag smoothing to keep it rigidly locked to actual elapsed time for scrolling math
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.08, smoothWheel: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
