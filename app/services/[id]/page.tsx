"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import Header from "@/components/Header";
import { services, type ServiceId } from "@/lib/services";
import { SERVICE_DETAILS } from "@/lib/serviceDetails";
import { BULLET_ICONS } from "@/lib/mapPins";

const serviceNumbers = ["01", "02", "03", "04", "05", "06"];

export default function ServiceDetailPage() {
  const { id }      = useParams<{ id: string }>();
  const router      = useRouter();
  const searchParams = useSearchParams();

  const service  = services.find(s => s.id === id);
  const details  = service ? SERVICE_DETAILS[id as ServiceId] : null;
  const svcIndex = services.findIndex(s => s.id === id);

  const [active, setActive] = useState(() => {
    const n = parseInt(searchParams.get("item") ?? "0", 10);
    const len = details?.length ?? 0;
    return isNaN(n) || n < 0 || n >= len ? 0 : n;
  });

  // ── Refs ──────────────────────────────────────────────────────────────────
  const rightColRef    = useRef<HTMLDivElement>(null);
  const iconRef        = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLHeadingElement>(null);
  const descRef        = useRef<HTMLParagraphElement>(null);
  const stepsRef       = useRef<(HTMLDivElement | null)[]>([]);
  const metricsRef     = useRef<(HTMLSpanElement | null)[]>([]);
  const isChangingRef  = useRef(false);

  if (!service || !details) return null;

  const icons   = BULLET_ICONS[id] ?? [];
  const detail  = details[active];

  // ── Animate metric counters ───────────────────────────────────────────────
  const runCounters = useCallback((metrics: typeof detail.metrics) => {
    metrics.forEach((m, i) => {
      const el = metricsRef.current[i];
      if (!el) return;
      const obj = { val: 0 };
      gsap.killTweensOf(obj);
      gsap.to(obj, {
        val: m.value,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.5 + i * 0.1,
        onUpdate: () => { el.textContent = m.prefix + Math.round(obj.val) + m.suffix; },
      });
    });
  }, []);

  // ── Unmount cleanup — kills GSAP tweens before React's commit phase ────────
  // useLayoutEffect cleanup fires synchronously before DOM mutations in
  // concurrent mode, ensuring no active tweens or GPU compositing layers
  // (from GSAP transforms) are present when React calls removeChild during
  // navigation. useEffect cleanup fires too late (after the commit) in
  // concurrent startTransition navigations.
  useLayoutEffect(() => {
    return () => {
      const nodes = [
        iconRef.current,
        titleRef.current,
        descRef.current,
        ...stepsRef.current,
      ].filter(Boolean) as HTMLElement[];
      if (nodes.length) {
        gsap.killTweensOf(nodes);
        gsap.set(nodes, { clearProps: "all" });
      }
    };
  }, []);

  // ── Hide elements synchronously before every paint where active changes ───
  // useLayoutEffect fires before the browser paints, so setting opacity:0 here
  // prevents any flash of content (SSR HTML visible before JS runs, or new DOM
  // nodes briefly visible after key={active} replacement before useEffect fires).
  // This also fixes the React Strict Mode double-invocation bug: Strict Mode
  // runs effects twice — the first useEffect run sets pendingEnterRef=false,
  // causing the second run to bail, leaving elements permanently hidden.
  // By using useLayoutEffect to hide elements unconditionally and useEffect to
  // always animate in, we avoid the pendingEnterRef sentinel entirely.
  useLayoutEffect(() => {
    const targets = [iconRef.current, titleRef.current, descRef.current, ...stepsRef.current]
      .filter(Boolean) as HTMLElement[];
    if (targets.length) {
      gsap.killTweensOf(targets);
      gsap.set(targets, { opacity: 0 });
    }
  }, [active]);



  // ── Enter animation ────────────────────────────────────────────────────────
  useEffect(() => {
    details[active].metrics.forEach((m, i) => {
      const el = metricsRef.current[i];
      if (el) el.textContent = m.prefix + "0" + m.suffix;
    });

    const targets = [iconRef.current, titleRef.current, descRef.current, ...stepsRef.current].filter(Boolean) as HTMLElement[];
    gsap.fromTo(targets,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: "power2.out",
        clearProps: "transform",
        onComplete: () => { isChangingRef.current = false; },
      },
    );
    runCounters(details[active].metrics);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ── Deliverable change animation ─────────────────────────────────────────
  const handleSelect = (idx: number) => {
    if (idx === active || isChangingRef.current) return;
    isChangingRef.current = true;

    const targets = [iconRef.current, titleRef.current, descRef.current, ...stepsRef.current].filter(Boolean) as HTMLElement[];
    gsap.killTweensOf(targets);

    gsap.to(targets, {
      opacity: 0, y: -10, duration: 0.2, ease: "power2.in",
      onComplete: () => { setActive(idx); },
    });
  };

  const bullets = details.map((d, i) => ({ label: d.title.split(":")[0].split("&")[0].trim(), icon: icons[i] }));

  return (
    <>
      <style>{`
        .sd-bullet {
          display: flex; align-items: center; gap: 16px;
          padding: 1rem 1.2rem; border-top: 1px solid rgba(255,31,142,0.18);
          border-bottom: 1px solid rgba(255,31,142,0.18); margin-bottom: -1px;
          cursor: pointer; transition: background 0.18s ease, border-color 0.18s ease;
          user-select: none;
        }
        .sd-bullet:hover   { background: rgba(255,31,142,0.04); }
        .sd-bullet.active  { background: rgba(255,31,142,0.09); border-color: rgba(255,31,142,0.45); }
        .sd-bullet-label   { font-size: 0.97rem; font-weight: 300; line-height: 1.4; transition: color 0.18s ease; }
        .sd-step-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,31,142,0.14);
          border-radius: 7px; padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.55rem;
        }
        .sd-step-card:hover { border-color: rgba(255,31,142,0.32); background: rgba(255,31,142,0.04); }
        .sd-metric-block { display: flex; flex-direction: column; gap: 0.25rem; padding-top: 1rem; border-top: 1px solid rgba(255,31,142,0.2); }
      `}</style>

      <Header rightLabel="Home" rightHref="/" />

      {/* ── Main split ────────────────────────────────────────────────────── */}
      <main style={{ display: "flex", height: "100vh", paddingTop: 64, background: "var(--dark)" }}>

        {/* ── Left column — mirrors ServicePanel ─────────────────────────── */}
        <div style={{
          width: "44%", maxWidth: 600, marginLeft: "6%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingRight: "3%",
        }}>
          {/* Number + Title */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{ color: "var(--pink)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, lineHeight: 1.2 }}>
                {serviceNumbers[svcIndex]}
              </span>
              <div style={{ width: 32, height: 1, background: "rgba(255,31,142,0.35)", marginTop: "0.5rem" }} />
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "white", lineHeight: 1.2, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {service.title}
            </h1>
          </div>

          {/* Description */}
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.925rem", lineHeight: 1.75, fontWeight: 300, margin: "0 0 1.25rem" }}>
            {service.fullDescription}
          </p>

          {/* Clickable deliverable list */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}>
            {bullets.map((b, i) => {
              const Icon = b.icon;
              return (
                <li key={i} className={`sd-bullet${active === i ? " active" : ""}`} onClick={() => handleSelect(i)}>
                  {Icon && (
                    <Icon
                      size={active === i ? 22 : 20}
                      color={active === i ? "var(--pink)" : "rgba(255,31,142,0.55)"}
                      strokeWidth={active === i ? 1.75 : 1.5}
                      style={{ flexShrink: 0, transition: "all 0.18s ease" }}
                    />
                  )}
                  <span className="sd-bullet-label" style={{ color: active === i ? "white" : "rgba(255,255,255,0.65)" }}>
                    {b.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "0.85rem" }}>
            <Link href="/contact"
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", background: "var(--pink)", color: "white", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, borderRadius: 5, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Get in Touch</Link>
            <button
              onClick={() => router.push(`/?service=${id}`)}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", background: "transparent", border: "1px solid rgba(255,31,142,0.45)", color: "rgba(255,255,255,0.8)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 400, borderRadius: 5, cursor: "pointer", transition: "border-color 0.2s, color 0.2s", fontFamily: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.9)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.45)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            >← Back</button>
          </div>
        </div>

        {/* ── Right column — deliverable detail ───────────────────────────── */}
        {/* key={active} forces React to replace this subtree entirely when the
            active deliverable changes, rather than reconciling icon components
            in-place. Reconciling Lucide SVG icons (different component types)
            requires removeChild on elements that may have GSAP transforms,
            which can fail due to GPU compositing layer mismatches. */}
        <div
          key={active}
          ref={rightColRef}
          style={{
            flex: 1,
            borderLeft: "1px solid rgba(255,31,142,0.1)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "4vh 6% 4vh 4.5%",
            overflowY: "auto",
          }}
        >
          {/* Icon + title row */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
            {(() => {
              const Icon = icons[active];
              return Icon ? (
                <div
                  ref={iconRef}
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(255,31,142,0.08)",
                    border: "1px solid rgba(255,31,142,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={30} color="var(--pink)" strokeWidth={1.25} />
                </div>
              ) : (
                <div ref={iconRef} style={{ width: 64, height: 64, flexShrink: 0 }} />
              );
            })()}
            <h2
              ref={titleRef}
              style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)", fontWeight: 300, color: "white", margin: 0, lineHeight: 1.25, minWidth: 0 }}
            >
              {detail.title}
            </h2>
          </div>

          {/* Deliverable description */}
          <p
            ref={descRef}
            style={{ fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", margin: "0 0 2rem" }}
          >
            {detail.description}
          </p>

          {/* ── Process steps ─────────────────────────────────────────────── */}
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
            Process
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
            {detail.process.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={i}
                  ref={el => { stepsRef.current[i] = el; }}
                  className="sd-step-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StepIcon size={16} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,31,142,0.6)", letterSpacing: "0.2em" }}>
                      0{i + 1}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "white", letterSpacing: "0.02em" }}>
                    {step.title}
                  </span>
                  <p style={{ fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.55 }}>
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Metrics ───────────────────────────────────────────────────── */}
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
            Impact
          </span>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${detail.metrics.length}, 1fr)`, gap: "1.25rem" }}>
            {detail.metrics.map((m, i) => (
              <div key={i} className="sd-metric-block">
                <span style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)", fontWeight: 200, color: "white", lineHeight: 1 }}>
                  <span ref={el => { metricsRef.current[i] = el; }}>{m.prefix}0{m.suffix}</span>
                </span>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>
                  {m.label}
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.45 }}>
                  {m.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
