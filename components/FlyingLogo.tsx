"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

export const LogoMark = ({ size, svgRef, style }: { size: number; svgRef?: React.RefObject<SVGSVGElement | null>; style?: React.CSSProperties }) => (
  <svg
    ref={svgRef}
    viewBox="0 0 237.33 201.29"
    width={size}
    height={size * (201.29 / 237.33)}
    fill="var(--pink)"
    aria-label="IntelliAgTech logo"
    style={{ display: "block", filter: "drop-shadow(0 0 8px rgba(255,31,142,0.55))", ...style }}
  >
    <g transform="translate(239.05078,59.818358)">
      <path d="m -239.05078,-59.818359 v 41.322265 41.322266 l 58.99414,59.005859 c 0,0 39.04288,39.627959 58.99414,59.005859 0.21891,0.21262 0.66602,0.62891 0.66602,0.62891 0,0 0.44854,-0.41614 0.66796,-0.62891 19.966757,-19.36127 59.003911,-58.99414 59.003911,-58.99414 L -1.71875,22.849609 V -18.484375 -59.818359 L -61.050781,-0.49609375 -120.38477,58.826172 -179.71875,-0.49609375 Z m 226.679686,26.599609 c -0.0033,0.41138 -0.008,1.062064 -0.01367,2.056641 -0.02515,4.401472 0,24.3417965 0,24.3417965 V 17.521484 l -37.009765,36.992188 -37.007813,36.990234 -0.683593,0.675781 -0.685547,-0.675781 -12.296878,-12.349609 -12.29883,-12.347656 48.998051,-48.984375 c 0,0 32.781798,-32.540609 48.998047,-48.984375 0.640118,-0.649098 1.874621,-1.926799 2,-2.056641 z m -216.013676,0.06055 50.08204,50.082031 50.08203,50.083984 -12.16016,11.914063 c -4.48173,4.03845 -8.25879,7.503285 -14.01758,12.587891 L -191.39258,54.498047 -228.38477,17.486328 V -7.8359375 Z m 108,108.048828 12.66797,12.615234 12.666019,12.613278 -12.306639,12.35938 c 0,0 -8.2015,8.2438 -12.3086,12.35937 -0.23934,0.23983 -0.71875,0.71875 -0.71875,0.71875 0,0 -0.4792,-0.47866 -0.71875,-0.71875 -4.10647,-4.11577 -12.30859,-12.35937 -12.30859,-12.35937 l -12.30664,-12.35938 12.66602,-12.613278 z" />
    </g>
  </svg>
);

export interface FlyingLogoHandle {
  flyToHeader:  () => void;
  flyToHero:    () => void;
  snapToHeader: () => void;
}

interface FlyingLogoProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

const HERO_SIZE  = 72;
const HEADER_SIZE = 28;
const HERO_TOP_PCT = 0.36;

const FlyingLogo = forwardRef<FlyingLogoHandle, FlyingLogoProps>(
  ({ targetRef }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef       = useRef<SVGSVGElement>(null);
    const isInHeader   = useRef(false);
    // Pre-cached delta so flyToHeader never forces a layout flush during scroll
    const cachedDelta  = useRef<{ dx: number; dy: number } | null>(null);

    // Compute and cache the header-slot offset once on mount and on resize.
    // getBoundingClientRect is called here (outside scroll callbacks) so it
    // never causes a synchronous layout flush during animation.
    useEffect(() => {
      function cache() {
        if (!targetRef.current) return;
        const target = targetRef.current.getBoundingClientRect();
        const heroCX = window.innerWidth  * 0.5;
        const heroCY = window.innerHeight * HERO_TOP_PCT;
        cachedDelta.current = {
          dx: target.left + target.width  / 2 - heroCX,
          dy: target.top  + target.height / 2 - heroCY,
        };
      }
      cache();
      window.addEventListener("resize", cache);
      return () => window.removeEventListener("resize", cache);
    }, [targetRef]);

    useImperativeHandle(ref, () => ({
      flyToHeader() {
        if (isInHeader.current || !containerRef.current || !cachedDelta.current) return;
        isInHeader.current = true;

        // ⚡ Remove the drop-shadow BEFORE the tween starts so the compositor
        // never has to re-rasterize a filtered element on every animation frame.
        if (svgRef.current) svgRef.current.style.filter = "none";

        const { dx, dy } = cachedDelta.current;
        gsap.to(containerRef.current, {
          x: dx, y: dy,
          scale: HEADER_SIZE / HERO_SIZE,
          duration: 0.8,
          ease: "sine.inOut",
          overwrite: true,
        });
      },

      snapToHeader() {
        if (isInHeader.current || !containerRef.current || !cachedDelta.current) return;
        isInHeader.current = true;
        if (svgRef.current) svgRef.current.style.filter = "none";
        const { dx, dy } = cachedDelta.current;
        gsap.set(containerRef.current, { x: dx, y: dy, scale: HEADER_SIZE / HERO_SIZE });
      },

      flyToHero() {
        if (!isInHeader.current || !containerRef.current) return;
        isInHeader.current = false;

        // ⚡ Animate WITHOUT the filter; restore it only after landing so the
        // return flight is also free of per-frame filter rasterization.
        gsap.to(containerRef.current, {
          x: 0, y: 0, scale: 1,
          duration: 0.8,
          ease: "sine.inOut",
          overwrite: true,
          onComplete: () => {
            if (svgRef.current) {
              svgRef.current.style.filter = "drop-shadow(0 0 8px rgba(255,31,142,0.55))";
            }
          },
        });
      },
    }));

    const logoH = HERO_SIZE * (201.29 / 237.33);

    return (
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          width:  `${HERO_SIZE}px`,
          height: `${logoH}px`,
          left: `calc(50% - ${HERO_SIZE / 2}px)`,
          top:  `calc(36% - ${logoH   / 2}px)`,
          zIndex: 101,
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
          overflow: "visible",
        }}
      >
        <LogoMark size={HERO_SIZE} svgRef={svgRef} style={{ pointerEvents: "none" }} />
      </div>
    );
  }
);

FlyingLogo.displayName = "FlyingLogo";
export default FlyingLogo;
