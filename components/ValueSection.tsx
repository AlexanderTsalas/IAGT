"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── A: The Execution Gap ─────────────────────────────────────────────────────

const TRADITIONAL = [
  "Engage a strategy consultancy",
  "Commission market research",
  "Review the final report",
  "Recruit a country manager",
  "Build the local team from scratch",
  "Navigate legal & compliance alone",
  "Register the local entity",
  "Source local vendors independently",
  "Design operational processes",
];

const IAGT_MODEL = [
  "Market intelligence & opportunity analysis",
  "Go-to-market strategy, deployed",
  "Your commercial team, active from day one",
  "Regulatory & compliance, fully managed",
  "Entity registered, infrastructure live",
  "Vetted vendor network, activated",
  "Full operations, running",
  "Ongoing management, reported to HQ",
  "You focus on growth",
];

// ── B: The Burden Transfer ────────────────────────────────────────────────────

const BURDEN_CARDS = [
  "Entity Setup & Registration",
  "Regulatory Compliance",
  "Government & Authority Liaison",
  "Local Vendor Sourcing",
  "Office & Infrastructure",
  "Market Research & Intelligence",
  "Legal Framework Navigation",
  "Operational Process Design",
  "Commercial Representation",
  "Partner & Channel Development",
  "Ongoing Operations Management",
  "Compliance Monitoring",
];

const METRICS = [
  { value: "12+", label: "operational functions transferred" },
  { value: "1",   label: "point of contact for all of it"   },
  { value: "Day 1", label: "fully operational from"         },
];

// ── C: The Value Axis ─────────────────────────────────────────────────────────

const AXIS_NODES = [
  { label: "Advisory",   sub: "We'll tell you\nwhat to do"    },
  { label: "Consulting", sub: "We'll plan\nhow to do it"      },
  { label: "Execution",  sub: "We do it",   active: true      },
];

const STATEMENTS = [
  { plain: "A report ends.", pink: "An operation begins."              },
  { plain: "One contact.",   pink: "Across every function. Every market." },
  { plain: "First revenue.", pink: "Faster than your first hire."      },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ValueSection() {
  const gapRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const leftItems  = useRef<(HTMLLIElement | null)[]>([]);
  const rightItems = useRef<(HTMLLIElement | null)[]>([]);
  const gapFooter  = useRef<HTMLDivElement>(null);

  const burdenRef   = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const hubRef      = useRef<HTMLDivElement>(null);
  const coreRef     = useRef<HTMLDivElement>(null);
  const metricRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const burdenHead  = useRef<HTMLDivElement>(null);

  const axisRef    = useRef<HTMLDivElement>(null);
  const axisLine   = useRef<HTMLDivElement>(null);
  const axisDots   = useRef<(HTMLDivElement | null)[]>([]);
  const axisLabels = useRef<(HTMLDivElement | null)[]>([]);
  const stmtRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Section A ───────────────────────────────────────────────────────────
      const tl_a = gsap.timeline({
        scrollTrigger: {
          trigger: gapRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl_a
        .from(lineRef.current, {
          scaleY: 0, transformOrigin: "top center",
          duration: 0.7, ease: "power2.inOut",
        })
        .from(
          leftItems.current.filter(Boolean),
          { x: -24, opacity: 0, duration: 0.35, stagger: 0.07, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          rightItems.current.filter(Boolean),
          { x: 24, opacity: 0, duration: 0.35, stagger: 0.07, ease: "power2.out" },
          "<",
        )
        .from(gapFooter.current, { opacity: 0, y: 12, duration: 0.4 }, "-=0.1");

      // ── Section B ───────────────────────────────────────────────────────────
      const tl_b = gsap.timeline({
        scrollTrigger: {
          trigger: burdenRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      // heading + core card + hub appear first
      tl_b
        .from(burdenHead.current, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" })
        .from(hubRef.current, { opacity: 0, scale: 0.6, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2")
        .from(coreRef.current, { opacity: 0, x: 40, duration: 0.45, ease: "power2.out" }, "-=0.3")
        .from(
          cardRefs.current.filter(Boolean),
          { opacity: 0, x: -30, duration: 0.3, stagger: 0.04, ease: "power2.out" },
          "-=0.35",
        );

      // cards fly to hub one by one and vanish
      cardRefs.current.forEach((card, i) => {
        tl_b.to(
          card,
          {
            x: 180, y: 0, opacity: 0, scale: 0.5,
            duration: 0.32, ease: "power2.in",
            onComplete: () => {
              if (card) card.style.visibility = "hidden";
              // flash the hub
              if (hubRef.current) {
                gsap.to(hubRef.current, {
                  boxShadow: "0 0 28px 6px rgba(255,31,142,0.6)",
                  duration: 0.1,
                  yoyo: true, repeat: 1,
                });
              }
            },
          },
          `>+${i === 0 ? 0.15 : 0.08}`,
        );
        // reveal metric after every 4th card
        const mIdx = Math.floor(i / 4);
        if (i === 3 || i === 7 || i === 11) {
          tl_b.from(
            metricRefs.current[mIdx],
            { opacity: 0, y: 10, duration: 0.35, ease: "power2.out" },
            "<+0.1",
          );
        }
      });

      // ── Section C ───────────────────────────────────────────────────────────
      const tl_c = gsap.timeline({
        scrollTrigger: {
          trigger: axisRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl_c
        .from(axisLine.current, {
          scaleX: 0, transformOrigin: "left center",
          duration: 0.8, ease: "power2.inOut",
        })
        .from(
          axisDots.current.filter(Boolean),
          { opacity: 0, scale: 0, duration: 0.3, stagger: 0.15, ease: "back.out(2)" },
          "-=0.3",
        )
        .from(
          axisLabels.current.filter(Boolean),
          { opacity: 0, y: 10, duration: 0.35, stagger: 0.12, ease: "power2.out" },
          "-=0.2",
        )
        .from(
          stmtRefs.current.filter(Boolean),
          { opacity: 0, y: 28, duration: 0.5, stagger: 0.14, ease: "power2.out" },
          "-=0.1",
        );

    });

    return () => ctx.revert();
  }, []);

  return (
    <section style={{ background: "var(--dark)", overflow: "hidden" }}>

      {/* ── A: The Execution Gap ─────────────────────────────────────────── */}
      <div
        ref={gapRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "8vh 0",
        }}
      >
        {/* Section label */}
        <div style={{
          textAlign: "center",
          marginBottom: "3rem",
        }}>
          <span style={{
            fontSize: "0.7rem", letterSpacing: "0.22em",
            color: "var(--pink)", textTransform: "uppercase", fontWeight: 400,
          }}>
            The Distinction
          </span>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3.6rem)", fontWeight: 300,
            color: "white", margin: "0.6rem 0 0", lineHeight: 1.15,
          }}>
            We don&apos;t just advise.{" "}
            <span style={{ color: "var(--pink)" }}>We execute.</span>
          </h2>
        </div>

        {/* Two-column comparison */}
        <div style={{ display: "flex", alignItems: "stretch", position: "relative" }}>

          {/* Left — Traditional */}
          <div style={{ flex: 1, padding: "0 5% 0 8%", display: "flex", flexDirection: "column" }}>
            <span style={{
              fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)", fontWeight: 400, marginBottom: "1.5rem",
              display: "block",
            }}>
              Traditional Path
            </span>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {TRADITIONAL.map((item, i) => (
                <li
                  key={i}
                  ref={el => { leftItems.current[i] = el; }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "0.75rem",
                    padding: "0.65rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.28)", fontSize: "0.95rem",
                    fontWeight: 300, lineHeight: 1.5,
                  }}
                >
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    border: "1px solid rgba(255,255,255,0.18)",
                    display: "inline-block",
                  }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Center divider line */}
          <div style={{ position: "relative", width: 1, flexShrink: 0 }}>
            <div
              ref={lineRef}
              style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: 1,
                background: "linear-gradient(to bottom, transparent 0%, var(--pink) 15%, var(--pink) 85%, transparent 100%)",
                boxShadow: "0 0 12px 1px rgba(255,31,142,0.35)",
              }}
            />
          </div>

          {/* Right — IAGT */}
          <div style={{ flex: 1, padding: "0 8% 0 5%", display: "flex", flexDirection: "column" }}>
            <span style={{
              fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--pink)", fontWeight: 400, marginBottom: "1.5rem",
              display: "block",
            }}>
              IAGT Execution Model
            </span>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {IAGT_MODEL.map((item, i) => (
                <li
                  key={i}
                  ref={el => { rightItems.current[i] = el; }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "0.75rem",
                    padding: "0.65rem 0",
                    borderBottom: "1px solid rgba(255,31,142,0.1)",
                    color: "rgba(255,255,255,0.82)", fontSize: "0.95rem",
                    fontWeight: 300, lineHeight: 1.5,
                  }}
                >
                  {/* Pink tick */}
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="8" cy="8" r="7.5" fill="none" stroke="rgba(255,31,142,0.35)" />
                    <polyline points="4.5,8.5 7,11 11.5,5.5"
                      fill="none" stroke="var(--pink)" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer comparison */}
        <div
          ref={gapFooter}
          style={{
            display: "flex", marginTop: "3rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ flex: 1, padding: "1.5rem 8% 0", textAlign: "right" }}>
            <span style={{
              fontSize: "0.8rem", color: "rgba(255,255,255,0.3)",
              fontWeight: 300, letterSpacing: "0.04em",
            }}>
              12–18 months · Multiple vendors · Your overhead
            </span>
          </div>
          <div style={{ width: 1 }} />
          <div style={{ flex: 1, padding: "1.5rem 0 0 8%" }}>
            <span style={{
              fontSize: "0.8rem", color: "var(--pink)",
              fontWeight: 300, letterSpacing: "0.04em",
            }}>
              One partner · Full execution · From day one
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{
        height: 1, margin: "0 8%",
        background: "linear-gradient(to right, transparent, rgba(255,31,142,0.2), transparent)",
      }} />

      {/* ── B: The Burden Transfer ───────────────────────────────────────── */}
      <div
        ref={burdenRef}
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "8vh 8%", gap: "3rem",
        }}
      >
        {/* Heading */}
        <div ref={burdenHead} style={{ textAlign: "center", maxWidth: 640 }}>
          <span style={{
            fontSize: "0.7rem", letterSpacing: "0.22em",
            color: "var(--pink)", textTransform: "uppercase", fontWeight: 400,
          }}>
            The Operational Shift
          </span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 300,
            color: "white", margin: "0.6rem 0 0.75rem", lineHeight: 1.2,
          }}>
            Every burden lifted.<br />
            <span style={{ color: "var(--pink)" }}>One contact held.</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: "0.95rem",
            fontWeight: 300, lineHeight: 1.7, margin: 0,
          }}>
            Expansion demands twelve distinct operational functions.
            We own all of them, so your leadership doesn&apos;t have to.
          </p>
        </div>

        {/* Three-column layout: cards | hub | core */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "clamp(2rem, 4vw, 5rem)", width: "100%", maxWidth: 960,
        }}>

          {/* Left — burden card stack */}
          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {BURDEN_CARDS.map((label, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  fontSize: "0.8rem", fontWeight: 300,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.02em",
                  willChange: "transform, opacity",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Center — IAGT hub */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            {/* Connector arrow left */}
            <svg width="48" height="2" style={{ display: "block" }}>
              <line x1="0" y1="1" x2="44" y2="1" stroke="rgba(255,31,142,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <polyline points="40,−3 48,1 40,5" fill="none" stroke="var(--pink)" strokeWidth="1.5" />
            </svg>
            <div
              ref={hubRef}
              style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "1px solid rgba(255,31,142,0.5)",
                background: "rgba(255,31,142,0.06)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px 2px rgba(255,31,142,0.2)",
              }}
            >
              <span style={{ color: "var(--pink)", fontSize: "0.65rem", letterSpacing: "0.14em", fontWeight: 400, textTransform: "uppercase" }}>
                IAGT
              </span>
            </div>
            {/* Connector arrow right */}
            <svg width="48" height="2" style={{ display: "block", transform: "scaleX(-1)" }}>
              <line x1="0" y1="1" x2="44" y2="1" stroke="rgba(255,31,142,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <polyline points="40,−3 48,1 40,5" fill="none" stroke="var(--pink)" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Right — what client keeps */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div
              ref={coreRef}
              style={{
                padding: "1.5rem",
                background: "rgba(255,31,142,0.05)",
                border: "1px solid rgba(255,31,142,0.25)",
                borderRadius: 6,
                boxShadow: "0 0 24px rgba(255,31,142,0.08)",
              }}
            >
              <div style={{
                fontSize: "0.65rem", letterSpacing: "0.18em",
                color: "var(--pink)", textTransform: "uppercase",
                fontWeight: 400, marginBottom: "0.5rem",
              }}>
                Your focus
              </div>
              <div style={{
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 300,
                color: "white", lineHeight: 1.3,
              }}>
                Core Business<br />Growth &amp; Strategy
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {METRICS.map((m, i) => (
                <div
                  key={i}
                  ref={el => { metricRefs.current[i] = el; }}
                  style={{ opacity: 0, display: "flex", alignItems: "baseline", gap: "0.5rem" }}
                >
                  <span style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 300,
                    color: "var(--pink)", lineHeight: 1,
                  }}>
                    {m.value}
                  </span>
                  <span style={{
                    fontSize: "0.8rem", color: "rgba(255,255,255,0.45)",
                    fontWeight: 300,
                  }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{
        height: 1, margin: "0 8%",
        background: "linear-gradient(to right, transparent, rgba(255,31,142,0.2), transparent)",
      }} />

      {/* ── C: The Value Axis ────────────────────────────────────────────── */}
      <div
        ref={axisRef}
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "8vh 8%", gap: "5rem",
        }}
      >
        {/* Eyebrow */}
        <div style={{ textAlign: "center" }}>
          <span style={{
            fontSize: "0.7rem", letterSpacing: "0.22em",
            color: "var(--pink)", textTransform: "uppercase", fontWeight: 400,
          }}>
            Where We Stand
          </span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 300,
            color: "white", margin: "0.6rem 0 0", lineHeight: 1.2,
          }}>
            Beyond the brief.
          </h2>
        </div>

        {/* Axis */}
        <div style={{ width: "100%", maxWidth: 800, position: "relative" }}>
          {/* Horizontal line */}
          <div
            ref={axisLine}
            style={{
              height: 1,
              background: "linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,31,142,0.6) 100%)",
              position: "relative",
            }}
          />

          {/* Nodes */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: "-8px", position: "relative",
          }}>
            {AXIS_NODES.map((node, i) => (
              <div
                key={i}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  ref={el => { axisDots.current[i] = el; }}
                  style={{
                    width: node.active ? 16 : 10,
                    height: node.active ? 16 : 10,
                    borderRadius: "50%",
                    background: node.active ? "var(--pink)" : "rgba(255,255,255,0.2)",
                    border: node.active ? "none" : "1px solid rgba(255,255,255,0.25)",
                    boxShadow: node.active ? "0 0 16px 4px rgba(255,31,142,0.4)" : "none",
                    marginTop: node.active ? "-3px" : 0,
                    flexShrink: 0,
                  }}
                />
                <div
                  ref={el => { axisLabels.current[i] = el; }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{
                    fontSize: node.active ? "0.85rem" : "0.75rem",
                    fontWeight: node.active ? 400 : 300,
                    color: node.active ? "var(--pink)" : "rgba(255,255,255,0.35)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "0.3rem",
                  }}>
                    {node.label}
                  </div>
                  <div style={{
                    fontSize: "0.78rem", fontWeight: 300,
                    color: node.active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)",
                    lineHeight: 1.5, whiteSpace: "pre-line",
                  }}>
                    {node.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three statements */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(1.5rem, 3vw, 3rem)",
          width: "100%", maxWidth: 960,
        }}>
          {STATEMENTS.map((s, i) => (
            <div
              key={i}
              ref={el => { stmtRefs.current[i] = el; }}
              style={{
                padding: "2rem 1.5rem",
                borderTop: "1px solid rgba(255,31,142,0.2)",
                display: "flex", flexDirection: "column", gap: "0.3rem",
              }}
            >
              {/* Small connector dot at top of border */}
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--pink)", marginTop: "-2.55rem", marginBottom: "1.5rem",
                boxShadow: "0 0 6px 2px rgba(255,31,142,0.4)",
              }} />
              <p style={{
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 300,
                color: "rgba(255,255,255,0.45)", lineHeight: 1.3, margin: 0,
              }}>
                {s.plain}
              </p>
              <p style={{
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 300,
                color: "white", lineHeight: 1.3, margin: 0,
              }}>
                {s.pink}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
