"use client";

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldMap from "./WorldMap";

gsap.registerPlugin(ScrollTrigger);
import HeroOverlay from "./HeroOverlay";
import ServicePanel, { type ServicePanelHandle } from "./ServicePanel";
import Header from "./Header";
import { services, type ServiceId } from "@/lib/services";
import { SUBREGION_PINS, PIN_DIRS } from "@/lib/mapPins";

// ── Projection constants — must match WorldMap.tsx projectionConfig ──────────
const PROJ_LNG   = 22;
const PROJ_LAT   = 38;
const PROJ_SCALE = 780;
const VIEWBOX_W  = 800;
const VIEWBOX_H  = 600;

function mercatorSVG(latDeg: number): number {
  return -PROJ_SCALE * Math.log(Math.tan(Math.PI / 4 + (latDeg * Math.PI) / 360));
}
const ORIGIN_Y_SVG = mercatorSVG(PROJ_LAT);

// Convert [lng, lat] + stored GSAP target transform → viewport pixel position.
// Formula derivation: SVG center [400,300] always maps to viewport center [0.5vw, 0.5vh];
// any delta from center scales by svgToCss * gsapScale, then the GSAP translate is added.
function lngLatToViewport(
  lng: number, lat: number,
  target: { x: string; y: string; scale: number },
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const elW = vw * 1.2;
  const elH = vh * 1.2;
  const svgToCss = Math.min(elW / VIEWBOX_W, elH / VIEWBOX_H);
  const s   = target.scale;
  const txPx = parseFloat(target.x) / 100 * elW;
  const tyPx = parseFloat(target.y) / 100 * elH;
  const svgDX = (lng - PROJ_LNG) * PROJ_SCALE * (Math.PI / 180);
  const svgDY = mercatorSVG(lat) - ORIGIN_Y_SVG;
  return {
    x: 0.5 * vw + svgDX * svgToCss * s + txPx,
    y: 0.5 * vh + svgDY * svgToCss * s + tyPx,
  };
}

const REGION_BBOX: Record<ServiceId, [[number, number], [number, number]]> = {
  "market-entry":      [[-125, 24], [-65,  50]],
  "commercial-rep":    [[-10,  36], [20,   55]],
  "operational-setup": [[25,   15], [62,   43]],
  "regulatory":        [[-9,   49], [3,    61]],
  "local-ops":         [[13,   40], [30,   47]],
  "business-dev":      [[32,   27], [40,   37]],
};

function getRegionTransform(
  bounds: [[number, number], [number, number]],
  defaultTargetXFrac = 0.68,
  fillFactor  = 0.85,
): { x: string; y: string; scale: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 768; // Tailwind md breakpoint

  const targetXFrac = isMobile ? 0.5 : defaultTargetXFrac;
  const targetYFrac = isMobile ? 0.25 : 0.5; // Top 25% on mobile, center on desktop
  const availW = isMobile ? (vw * 0.90 * fillFactor) : (vw * 0.50 * fillFactor);
  const availH = isMobile ? (vh * 0.45 * fillFactor) : (vh * 0.85 * fillFactor);

  const elW = vw * 1.2;
  const elH = vh * 1.2;
  const svgToCss = Math.min(elW / VIEWBOX_W, elH / VIEWBOX_H);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const wCss = (maxLng - minLng) * PROJ_SCALE * (Math.PI / 180) * svgToCss;
  const hCss = Math.abs(mercatorSVG(maxLat) - mercatorSVG(minLat)) * svgToCss;
  const scale  = Math.min(availW / wCss, availH / hCss, 4.0);
  const dxCss = (centerLng - PROJ_LNG) * PROJ_SCALE * (Math.PI / 180) * svgToCss;
  const dyCss = (mercatorSVG(centerLat) - ORIGIN_Y_SVG) * svgToCss;
  const originX = vw * 0.5;
  const originY = vh * 0.5;
  const regionX = originX + dxCss;
  const regionY = originY + dyCss;
  const txPx = vw * targetXFrac - originX - (regionX - originX) * scale;
  const tyPx = vh * targetYFrac - originY - (regionY - originY) * scale;
  return {
    x: `${((txPx / elW) * 100).toFixed(2)}%`,
    y: `${((tyPx / elH) * 100).toFixed(2)}%`,
    scale,
  };
}

// ── Timing constants ──────────────────────────────────────────────────────────
const FADE_OUT_DUR  = 0.22;  // hero fade-out
const MAP_DUR       = 0.90;  // map pan/zoom duration
const FADE_IN_DUR   = 0.32;  // hero fade-in
const FADE_IN_DELAY = 0.80;  // hero fade-in delay (= MAP_DUR - 0.10)

export default function ServicesScroll({ initialService }: { initialService?: string }) {
  // ── Compute initial service state (client-only component — window is safe) ─
  const initialIdx = initialService
    ? services.findIndex(s => s.id === initialService)
    : -1;
  const isRestoring = initialIdx >= 0;
  const initialPos  = isRestoring
    ? getRegionTransform(REGION_BBOX[services[initialIdx].id as ServiceId])
    : null;


  const containerRef    = useRef<HTMLDivElement>(null);
  const parallaxMapRef  = useRef<HTMLDivElement>(null);
  const parallaxContentRef = useRef<HTMLDivElement>(null);
  const mapWrapRef      = useRef<HTMLDivElement>(null);
  const mapTargetRef    = useRef(initialPos ?? { x: "0%", y: "0%", scale: 1 });
  const heroWrapRef     = useRef<HTMLDivElement>(null);
  const panelsRef       = useRef<(HTMLDivElement | null)[]>([]);
  const panelApiRefs    = useRef<(ServicePanelHandle | null)[]>([]);

  // Current section index: -1 = hero, 0–N = service sections
  const currentIndexRef = useRef(isRestoring ? initialIdx : -1);
  const isAnimating     = useRef(false);
  const heroVisibleRef  = useRef(!isRestoring);

  const [activeService, setActiveService]   = useState<ServiceId | null>(
    isRestoring ? services[initialIdx].id as ServiceId : null
  );
  const [hoveredService, setHoveredService] = useState<ServiceId | null>(null);
  const [hoveredBullet, setHoveredBullet]   = useState<number | null>(null);
  const [heroVisible, setHeroVisible]       = useState(!isRestoring);
  const [pinsVisible, setPinsVisible]       = useState(isRestoring);
  const [mapScale, setMapScale]             = useState(initialPos?.scale ?? 1);

  // ── Map animation ─────────────────────────────────────────────────────────
  const animateMapTo = useCallback(
    (key: "hero" | ServiceId, onComplete?: () => void) => {
      const el = mapWrapRef.current;
      if (!el) return;
      const pos = key === "hero"
        ? { x: "0%", y: "0%", scale: 1.0 }
        : getRegionTransform(REGION_BBOX[key]);

      el.style.pointerEvents = "none";
      el.classList.add("map-animating");
      gsap.to(el, {
        x: pos.x, y: pos.y, scale: pos.scale,
        duration: MAP_DUR, ease: "sine.inOut",
        force3D: true, overwrite: true,
        onComplete: () => {
          el.classList.remove("map-animating");
          el.style.pointerEvents = "";
          onComplete?.();
        },
      });
    },
    []
  );

  // ── Discrete section navigation ───────────────────────────────────────────
  const goToSection = useCallback(
    (nextIndex: number) => {
      if (isAnimating.current) return;
      const clamped = Math.max(-1, Math.min(services.length - 1, nextIndex));
      if (clamped === currentIndexRef.current) return;

      isAnimating.current = true;

      const prevIndex = currentIndexRef.current;
      currentIndexRef.current = clamped;

      const isGoingToHero = clamped === -1;
      const isLeavingHero = prevIndex === -1;

      // ── Hero visibility bookkeeping ───────────────────────────────────────
      setPinsVisible(false);
      setHoveredBullet(null);

      if (isLeavingHero) {
        heroVisibleRef.current = false;
        setHeroVisible(false);
        setHoveredService(null);
        // flyToHeader is called after flushSync below so GSAP starts on a clean
        // frame — prevents the frame-drop velocity spike caused by flushSync
        // blocking the main thread before the first animation frame is painted.
      } else if (isGoingToHero) {
        heroVisibleRef.current = true;
        setHeroVisible(true);
        // flyToHero likewise deferred to after flushSync below.
      }

      // ── Outgoing ─────────────────────────────────────────────────────────
      if (isLeavingHero) {
        gsap.to(heroWrapRef.current, { opacity: 0, duration: FADE_OUT_DUR, ease: "power2.in" });
      } else {
        // Raise incoming above outgoing so its counter rolls in on top of the old one
        const incomingEl = panelsRef.current[clamped];
        if (incomingEl) incomingEl.style.zIndex = "12";

        panelApiRefs.current[prevIndex]?.exit();
        const outEl = panelsRef.current[prevIndex];
        if (outEl) {
          outEl.style.pointerEvents = "none";
          // Hide after incoming counter has fully rolled in.
          // Do NOT reset incomingEl.style.zIndex here — React already restores it
          // to "10" via the JSX style prop in the setActiveService re-render that
          // fires at MAP_DUR. Resetting to "" after that re-render strips the
          // z-index, causing the panel to drop below parallaxContentRef (z=5)
          // and making pointer events stop working.
          setTimeout(() => {
            outEl.style.opacity = "0";
          }, Math.round((MAP_DUR + 0.22) * 1000));
        }
      }

      // ── Pan / zoom map ────────────────────────────────────────────────────
      const mapKey = clamped === -1 ? "hero" : services[clamped].id;

      // ── Pre-flight: commit SVG changes synchronously before animation ─────
      // The GPU compositing layer is created when GSAP starts. If React renders
      // happen after that point they repaint inside the layer and cause stutter.
      // flushSync fires here while the hero/service overlay still covers the map,
      // so the browser can build the layer with already-stable SVG content.
      if (isLeavingHero && clamped >= 0) {
        // Set transform NOW — safe because the hero overlay is still covering the map.
        // For service→service we defer this to onComplete so old pins don't flash
        // at wrong positions while fading out.
        mapTargetRef.current = getRegionTransform(REGION_BBOX[mapKey as ServiceId]);
        // Hero is opaque → safe to update stroke widths + add subregion pins now.
        flushSync(() => {
          setMapScale(mapTargetRef.current.scale);
          setActiveService(services[clamped].id);
        });
      } else if (isGoingToHero) {
        gsap.set(heroWrapRef.current, { visibility: "visible" });
        // Remove subregion pins while the panel is still exiting (not visible).
        flushSync(() => setActiveService(null));
      }

      // ── Panel entry — starts 0.10 s before map settles ───────────────────
      if (clamped >= 0) {
        gsap.delayedCall(MAP_DUR - 0.10, () => {
          const inEl = panelsRef.current[clamped];
          if (inEl) inEl.style.opacity = "1";
          panelApiRefs.current[clamped]?.enter(isLeavingHero);
        });
      }

      animateMapTo(mapKey, () => {
        if (isGoingToHero) {
          mapTargetRef.current = { x: "0%", y: "0%", scale: 1.0 };
          // mapScale(1) is deferred until the hero overlay has fully faded in so
          // the stroke-width repaint is hidden rather than visible on the map.
          const hideDelay = Math.round((FADE_IN_DELAY + FADE_IN_DUR - MAP_DUR) * 1000);
          setTimeout(() => setMapScale(1), hideDelay);
        } else if (!isLeavingHero) {
          // Service → service: set transform only NOW so the outgoing pins used
          // the correct (old) transform during their fade-out — prevents the flash
          // where old pins jump to wrong positions while still visible.
          mapTargetRef.current = getRegionTransform(REGION_BBOX[mapKey as ServiceId]);
          setMapScale(mapTargetRef.current.scale);
          setActiveService(services[clamped].id);
          setPinsVisible(true);
        } else {
          // Hero → service: mapScale + activeService already committed via flushSync.
          // Only the HTML overlay still needs to be revealed.
          setPinsVisible(true);
        }
      });

      // ── Incoming hero fades in on its own timing ──────────────────────────
      if (isGoingToHero) {
        gsap.to(heroWrapRef.current, {
          opacity: 1,
          duration: FADE_IN_DUR,
          ease: "power2.out",
          delay: FADE_IN_DELAY,
          onStart: () => { if (heroWrapRef.current) heroWrapRef.current.style.pointerEvents = "none"; },
          onComplete: () => { isAnimating.current = false; },
        });
      } else {
        setTimeout(() => { isAnimating.current = false; }, Math.round((MAP_DUR + 0.40) * 1000));
      }
    },
    [animateMapTo]
  );

  // ── Set initial GSAP state before first paint ────────────────────────────
  // useLayoutEffect fires synchronously after commit and before the browser
  // paints, so GSAP.set calls here are invisible to the user.
  useLayoutEffect(() => {
    if (!isRestoring || !initialPos) return;
    gsap.set(heroWrapRef.current, { opacity: 0, visibility: "hidden" });
    gsap.set(mapWrapRef.current,  { x: initialPos.x, y: initialPos.y, scale: initialPos.scale });
    const panelEl = panelsRef.current[initialIdx];
    if (panelEl) panelEl.style.opacity = "1";
    // Reveal the container — it starts hidden so nothing flashes before GSAP
    // sets the correct positions above. React won't override this because the
    // vDOM still says "hidden" and React only diffs vDOM→vDOM, not vDOM→DOM.
    if (containerRef.current) containerRef.current.style.visibility = "visible";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animate panel content in after refs are ready ────────────────────────
  useEffect(() => {
    if (!isRestoring) return;
    panelApiRefs.current[initialIdx]?.enter(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Parallax exit effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !parallaxMapRef.current || !parallaxContentRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top", 
        scrub: true,
        animation: gsap.timeline()
          .to(parallaxMapRef.current, { y: "25vh", ease: "none" }, 0)
          .to(parallaxContentRef.current, { y: "12vh", ease: "none" }, 0)
      });
    });
    return () => ctx.revert();
  }, []);

  // ── Wheel → discrete step ─────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Only engage when this section is pinned at the top of the viewport
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || Math.abs(rect.top) > 5) return;

      // Unconditionally trap the scrollwheel to prevent accidental unpinning during transition
      if (isAnimating.current) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      const scrollingDown = e.deltaY > 0;
      // Release native scroll into the rest of the page only AFTER the final section evaluates and animation is finished:
      const atBottom = currentIndexRef.current === services.length - 1 && scrollingDown;
      const atTop    = currentIndexRef.current === -1 && !scrollingDown;

      if (atBottom || atTop) return;

      e.stopPropagation();
      e.preventDefault();
      goToSection(currentIndexRef.current + (scrollingDown ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [goToSection]);

  // ── Touch → discrete step (mobile swipe) ────────────────────────────────
  // Exact mirror of the wheel handler: at boundary (atBottom / atTop) we
  // simply return without calling e.preventDefault(), which releases native
  // scroll so the distillation section's ScrollTrigger animations fire
  // naturally — identical to how desktop wheel-scroll works.
  useEffect(() => {
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || Math.abs(rect.top) > 5) return;
      if (isAnimating.current) { e.preventDefault(); return; }
      const currentY   = e.touches[0].clientY;
      const swipingDown = (touchStartY - currentY) > 0;
      const atBottom = currentIndexRef.current === services.length - 1 && swipingDown;
      const atTop    = currentIndexRef.current === -1 && !swipingDown;
      if (atBottom || atTop) return; // release to native scroll
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || Math.abs(rect.top) > 5) return;
      if (isAnimating.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;
      const swipingDown = deltaY > 0;
      const atBottom = currentIndexRef.current === services.length - 1 && swipingDown;
      const atTop    = currentIndexRef.current === -1 && !swipingDown;
      if (atBottom || atTop) return;
      goToSection(currentIndexRef.current + (swipingDown ? 1 : -1));
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { capture: true, passive: false });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove,  { capture: true });
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [goToSection]);

  // ── Region hover / click (hero mode only) ────────────────────────────────
  const handleRegionHover = useCallback((id: ServiceId | null) => {
    if (id !== null && !heroVisibleRef.current) return;
    setHoveredService(id);
  }, []);

  const handleRegionClick = useCallback((id: ServiceId) => {
    if (!heroVisibleRef.current) return;
    const idx = services.findIndex((s) => s.id === id);
    if (idx !== -1) goToSection(idx);
  }, [goToSection]);

  return (
    <>
      <Header />

      {/* Single fixed-height viewport — no scroll container */}
      <div ref={containerRef} style={{ position: "relative", height: "100dvh", overflow: "hidden", background: "var(--dark)", visibility: isRestoring ? "hidden" : "visible" }}>

        {/* ── Background map ─────────────────────────────────────────────── */}
        <div ref={parallaxMapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div
            ref={mapWrapRef}
            style={{ position: "absolute", inset: "-10%", transformOrigin: "center center", willChange: "transform", backfaceVisibility: "hidden" }}
          >
            <WorldMap
              activeService={activeService}
              hoveredService={hoveredService}
              hoveredBullet={hoveredBullet}
              mapScale={mapScale}
              heroVisible={heroVisible}
              onRegionHover={handleRegionHover}
              onRegionClick={handleRegionClick}
            />
          </div>

          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 35%, rgba(17,17,19,0.65) 100%)",
          }} />

          {/* Adaptive Gradient mask — opacity-transitioned so the browser composites it on GPU */}
          <style dangerouslySetInnerHTML={{__html: `
            .service-gradient-backdrop { background: linear-gradient(to top, rgba(17,17,19,1) 0%, rgba(17,17,19,0.98) 45%, rgba(17,17,19,0.55) 60%, transparent 85%); }
            @media (min-width: 768px) {
              .service-gradient-backdrop { background: linear-gradient(to right, rgba(17,17,19,1) 0%, rgba(17,17,19,0.97) 36%, rgba(17,17,19,0.55) 50%, transparent 100%); }
            }
          `}} />
          <div className="service-gradient-backdrop" style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            opacity: heroVisible ? 0 : 1,
            transition: "opacity 0.6s ease",
          }} />
        </div>

        {/* ── Content Parallax Layer ────────────────────────────────────── */}
        <div ref={parallaxContentRef} style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>

        {/* ── Subregion info overlay — HTML, fixed-size, outside map transform */}
        {activeService && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 5,
            opacity: pinsVisible ? 1 : 0,
            pointerEvents: pinsVisible ? "auto" : "none",
            transition: "opacity 0.18s ease",
          }}>
            {(SUBREGION_PINS[activeService] ?? []).map((pin, i) => {
              const anchor  = lngLatToViewport(pin.coordinates[0], pin.coordinates[1], mapTargetRef.current);
              const dir     = PIN_DIRS[i];
              const vw      = window.innerWidth;
              const vh      = window.innerHeight;
              const isMobile = vw < 768;

              // Hide pins entirely on mobile to reduce clutter
              if (isMobile) return null;

              const elW     = vw * 1.2;
              const elH     = vh * 1.2;
              const ppu     = Math.min(elW / VIEWBOX_W, elH / VIEWBOX_H) * mapTargetRef.current.scale;
              const endX    = anchor.x + dir.cx * ppu;
              const endY    = anchor.y + dir.cy * ppu;
              const goRight = dir.cx > 0;
              const BOX_W   = 248;
              
              // Desktop: push right of left-panel.
              const MIN_LEFT   = vw * 0.52;
              const MAX_RIGHT  = vw - BOX_W - 16;
              const rawLeft    = goRight ? endX + 4 : endX - 4 - BOX_W;
              const clampedLeft = Math.max(MIN_LEFT, Math.min(rawLeft, MAX_RIGHT));

              const Icon    = pin.icon;
              const isHov   = hoveredBullet === i;
              return (
                <div
                  key={`overlay-${activeService}-${i}`}
                  onMouseEnter={() => setHoveredBullet(i)}
                  onMouseLeave={() => setHoveredBullet(null)}
                  style={{
                    position: "absolute",
                    left:    clampedLeft,
                    top:     endY - 28,
                    width:   BOX_W,
                    cursor:  "default",
                    background: isHov ? "rgba(26,10,18,0.97)" : "rgba(17,17,19,0.93)",
                    border: `1px solid ${isHov ? "rgba(255,31,142,0.7)" : "rgba(255,31,142,0.28)"}`,
                    borderRadius: 6,
                    padding: "12px 15px",
                    boxShadow: isHov ? "0 0 18px rgba(255,31,142,0.18)" : "none",
                    animation: "pinFadeIn 0.25s ease forwards",
                    animationDelay: `${i * 0.06}s`,
                    opacity: 0,
                    transition: "border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Icon size={14} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{
                      color: isHov ? "white" : "rgba(255,255,255,0.88)",
                      fontSize: 13.5,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}>
                      {pin.label}
                    </span>
                  </div>
                  <p style={{
                    color: isHov ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.48)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    margin: 0,
                    fontWeight: 300,
                  }}>
                    {pin.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Hero overlay (starts visible) ──────────────────────────────── */}
        <div
          ref={heroWrapRef}
          style={{ position: "absolute", inset: 0, zIndex: 10, opacity: 1, pointerEvents: "none" }}
        >
          <HeroOverlay onScrollToServices={() => goToSection(0)} />
        </div>

        </div>

        {/* ── Service panels — outside parallaxContentRef so no pointer-events:none ancestor ── */}
        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => {
              panelsRef.current[i] = el;
              // Set opacity imperatively on mount so React doesn't reset it on re-renders
              if (el && el.style.opacity === "") el.style.opacity = "0";
            }}
            className="absolute inset-0 z-10 flex flex-col justify-end md:justify-start md:flex-row md:items-center pb-8 md:pb-0"
            style={{
              pointerEvents: activeService === service.id ? "auto" : "none",
            }}
          >
            <ServicePanel
              ref={(el) => { panelApiRefs.current[i] = el; }}
              service={service}
              isActive={activeService === service.id}
              index={i}
              activeBullet={hoveredBullet}
              onBulletHover={setHoveredBullet}
            />
          </div>
        ))}

      </div>
    </>
  );
}
