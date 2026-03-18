"use client";

import { useRef, useState, useCallback, useEffect, startTransition } from "react";
import gsap from "gsap";
import WorldMap from "./WorldMap";
import HeroOverlay from "./HeroOverlay";
import ServicePanel from "./ServicePanel";
import Header from "./Header";
import FlyingLogo, { type FlyingLogoHandle } from "./FlyingLogo";
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
  targetXFrac = 0.68,
  fillFactor  = 0.85,
): { x: string; y: string; scale: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const elW = vw * 1.2;
  const elH = vh * 1.2;
  const svgToCss = Math.min(elW / VIEWBOX_W, elH / VIEWBOX_H);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const wCss = (maxLng - minLng) * PROJ_SCALE * (Math.PI / 180) * svgToCss;
  const hCss = Math.abs(mercatorSVG(maxLat) - mercatorSVG(minLat)) * svgToCss;
  const availW = vw * 0.50 * fillFactor;
  const availH = vh * 0.85 * fillFactor;
  const scale  = Math.min(availW / wCss, availH / hCss, 4.0);
  const dxCss = (centerLng - PROJ_LNG) * PROJ_SCALE * (Math.PI / 180) * svgToCss;
  const dyCss = (mercatorSVG(centerLat) - ORIGIN_Y_SVG) * svgToCss;
  const originX = vw * 0.5;
  const originY = vh * 0.5;
  const regionX = originX + dxCss;
  const regionY = originY + dyCss;
  const txPx = vw * targetXFrac - originX - (regionX - originX) * scale;
  const tyPx = vh * 0.5         - originY - (regionY - originY) * scale;
  return {
    x: `${((txPx / elW) * 100).toFixed(2)}%`,
    y: `${((tyPx / elH) * 100).toFixed(2)}%`,
    scale,
  };
}

// ── Timing constants ──────────────────────────────────────────────────────────
const FADE_OUT_DUR  = 0.22;  // how long old content takes to disappear
const MAP_DUR       = 0.65;  // map pan/zoom duration
const FADE_IN_DUR   = 0.30;  // how long new content takes to appear
const FADE_IN_DELAY = 0.52;  // start fading in just before map settles

export default function ServicesScroll() {
  const mapWrapRef      = useRef<HTMLDivElement>(null);
  const mapTargetRef    = useRef<{ x: string; y: string; scale: number }>({ x: "0%", y: "0%", scale: 1 });
  const heroWrapRef   = useRef<HTMLDivElement>(null);   // wrapper controlling hero opacity
  const panelsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const flyingLogoRef = useRef<FlyingLogoHandle>(null);
  const logoSlotRef   = useRef<HTMLDivElement>(null);

  // Current section index: -1 = hero, 0–N = service sections
  const currentIndexRef = useRef(-1);
  const isAnimating     = useRef(false);
  const heroVisibleRef  = useRef(true);

  const [activeService, setActiveService]   = useState<ServiceId | null>(null);
  const [hoveredService, setHoveredService] = useState<ServiceId | null>(null);
  const [hoveredBullet, setHoveredBullet]   = useState<number | null>(null);
  const [heroVisible, setHeroVisible]       = useState(true);
  const [pinsVisible, setPinsVisible]       = useState(false);
  const [mapScale, setMapScale]             = useState(1);

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
        duration: MAP_DUR, ease: "power2.inOut",
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

      const isGoingToHero  = clamped === -1;
      const isLeavingHero  = prevIndex === -1;

      const fadeOutEl = prevIndex === -1
        ? heroWrapRef.current
        : panelsRef.current[prevIndex];
      const fadeInEl = clamped === -1
        ? heroWrapRef.current
        : panelsRef.current[clamped];

      // Block interactions on the outgoing panel immediately
      if (fadeOutEl) fadeOutEl.style.pointerEvents = "none";

      // ── Hero visibility bookkeeping ───────────────────────────────────────
      setPinsVisible(false);            // hide overlay immediately before transition
      setHoveredBullet(null);           // clear bullet highlight on every transition

      if (isLeavingHero) {
        heroVisibleRef.current = false;
        setHeroVisible(false);
        setHoveredService(null);
        flyingLogoRef.current?.flyToHeader();
      } else if (isGoingToHero) {
        heroVisibleRef.current = true;
        setHeroVisible(true);
        flyingLogoRef.current?.flyToHero();
      }

      // ── Fade out current ──────────────────────────────────────────────────
      gsap.to(fadeOutEl, { opacity: 0, duration: FADE_OUT_DUR, ease: "power2.in" });

      // ── Pan / zoom map; update activeService when settled ─────────────────
      const mapKey = clamped === -1 ? "hero" : services[clamped].id;

      // Store target transform so the overlay can compute fixed screen positions
      mapTargetRef.current = mapKey === "hero"
        ? { x: "0%", y: "0%", scale: 1.0 }
        : getRegionTransform(REGION_BBOX[mapKey as ServiceId]);

      animateMapTo(mapKey, () => {
        setMapScale(mapTargetRef.current.scale);
        startTransition(() => {
          setActiveService(clamped === -1 ? null : services[clamped].id);
          setPinsVisible(clamped !== -1);   // show overlay after map settles
        });
      });

      // ── Fade in next (starts just before map finishes) ────────────────────
      gsap.to(fadeInEl, {
        opacity: 1,
        duration: FADE_IN_DUR,
        ease: "power2.out",
        delay: FADE_IN_DELAY,
        onStart: () => {
          // Hero wrapper stays pointer-events:none so map hovers pass through.
          // HeroOverlay children receive events via their own pointer-events:auto.
          if (isGoingToHero && fadeInEl) fadeInEl.style.pointerEvents = "none";
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    },
    [animateMapTo]
  );

  // ── Wheel → discrete step ─────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      goToSection(currentIndexRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
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
      <Header logoSlotRef={logoSlotRef} />
      <FlyingLogo ref={flyingLogoRef} targetRef={logoSlotRef} />

      {/* Single fixed-height viewport — no scroll container */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

        {/* ── Background map ─────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, background: "var(--dark)", zIndex: 0 }}>
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

          {/* Left gradient mask — appears when leaving hero */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: heroVisible
              ? "transparent"
              : "linear-gradient(to right, rgba(17,17,19,1) 0%, rgba(17,17,19,0.97) 36%, rgba(17,17,19,0.55) 50%, transparent 100%)",
            transition: "background 0.6s ease",
          }} />
        </div>

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
              const elW     = vw * 1.2;
              const elH     = vh * 1.2;
              const ppu     = Math.min(elW / VIEWBOX_W, elH / VIEWBOX_H) * mapTargetRef.current.scale;
              const endX    = anchor.x + dir.cx * ppu;
              const endY    = anchor.y + dir.cy * ppu;
              const goRight = dir.cx > 0;
              const BOX_W   = 248;
              // Minimum left edge — keep boxes out of the service-panel zone (~left 52% of vw)
              const MIN_LEFT = vw * 0.52;
              const Icon    = pin.icon;
              const isHov   = hoveredBullet === i;
              return (
                <div
                  key={`overlay-${activeService}-${i}`}
                  onMouseEnter={() => setHoveredBullet(i)}
                  onMouseLeave={() => setHoveredBullet(null)}
                  style={{
                    position: "absolute",
                    left:    Math.max(goRight ? endX + 4 : endX - 4 - BOX_W, MIN_LEFT),
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

        {/* ── Service panels (start hidden) ──────────────────────────────── */}
        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => { panelsRef.current[i] = el; }}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              opacity: 0, pointerEvents: "none",
              display: "flex", alignItems: "center",
            }}
          >
            <ServicePanel service={service} isActive={activeService === service.id} index={i} activeBullet={hoveredBullet} onBulletHover={setHoveredBullet} />
          </div>
        ))}

      </div>
    </>
  );
}
