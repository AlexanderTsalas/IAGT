"use client";

import { useRef, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { sendContactEmail } from "@/app/actions/sendContactEmail";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Hourglass, Layers, Anchor,
  Milestone, Fingerprint, Key,
  Cpu, BrainCircuit, Database, Flame, Radio, Building2,
  ArrowLeft, ChevronRight, Network,
  Handshake, ChevronDown, X,
} from "lucide-react";
import AppointmentCalendar from "./AppointmentCalendar";
import { LogoMark } from "./Header";

gsap.registerPlugin(ScrollTrigger);

// ── Distillation data ─────────────────────────────────────────────────────────
const SOURCE_CARDS = [
  { top: "12–18 months",    sub: "Time to market",       icon: Hourglass },
  { top: "Multiple Vendors", sub: "Fragmented delivery",  icon: Layers    },
  { top: "Your overhead",   sub: "Operational burden",   icon: Anchor    },
];

const TARGET_CARDS = [
  { top: "From day one",   sub: "Fully operational",       icon: Milestone   },
  { top: "One partner",    sub: "Single point of contact", icon: Fingerprint },
  { top: "Full execution", sub: "Complete ownership",      icon: Key         },
];

// ── Industry network data ─────────────────────────────────────────────────────
const INDUSTRIES = [
  { name: "Technology",     icon: Cpu       },
  { name: "AI",             icon: BrainCircuit },
  { name: "Data Centers",   icon: Database  },
  { name: "Infrastructure", icon: Building2 },
  { name: "Energy",         icon: Flame     },
  { name: "Telecom",        icon: Radio     },
];

// ── Industry detail content ───────────────────────────────────────────────────
const INDUSTRY_CONTENT = [
  { // 0 – Technology
    expertise: [
      "Enterprise software market mapping",
      "Digital transformation advisory",
      "IT procurement ecosystem navigation",
      "Channel partner identification & design",
    ],
    connections: [
      "Microsoft Greece",
      "Oracle Hellas",
      "SAP Greece",
      "SEPE — Hellenic ICT Industry Association",
    ],
  },
  { // 1 – AI
    expertise: [
      "EU AI Act regulatory navigation",
      "AI deployment facilitation",
      "Academic-to-commercial bridging",
      "AI talent ecosystem access",
    ],
    connections: [
      "NCSR Demokritos",
      "FORTH Institute",
      "GRNET",
      "Athens University AI research clusters",
    ],
  },
  { // 2 – Data Centers
    expertise: [
      "Site selection & permitting",
      "Power infrastructure coordination",
      "Fiber connectivity facilitation",
      "Regulatory compliance management",
    ],
    connections: [
      "ADMIE — National Grid Operator",
      "Ministry of Digital Governance",
      "GR-IX Internet Exchange",
      "Municipal authorities network",
    ],
  },
  { // 3 – Infrastructure
    expertise: [
      "Public procurement navigation",
      "PPP & concession structuring",
      "Construction permitting coordination",
      "Stakeholder & political mapping",
    ],
    connections: [
      "Ministry of Infrastructure & Transport",
      "HRADF — Hellenic Asset Development Fund",
      "Enterprise Greece",
      "European Investment Bank Greece",
    ],
  },
  { // 4 – Energy
    expertise: [
      "Renewable energy project development",
      "Grid connection facilitation",
      "Energy trading regulatory guidance",
      "PPP & investment structuring",
    ],
    connections: [
      "RAE — Hellenic Energy Regulatory Authority",
      "ADMIE — National Grid Operator",
      "DAPEEP",
      "Ministry of Environment & Energy",
    ],
  },
  { // 5 – Telecom
    expertise: [
      "Spectrum licensing navigation",
      "Infrastructure rollout coordination",
      "EETT regulatory compliance",
      "Roaming & interconnect facilitation",
    ],
    connections: [
      "EETT — Hellenic Telecom Commission",
      "OTE Group",
      "Vodafone Greece",
      "Wind Hellas",
    ],
  },
];

// ── Viewbox constants ─────────────────────────────────────────────────────────
const vbW = 1000;
const vbH = 600;
const cy  = 300;

const SOURCE_X = [180, 500, 820];
const SOURCE_Y = 80;
const TARGET_X = [180, 500, 820];
const TARGET_Y = 520;

// Node positions [x, y]: top, left-upper, left-lower, bottom, right-lower, right-upper
const INDUSTRY_POS: [number, number][] = [
  [500,  22],  // 0 – top         (Technology)
  [115, 120],  // 1 – left-upper  (AI)
  [115, 480],  // 2 – left-lower  (Data Centers)
  [500, 578],  // 3 – bottom      (Infrastructure)
  [885, 480],  // 4 – right-lower (Energy)
  [885, 120],  // 5 – right-upper (Telecom)
];

const INDUSTRY_EDGES: { d: string; grad: string }[] = [
  // Technology — split around "In Six" text
  { d: `M 500 245 L 500 197`, grad: "url(#g-tech-lower)" },  // 0 center→below text
  { d: `M 500 173 L 500 64`,  grad: "url(#g-tech-upper)" },  // 1 above text→near node
  // Diagonals
  { d: `M 449 279 C 340 279, 233 150, 154 136`, grad: "url(#edgeGlow)" },  // 2 AI
  { d: `M 449 321 C 340 321, 233 450, 154 464`, grad: "url(#edgeGlow)" },  // 3 Data Centers
  // Infrastructure — split around "Industries" text
  { d: `M 500 355 L 500 403`, grad: "url(#g-infra-upper)" }, // 4 center→above text
  { d: `M 500 427 L 500 536`, grad: "url(#g-infra-lower)" }, // 5 below text→near node
  { d: `M 551 321 C 660 321, 767 450, 846 464`, grad: "url(#edgeGlow)" },  // 6 Energy
  { d: `M 551 279 C 660 279, 767 150, 846 136`, grad: "url(#edgeGlow)" },  // 7 Telecom
];

const IN_SIX_Y     = 177;
const INDUSTRIES_Y = 407;

// Indices into edgeRefs that are side edges (AI, DC, Energy, Telecom)
const SIDE_EDGE_INDICES = [2, 3, 6, 7];

// ── CTA section data ──────────────────────────────────────────────────────────
const METRICS = [
  { value: 340, prefix: "+", suffix: "%", label: "FDI Increase",        sublabel: "Foreign direct investment into Greece over the past decade"    },
  { value: 35,  prefix: "€", suffix: "B", label: "EU Capital Allocated", sublabel: "Infrastructure & digital transformation funds 2021–2027"       },
  { value: 12,  prefix: "",  suffix: "+", label: "Hyperscale Projects",  sublabel: "Major data center and energy developments currently in pipeline" },
  { value: 50,  prefix: "€", suffix: "M", label: "Addressable Market",   sublabel: "Estimated serviceable annual market for entry-stage clients"    },
];

const SERVICE_OPTIONS = [
  "Market Entry Strategy",
  "Commercial Representation",
  "Operational Setup",
  "Regulatory Coordination",
  "Local Operations Management",
  "Business Development",
];

type FormType = "Appointment Booking" | "Message" | "Capabilities Deck";

export default function DistillationSection() {
  // ── Selection state ───────────────────────────────────────────────────────
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);
  const [centerHovered,    setCenterHovered]    = useState(false);
  const [hoveredNode,      setHoveredNode]      = useState<number | null>(null);

  // ── CTA state ─────────────────────────────────────────────────────────────
  const [ctaMounted,   setCtaMounted]   = useState(false);
  const [ctaActive,    setCtaActive]    = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formType,     setFormType]     = useState<FormType>("Message");
  const [formData,     setFormData]     = useState({ name: "", company: "", email: "", phone: "", service: "" });
  const [formSent,     setFormSent]     = useState(false);
  const [formError,    setFormError]    = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Existing refs ─────────────────────────────────────────────────────────
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const sourceRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const targetRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const circleRef         = useRef<HTMLDivElement>(null);
  const headingRef        = useRef<HTMLDivElement>(null);
  const hourglassGroupRef = useRef<SVGGElement>(null);
  const apparatusRef      = useRef<HTMLDivElement>(null);
  const path1Ref          = useRef<SVGPathElement>(null);
  const path2Ref          = useRef<SVGPathElement>(null);
  const industryRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const edgeRefs          = useRef<(SVGPathElement | null)[]>([]);
  const inSixRef          = useRef<HTMLDivElement>(null);
  const industriesTextRef = useRef<HTMLDivElement>(null);

  // ── New refs ──────────────────────────────────────────────────────────────
  const mobLeftDividerRef    = useRef<HTMLDivElement>(null);
  const mobRightDividerRef   = useRef<HTMLDivElement>(null);
  const logoRef              = useRef<HTMLDivElement>(null);
  const centerIconsRef       = useRef<(HTMLDivElement | null)[]>([]);
  const leftPanelRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const rightPanelRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const selectionTlRef       = useRef<gsap.core.Timeline | null>(null);
  const isSelectingRef       = useRef(false);
  const selectedIndexRef     = useRef<number | null>(null);

  // ── CTA refs ──────────────────────────────────────────────────────────────
  const ctaHandshakeRef      = useRef<HTMLDivElement>(null);
  const ctaPanelLeftRef      = useRef<HTMLDivElement>(null);
  const ctaPanelRightRef     = useRef<HTMLDivElement>(null);
  const metricCounterRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const ctaActiveRef         = useRef(false);
  const selectedCtaActiveRef = useRef(false);
  const selectedToCtaTlRef   = useRef<gsap.core.Timeline | null>(null);

  // ── Lenis refs ────────────────────────────────────────────────────────────
  const lenisRef      = useRef<any>(null);
  const prevRectTopRef = useRef(0);

  // ── Scroll step state ─────────────────────────────────────────────────────
  const stepRef          = useRef(0);
  const isIntroAnimating = useRef(false);
  const lastScrollTime   = useRef(0);
  const tls              = useRef<gsap.core.Timeline[]>([]);

  // ── Node click handler ────────────────────────────────────────────────────
  const handleNodeClick = (i: number) => {
    if (isSelectingRef.current)            return;
    if (stepRef.current < 4)               return; // industries not yet revealed
    if (selectedIndexRef.current !== null) return; // already in selected view
    if (ctaActiveRef.current)             return; // CTA section active

    isSelectingRef.current   = true;
    selectedIndexRef.current = i;
    flushSync(() => setSelectedIndustry(i));

    const sideEdges = SIDE_EDGE_INDICES
      .map(idx => edgeRefs.current[idx])
      .filter((el): el is SVGPathElement => el !== null);

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "sine.inOut" },
      onComplete: () => { isSelectingRef.current = false; },
      onReverseComplete: () => {
        isSelectingRef.current   = false;
        selectedIndexRef.current = null;
        flushSync(() => setSelectedIndustry(null));
      },
    });

    // Phase 1 — fade out other nodes + labels
    const otherNodes = industryRefs.current.filter((_, idx) => idx !== i);
    tl.to(otherNodes.filter(Boolean), { opacity: 0, duration: 0.25 }, 0);
    tl.to([inSixRef.current, industriesTextRef.current], { opacity: 0, duration: 0.2 }, 0);

    // Phase 2 — collapse side edges (erase from node end toward center)
    sideEdges.forEach(edge => {
      const len = edge.getTotalLength();
      tl.to(edge, { strokeDashoffset: len, duration: 0.4, ease: "power2.inOut" }, 0.1);
    });

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const centerEdges = [0, 1, 4, 5].map(idx => edgeRefs.current[idx]).filter((el): el is SVGPathElement => el !== null);
      centerEdges.forEach(edge => {
        tl.to(edge, { strokeDashoffset: edge.getTotalLength(), duration: 0.4, ease: "power2.inOut" }, 0.1);
      });
      tl.to([mobLeftDividerRef.current, mobRightDividerRef.current], { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.4);
    }

    // Phase 3 — logo fades out, selected node fades out
    tl.to(logoRef.current, { opacity: 0, duration: 0.3 }, 0.2);
    tl.to(industryRefs.current[i], { opacity: 0, duration: 0.3 }, 0.35);

    // Phase 4 — center icon for this industry fades in
    tl.to(centerIconsRef.current[i], {
      opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)",
    }, 0.5);

    // Phase 5 — content panels slide in
    tl.fromTo(
      leftPanelRefs.current[i],
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.5 },
      0.75,
    );
    tl.fromTo(
      rightPanelRefs.current[i],
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.5 },
      0.82,
    );

    selectionTlRef.current = tl;
    tl.play();
  };

  const handleBackClick = () => {
    if (isSelectingRef.current || !selectionTlRef.current) return;
    if (selectedIndexRef.current === null) return;
    isSelectingRef.current = true;
    setCenterHovered(false);

    // If in the selectedCta sub-state, jump directly to node network —
    // don't reverse through the industry panel state (avoids the flash)
    if (selectedCtaActiveRef.current) {
      const i = selectedIndexRef.current;
      selectedCtaActiveRef.current = false;
      ctaActiveRef.current = false;
      if (selectedToCtaTlRef.current) { selectedToCtaTlRef.current.kill(); selectedToCtaTlRef.current = null; }
      metricCounterRefs.current.forEach((el, idx) => {
        if (el) el.textContent = METRICS[idx].prefix + "0" + METRICS[idx].suffix;
      });
      flushSync(() => { setCtaActive(false); setCtaMounted(false); });

      // Kill the selection timeline — animate directly to node network instead
      selectionTlRef.current.kill();
      gsap.set(ctaHandshakeRef.current, { opacity: 0, scale: 0.5 });

      const backTl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
          isSelectingRef.current = false;
          selectedIndexRef.current = null;
          flushSync(() => setSelectedIndustry(null));
        },
      });
      backTl.to(logoRef.current, { opacity: 1, duration: 0.25 }, 0);
      backTl.to(industryRefs.current.filter(Boolean), { opacity: 1, scale: 1, duration: 0.35, stagger: 0.04 }, 0.05);
      SIDE_EDGE_INDICES.forEach(idx => {
        const edge = edgeRefs.current[idx];
        if (!edge) return;
        backTl.to(edge, { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, 0);
      });

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const centerEdges = [0, 1, 4, 5].map(idx => edgeRefs.current[idx]).filter((el): el is SVGPathElement => el !== null);
        centerEdges.forEach(edge => {
          backTl.to(edge, { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, 0);
        });
        backTl.to([mobLeftDividerRef.current, mobRightDividerRef.current], { scaleX: 0, duration: 0.3, ease: "power2.inOut" }, 0);
      }
      backTl.to([inSixRef.current, industriesTextRef.current], { opacity: 1, duration: 0.3 }, 0.15);
      return;
    }

    // Restore icon opacity before reversing (hover effect may have faded it)
    const icon = selectedIndexRef.current !== null ? centerIconsRef.current[selectedIndexRef.current] : null;
    if (icon) { gsap.killTweensOf(icon, "opacity"); gsap.set(icon, { opacity: 1 }); }

    selectionTlRef.current.reverse();
  };

  const handleSelectedToCta = () => {
    if (isSelectingRef.current) return;
    if (selectedIndexRef.current === null) return;
    if (selectedCtaActiveRef.current) return;
    const i = selectedIndexRef.current;
    isSelectingRef.current = true;

    // Mount CTA panels synchronously so refs are populated before building the timeline
    flushSync(() => setCtaMounted(true));

    const miniTl = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      onComplete: () => {
        isSelectingRef.current = false;
        selectedCtaActiveRef.current = true;
        ctaActiveRef.current = true;
        METRICS.forEach((metric, idx) => {
          const el = metricCounterRefs.current[idx];
          if (!el) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: metric.value, duration: 1.8, ease: "power2.out", delay: idx * 0.12,
            onUpdate: () => { el.textContent = metric.prefix + Math.round(obj.val) + metric.suffix; },
          });
        });
        flushSync(() => setCtaActive(true));
      },
    });

    // Fade out industry panels and center icon
    miniTl.to(leftPanelRefs.current[i],  { opacity: 0, x: -20, duration: 0.35 }, 0);
    miniTl.to(rightPanelRefs.current[i], { opacity: 0, x:  20, duration: 0.35 }, 0);
    miniTl.to(centerIconsRef.current[i], { opacity: 0, scale: 0.8, duration: 0.3 }, 0);
    // Fade in handshake
    miniTl.to(ctaHandshakeRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 0.3);
    // Slide in CTA panels
    miniTl.fromTo(ctaPanelLeftRef.current,  { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.5 }, 0.45);
    miniTl.fromTo(ctaPanelRightRef.current, { opacity: 0, x:  28 }, { opacity: 1, x: 0, duration: 0.5 }, 0.5);

    selectedToCtaTlRef.current = miniTl;
  };

  // ── Lenis scroll clamp — prevent overshoot in both directions ────────────
  useLenis((lenis) => {
    lenisRef.current = lenis;
    const el = wrapperRef.current;
    if (!el) return;
    const rectTop    = el.getBoundingClientRect().top;
    const prevRectTop = prevRectTopRef.current;
    prevRectTopRef.current = rectTop;

    // ① Downward overshoot: step machine incomplete, section scrolled above viewport
    if (stepRef.current < 5 && rectTop < -2) {
      // Call window.scrollTo directly — it is synchronous, overrides the scrollTop
      // Lenis just set this same frame, and immediately cancels iOS momentum scroll.
      // lenis.scrollTo({ immediate }) only updates internal state; the DOM update is
      // deferred to the next RAF, causing a one-frame lag that produces visible stutter.
      window.scrollTo(0, window.scrollY + rectTop);
      // Desktop: stop Lenis so the wheel handler exclusively drives step navigation.
      // Mobile: keep Lenis running — stopping it would prevent this clamp from
      // firing on subsequent frames, letting native momentum carry past the section.
      if (window.innerWidth >= 768) lenis.stop();
      return;
    }

    // ② Upward re-engagement: step machine was complete, section crossing back into
    //    viewport from below (prevRectTop was negative, rectTop is crossing -2→0)
    if (stepRef.current === 5 && prevRectTop < -2 && rectTop >= -2) {
      window.scrollTo(0, window.scrollY + rectTop);
      if (window.innerWidth >= 768) lenis.stop();
      stepRef.current = 4;
      if (selectedCtaActiveRef.current) {
        // Came from the selectedIndustry→CTA path: tls[4] was never built.
        // handleBackClick handles full cleanup (handshake, icon, nodes) correctly.
        handleBackClick();
      } else {
        tls.current[4]?.reverse();
      }
      return;
    }

    // ③ Upward overshoot (mobile): mid-step, momentum carried page above the section
    //    so the distillation section has slid below the viewport top (rectTop > 5).
    //    Snap back so the section stays pinned at viewport top between steps.
    if (stepRef.current > 0 && stepRef.current < 5 && rectTop > 5) {
      window.scrollTo(0, window.scrollY + rectTop);
      // No lenis.stop() — keep clamp active for subsequent momentum frames.
    }
  });

  // ── CTA timeline builder (called lazily, after panels are mounted) ────────
  const buildCtaTl = () => {
    const ctaTl = gsap.timeline({
      paused: true,
      defaults: { ease: "sine.inOut" },
      onComplete: () => {
        ctaActiveRef.current = true;
        METRICS.forEach((metric, i) => {
          const el = metricCounterRefs.current[i];
          if (!el) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: metric.value, duration: 1.8, ease: "power2.out", delay: i * 0.12,
            onUpdate: () => { el.textContent = metric.prefix + Math.round(obj.val) + metric.suffix; },
          });
        });
        flushSync(() => setCtaActive(true));
      },
      onReverseComplete: () => {
        ctaActiveRef.current = false;
        metricCounterRefs.current.forEach((el, i) => {
          if (el) el.textContent = METRICS[i].prefix + "0" + METRICS[i].suffix;
        });
        flushSync(() => { setCtaActive(false); setCtaMounted(false); });
      },
    });

    ctaTl.to(industryRefs.current.filter(Boolean), { opacity: 0, duration: 0.3 }, 0);
    ctaTl.to([inSixRef.current, industriesTextRef.current], { opacity: 0, duration: 0.25 }, 0);
    SIDE_EDGE_INDICES.forEach(idx => {
      const edge = edgeRefs.current[idx];
      if (!edge) return;
      ctaTl.to(edge, { strokeDashoffset: edge.getTotalLength(), duration: 0.4, ease: "power2.inOut" }, 0.1);
    });

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const centerEdges = [0, 1, 4, 5].map(idx => edgeRefs.current[idx]).filter((el): el is SVGPathElement => el !== null);
      centerEdges.forEach(edge => {
        ctaTl.to(edge, { strokeDashoffset: edge.getTotalLength(), duration: 0.4, ease: "power2.inOut" }, 0.1);
      });
      ctaTl.to([mobLeftDividerRef.current, mobRightDividerRef.current], { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.4);
    }
    ctaTl.to(logoRef.current, { opacity: 0, duration: 0.3 }, 0.2);
    ctaTl.to(ctaHandshakeRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, 0.5);
    ctaTl.fromTo(ctaPanelLeftRef.current,  { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.55 }, 0.75);
    ctaTl.fromTo(ctaPanelRightRef.current, { opacity: 0, x:  28 }, { opacity: 1, x: 0, duration: 0.55 }, 0.82);

    return ctaTl;
  };

  // ── Main effect ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Initial hidden states
    gsap.set(targetRefs.current.filter(Boolean),   { opacity: 0, scale: 0.2, left: "50%", top: "50%" });
    gsap.set(industryRefs.current.filter(Boolean), { opacity: 0, scale: 0.5 });
    gsap.set([inSixRef.current, industriesTextRef.current], { opacity: 0 });
    gsap.set(centerIconsRef.current.filter(Boolean), { opacity: 0, scale: 0.5 });
    leftPanelRefs.current.forEach(el  => el && gsap.set(el, { opacity: 0 }));
    rightPanelRefs.current.forEach(el => el && gsap.set(el, { opacity: 0 }));
    gsap.set(ctaHandshakeRef.current, { opacity: 0, scale: 0.5 });
    gsap.set([mobLeftDividerRef.current, mobRightDividerRef.current], { scaleX: 0 });
    // CTA panels are not mounted yet — no gsap.set needed for them

    const ctx = gsap.context(() => {
      const leftPath  = path1Ref.current;
      const rightPath = path2Ref.current;

      if (leftPath) {
        const len = leftPath.getTotalLength();
        gsap.set(leftPath, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (rightPath) {
        const len = rightPath.getTotalLength();
        gsap.set(rightPath, { strokeDasharray: len, strokeDashoffset: len });
      }

      edgeRefs.current.forEach(el => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap.set(headingRef.current, { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(sourceRefs.current, { opacity: 0, y: 20 });
      gsap.set(circleRef.current,  { opacity: 0, scale: 0 });

      // ── Scroll-triggered entrance ────────────────────────────────────────
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          isIntroAnimating.current = true;
          const introTl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => { isIntroAnimating.current = false; },
          });

          if (leftPath && rightPath) {
            introTl.to([leftPath, rightPath], {
              strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut",
            });
          }

          introTl.to(circleRef.current, {
            opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)",
          }, "-=1.0");

          introTl.to(headingRef.current, {
            opacity: 1, y: 0, duration: 0.8,
          }, "-=0.6");

          introTl.to(sourceRefs.current, {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          }, "-=0.6");
        },
      });

      // ── Card distillation timelines (steps 0–2) ──────────────────────────
      SOURCE_CARDS.forEach((_, i) => {
        const sCard = sourceRefs.current[i];
        const tCard = targetRefs.current[i];

        const cardTl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });

        cardTl.to(sCard, { left: "50%", top: "50%", scale: 0.1, opacity: 0, duration: 0.6 });

        cardTl.to(circleRef.current, {
          scale: 1.15,
          boxShadow: "0 0 50px 15px rgba(255,31,142,0.8)",
          borderColor: "rgba(255,255,255,0.8)",
          duration: 0.25, yoyo: true, repeat: 1,
        }, "-=0.2");

        cardTl.to(tCard, {
          left: `${(TARGET_X[i] / vbW) * 100}%`,
          top:  `${(TARGET_Y   / vbH) * 100}%`,
          scale: 1, opacity: 1, duration: 0.6,
        }, "-=0.2");

        if (i === 2) {
          cardTl.to(headingRef.current,   { y: "16vh", duration: 0.6 }, "<");
          cardTl.to(apparatusRef.current, { y: "-6vh", duration: 0.6 }, "<");
          cardTl.to(hourglassGroupRef.current, {
            filter: "drop-shadow(0 0 35px rgba(255,31,142,1))",
            duration: 0.3, yoyo: true, repeat: 1,
          }, "<");
        }

        tls.current[i] = cardTl;
      });

      // ── Industries transition timeline (step 3) ──────────────────────────
      const leftLen  = leftPath  ? leftPath.getTotalLength()  : 0;
      const rightLen = rightPath ? rightPath.getTotalLength() : 0;

      const headingEl     = headingRef.current;
      const headingLayoutH = headingEl
        ? headingEl.offsetHeight + window.innerHeight * 0.06
        : 0;
      const centerCompY = -Math.round(headingLayoutH / 2);

      const transTl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });

      transTl.to(headingRef.current, { opacity: 0, duration: 0.35 }, 0);
      transTl.to(targetRefs.current.filter(Boolean), { opacity: 0, duration: 0.4, stagger: 0.06 }, 0);
      transTl.to(apparatusRef.current, { y: centerCompY, duration: 0.5 }, 0);

      if (leftPath)  transTl.to(leftPath,  { strokeDashoffset: leftLen,  duration: 0.65, ease: "power2.inOut" }, 0.15);
      if (rightPath) transTl.to(rightPath, { strokeDashoffset: rightLen, duration: 0.65, ease: "power2.inOut" }, 0.15);

      transTl.to(edgeRefs.current.filter(Boolean), {
        strokeDashoffset: 0, duration: 0.55, stagger: 0.07, ease: "power2.inOut",
      }, 0.65);

      transTl.to([inSixRef.current, industriesTextRef.current], { opacity: 1, duration: 0.35 }, 1.0);

      transTl.to(industryRefs.current.filter(Boolean), {
        opacity: 1, scale: 1, duration: 0.4, stagger: 0.07,
      }, 1.05);

      tls.current[3] = transTl;

    }); // end gsap.context

    // ── Wheel handler ─────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;

      const isAtTop = Math.abs(rect.top) <= 5;
      if (!isAtTop) return;

      if (isIntroAnimating.current) {
        e.stopPropagation(); e.preventDefault(); return;
      }

      // Block all scroll while any step transition is active.
      // tls[2] (last card animation) is also guarded — unlike the earlier cards,
      // it drives heading + apparatus moves simultaneously so a concurrent tls[3]
      // start causes a visual crash. Earlier cards (tls[0], tls[1]) are intentionally
      // left unguarded to allow rapid consecutive scrolling through the sequence.
      if (tls.current[2]?.isActive() || tls.current[3]?.isActive() || tls.current[4]?.isActive() || selectedToCtaTlRef.current?.isActive()) {
        e.stopPropagation(); e.preventDefault();
        if (rect.top !== 0) window.scrollTo(0, window.scrollY + rect.top);
        return;
      }

      const scrollingDown = e.deltaY > 0;
      const now = Date.now();

      // Handle scroll while in selected industry view (with or without CTA sub-state)
      if (selectedIndexRef.current !== null || isSelectingRef.current) {
        // In CTA sub-state scrolling down → release to footer (same as normal step 5 release)
        if (!isSelectingRef.current && scrollingDown && selectedCtaActiveRef.current) {
          stepRef.current = 5;
          lenisRef.current?.start();
          return;
        }
        e.stopPropagation(); e.preventDefault();
        if (rect.top !== 0) window.scrollTo(0, window.scrollY + rect.top);
        if (isSelectingRef.current) return;
        if (now - lastScrollTime.current < 250) return;
        lastScrollTime.current = now;
        if (scrollingDown && !selectedCtaActiveRef.current) {
          handleSelectedToCta();
        } else if (!scrollingDown) {
          handleBackClick();
        }
        return;
      }

      if (scrollingDown) {
        if (stepRef.current < 5) {
          e.stopPropagation(); e.preventDefault();
          if (rect.top !== 0) window.scrollTo(0, window.scrollY + rect.top);
          if (now - lastScrollTime.current < 250) return;
          lastScrollTime.current = now;
          if (stepRef.current === 4) {
            // Mount CTA panels synchronously first so refs are populated, then build the timeline
            flushSync(() => setCtaMounted(true));
            const ctaTl = buildCtaTl();
            tls.current[4] = ctaTl;
            ctaTl.play();
          } else {
            tls.current[stepRef.current].play();
          }
          stepRef.current++;
          if (stepRef.current >= 5) {
            // Release Lenis — let it scroll past the section to the footer
            lenisRef.current?.start();
          }
        }
        // step >= 5 (CTA complete) → fall through, native scroll continues
      } else {
        if (stepRef.current > 0) {
          e.stopPropagation(); e.preventDefault();
          if (rect.top !== 0) window.scrollTo(0, window.scrollY + rect.top);
          if (now - lastScrollTime.current < 250) return;
          lastScrollTime.current = now;
          stepRef.current--;
          tls.current[stepRef.current].reverse();
        } else if (tls.current[0]?.progress() > 0) {
          e.stopPropagation(); e.preventDefault();
          if (rect.top !== 0) window.scrollTo(0, window.scrollY + rect.top);
        } else {
          // step 0, no animation — release upward to parent (scroll to ServicesScroll)
          lenisRef.current?.start();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { capture: true, passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      lenisRef.current?.start(); // ensure Lenis is running on unmount
      ctx.revert();
    };
  }, []);

  // ── Touch → discrete steps (mobile) ──────────────────────────────────────
  // Mirrors the wheel handler: trap scroll while steps are incomplete, release
  // at boundaries — identical logic to how desktop wheel-scroll works.
  useEffect(() => {
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect || Math.abs(rect.top) > 5) return; // section not at top — let native scroll handle it

      if (isIntroAnimating.current) { e.preventDefault(); return; }
      if (
        tls.current[2]?.isActive() || tls.current[3]?.isActive() ||
        tls.current[4]?.isActive() || selectedToCtaTlRef.current?.isActive()
      ) { e.preventDefault(); return; }

      const currentY    = e.touches[0].clientY;
      const swipingDown = (touchStartY - currentY) > 0;

      if (selectedIndexRef.current !== null || isSelectingRef.current) {
        if (!isSelectingRef.current && swipingDown && selectedCtaActiveRef.current) return; // release to footer
        e.preventDefault();
        return;
      }

      if (swipingDown) {
        if (stepRef.current < 5) e.preventDefault(); // trap until all steps done
        // else: stepRef >= 5 → release to footer
      } else {
        if (stepRef.current > 0 || (tls.current[0]?.progress() ?? 0) > 0) e.preventDefault();
        // else: step 0, tl0 clean → release upward to services section
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect || Math.abs(rect.top) > 5) return;
      if (isIntroAnimating.current) return;
      if (
        tls.current[2]?.isActive() || tls.current[3]?.isActive() ||
        tls.current[4]?.isActive() || selectedToCtaTlRef.current?.isActive()
      ) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      const swipingDown = deltaY > 0;
      const now = Date.now();

      // ── Selected-industry state ────────────────────────────────────────────
      if (selectedIndexRef.current !== null || isSelectingRef.current) {
        if (!isSelectingRef.current && swipingDown && selectedCtaActiveRef.current) {
          stepRef.current = 5; // useLenis clamp stops pinning → natural scroll to footer
          return;
        }
        if (isSelectingRef.current) return;
        if (now - lastScrollTime.current < 250) return;
        lastScrollTime.current = now;
        if (swipingDown && !selectedCtaActiveRef.current) handleSelectedToCta();
        else if (!swipingDown) handleBackClick();
        return;
      }

      // ── Normal step navigation ─────────────────────────────────────────────
      if (swipingDown) {
        if (stepRef.current < 5) {
          if (now - lastScrollTime.current < 250) return;
          lastScrollTime.current = now;
          if (stepRef.current === 4) {
            flushSync(() => setCtaMounted(true));
            const ctaTl = buildCtaTl();
            tls.current[4] = ctaTl;
            ctaTl.play();
          } else {
            tls.current[stepRef.current]?.play();
          }
          stepRef.current++;
          // When stepRef reaches 5, useLenis clamp stops pinning → natural scroll resumes
        }
        // stepRef >= 5: touchmove already released → natural scroll to footer
      } else {
        if (stepRef.current > 0) {
          if (now - lastScrollTime.current < 250) return;
          lastScrollTime.current = now;
          stepRef.current--;
          tls.current[stepRef.current]?.reverse();
        }
        // stepRef 0, no tl0 progress: touchmove already released → scroll back to services
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { capture: true, passive: false });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove,  { capture: true });
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  // ── Fade background icon on center-node hover ──────────────────────────────
  useEffect(() => {
    // Don't animate during any transition — the selection/back timelines own the icon opacity
    if (isSelectingRef.current) return;
    if (selectedIndustry !== null && !ctaActive) {
      // Selected industry view — fade the industry icon to reveal the back arrow
      const icon = centerIconsRef.current[selectedIndustry];
      if (icon) gsap.to(icon, { opacity: centerHovered ? 0 : 1, duration: 0.2, overwrite: "auto" });
    }
    if (ctaActive) {
      // CTA view — fade the handshake to reveal the scroll indicator
      if (ctaHandshakeRef.current)
        gsap.to(ctaHandshakeRef.current, { opacity: centerHovered ? 0 : 1, duration: 0.2, overwrite: "auto" });
    }
  }, [centerHovered, selectedIndustry, ctaActive]);

  const isSelected  = selectedIndustry !== null;
  const isCenterInteractive = isSelected || ctaActive;

  return (
    <div
      ref={wrapperRef}
      style={{
        height: "100vh",
        background: "var(--dark)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Distillation Heading ── */}
      <div ref={headingRef} style={{ textAlign: "center", marginBottom: "6vh", zIndex: 10, position: "relative" }}>
        <span style={{
          fontSize: "0.75rem", letterSpacing: "0.25em",
          color: "var(--pink)", textTransform: "uppercase", fontWeight: 400,
        }}>
          Operational Shift
        </span>
        <h2 style={{
          fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)", fontWeight: 300,
          color: "white", margin: "0.8rem 0 0", lineHeight: 1.25, maxWidth: "800px",
        }}>
          Burdens <span style={{ color: "white" }}>Distilled</span>{" "}by your<br />
          <span style={{ color: "var(--pink)" }}>Nodal Wirepuller</span>
        </h2>
      </div>

      {/* ── Apparatus Area ── */}
      <div
        ref={apparatusRef}
        className="w-full max-w-[1000px] shrink-0 aspect-[3/4] md:aspect-[1000/600] relative mx-auto"
      >
        {/* ── SVG: hourglass + edges ── */}
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="none"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            pointerEvents: "none", zIndex: 1, overflow: "visible",
          }}
        >
          <defs>
            <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,31,142,0.1)" />
              <stop offset="50%"  stopColor="rgba(255,31,142,0.6)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0.1)" />
            </linearGradient>
            <radialGradient id="edgeGlow" cx="500" cy="300" r="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,31,142,0.35)" />
              <stop offset="18%"  stopColor="rgba(255,31,142,0.70)" />
              <stop offset="72%"  stopColor="rgba(255,31,142,0.55)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0)"    />
            </radialGradient>
            <linearGradient id="g-tech-lower" x1="500" y1="245" x2="500" y2="197" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,31,142,0)"    />
              <stop offset="40%"  stopColor="rgba(255,31,142,0.65)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0)"    />
            </linearGradient>
            <linearGradient id="g-tech-upper" x1="500" y1="173" x2="500" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,31,142,0)"    />
              <stop offset="44%"  stopColor="rgba(255,31,142,0.65)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0)"    />
            </linearGradient>
            <linearGradient id="g-infra-upper" x1="500" y1="355" x2="500" y2="403" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,31,142,0)"    />
              <stop offset="40%"  stopColor="rgba(255,31,142,0.65)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0)"    />
            </linearGradient>
            <linearGradient id="g-infra-lower" x1="500" y1="427" x2="500" y2="536" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,31,142,0)"    />
              <stop offset="46%"  stopColor="rgba(255,31,142,0.65)" />
              <stop offset="100%" stopColor="rgba(255,31,142,0)"    />
            </linearGradient>
          </defs>

          {/* Hourglass curves */}
          <g ref={hourglassGroupRef} style={{ filter: "drop-shadow(0 0 0px rgba(255,31,142,0))" }}>
            <path
              ref={path1Ref}
              d={`M -200 -20 C -200 250, 410 200, 410 ${cy} C 410 400, -200 350, -200 620`}
              fill="none" stroke="url(#pinkGradient)" strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,31,142,0.4))" }}
            />
            <path
              ref={path2Ref}
              d={`M 1200 -20 C 1200 250, 590 200, 590 ${cy} C 590 400, 1200 350, 1200 620`}
              fill="none" stroke="url(#pinkGradient)" strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,31,142,0.4))" }}
            />
          </g>

          {/* Industry network edges */}
          {INDUSTRY_EDGES.map((edge, i) => (
            <path
              key={`edge-${i}`}
              ref={el => { edgeRefs.current[i] = el; }}
              d={edge.d}
              fill="none" stroke={edge.grad} strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,31,142,0.4))" }}
            />
          ))}
        </svg>

        {/* ── Source Cards ── */}
        {SOURCE_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={`source-${i}`}
              ref={el => { sourceRefs.current[i] = el; }}
              className="absolute flex flex-col items-center z-[2] opacity-70 grayscale"
              style={{
                left: `${(SOURCE_X[i] / vbW) * 100}%`,
                top:  `${(SOURCE_Y   / vbH) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-[42px] h-[42px] md:w-[64px] md:h-[64px] bg-white/5 rounded-xl md:rounded-2xl flex justify-center items-center shrink-0">
                <Icon className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] text-white/70" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center text-center gap-1 whitespace-normal w-[85px] md:w-auto mt-2 md:mt-3">
                <span className="text-[0.75rem] md:text-[1.25rem] font-light text-white/60 leading-tight">{card.top}</span>
                <span className="text-[0.55rem] md:text-[0.8rem] tracking-widest text-[var(--pink)] uppercase mt-1">{card.sub}</span>
              </div>
            </div>
          );
        })}

        {/* ── Target Cards ── */}
        {TARGET_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={`target-${i}`}
              ref={el => { targetRefs.current[i] = el; }}
              className="absolute flex flex-col items-center z-[3]"
              style={{
                left: `${(TARGET_X[i] / vbW) * 100}%`,
                top:  `${(TARGET_Y   / vbH) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-xl md:rounded-2xl flex justify-center items-center shrink-0 bg-gradient-to-br from-[#ff1f8e]/15 to-transparent border border-[var(--pink)] shadow-lg backdrop-blur">
                <Icon className="w-[22px] h-[22px] md:w-[38px] md:h-[38px] text-white" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-center text-center gap-1 whitespace-normal w-[90px] md:w-auto mt-2 md:mt-3">
                <span className="text-[0.8rem] md:text-[1.35rem] font-normal text-white leading-tight">{card.top}</span>
                <span className="text-[0.55rem] md:text-[0.85rem] tracking-widest text-[var(--pink)] uppercase font-medium mt-1">{card.sub}</span>
              </div>
            </div>
          );
        })}

        {/* ── Industry Nodes ── */}
        {INDUSTRIES.map((ind, i) => {
          const Icon = ind.icon;
          const [nx, ny] = INDUSTRY_POS[i];
          return (
            <div
              key={`industry-${i}`}
              ref={el => { industryRefs.current[i] = el; }}
              onClick={() => handleNodeClick(i)}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute flex flex-col items-center z-[4] cursor-pointer transition-transform duration-200"
              style={{
                left: `${(nx / vbW) * 100}%`,
                top:  `${(ny / vbH) * 100}%`,
                transform: hoveredNode === i ? "translate(-50%, -50%) scale(1.12)" : "translate(-50%, -50%)",
              }}
            >
              <div className="w-[50px] h-[50px] md:w-[76px] md:h-[76px] rounded-full flex justify-center items-center shrink-0 transition-all duration-200"
                style={{
                  background: hoveredNode === i
                    ? "rgba(255,31,142,0.16)"
                    : "rgba(255,31,142,0.07)",
                  border: hoveredNode === i
                    ? "1px solid rgba(255,31,142,0.8)"
                    : "1px solid rgba(255,31,142,0.35)",
                  boxShadow: hoveredNode === i
                    ? "0 0 36px rgba(255,31,142,0.5), inset 0 0 14px rgba(255,31,142,0.1)"
                    : "0 0 22px rgba(255,31,142,0.14)",
                }}>
                <Icon className="w-[22px] h-[22px] md:w-[34px] md:h-[34px] text-white" strokeWidth={1.5} />
              </div>
              <span className="text-[0.55rem] md:text-[0.75rem] tracking-[0.18em] uppercase whitespace-normal text-center max-w-[70px] md:max-w-none mt-2 md:mt-3 transition-colors duration-200"
                style={{
                  color: hoveredNode === i ? "white" : "rgba(255,255,255,0.65)",
                }}>
                {ind.name}
              </span>
            </div>
          );
        })}

        {/* ── TOP LABEL: four states ── */}
        <div ref={inSixRef} className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[5] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none" style={{ top: `${(IN_SIX_Y / vbH) * 100}%` }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">In Six</span>
        </div>
        {/* State 2: industry name (selected, not hovering) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[6] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(IN_SIX_Y / vbH) * 100}%`, opacity: isSelected && !ctaActive && !centerHovered ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">{selectedIndustry !== null ? INDUSTRIES[selectedIndustry].name : ""}</span>
        </div>
        {/* State 3: Return (selected, hovering) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[7] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(IN_SIX_Y / vbH) * 100}%`, opacity: isSelected && !ctaActive && centerHovered ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">Return</span>
        </div>
        {/* State 4: "The Window" (CTA active) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[8] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(IN_SIX_Y / vbH) * 100}%`, opacity: ctaActive ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">The Window</span>
        </div>

        {/* ── BOTTOM LABEL: four states ── */}
        <div ref={industriesTextRef} className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[5] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none" style={{ top: `${(INDUSTRIES_Y / vbH) * 100}%` }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">Industries</span>
        </div>
        {/* State 2: "Industry" (selected, not hovering) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[6] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(INDUSTRIES_Y / vbH) * 100}%`, opacity: isSelected && !ctaActive && !centerHovered ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">Industry</span>
        </div>
        {/* State 3: "View" (selected, hovering) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[7] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(INDUSTRIES_Y / vbH) * 100}%`, opacity: isSelected && !ctaActive && centerHovered ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">View</span>
        </div>
        {/* State 4: "Is Open" (CTA active) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-[8] bg-[var(--dark)] px-3.5 py-0.5 pointer-events-none transition-opacity duration-200 whitespace-nowrap" style={{ top: `${(INDUSTRIES_Y / vbH) * 100}%`, opacity: ctaActive ? 1 : 0 }}>
          <span className="text-[0.65rem] tracking-[0.32em] text-white uppercase">Is Open</span>
        </div>

        {/* ── Mobile Horizontal Separators ── */}
        <div ref={mobLeftDividerRef} className="absolute top-[50%] left-[5%] right-[calc(50%+40px)] h-[1.5px] bg-gradient-to-l from-[#ff1f8e] to-transparent z-[5] md:hidden scale-x-0 origin-right rounded-full mix-blend-screen" style={{ transform: "translateY(-50%)" }} />
        <div ref={mobRightDividerRef} className="absolute top-[50%] left-[calc(50%+40px)] right-[5%] h-[1.5px] bg-gradient-to-r from-[#ff1f8e] to-transparent z-[5] md:hidden scale-x-0 origin-left rounded-full mix-blend-screen" style={{ transform: "translateY(-50%)" }} />

        {/* ── Central Logo Circle ── */}
        <div
          ref={circleRef}
          onMouseEnter={() => { if (isCenterInteractive) setCenterHovered(true); }}
          onMouseLeave={() => setCenterHovered(false)}
          onClick={() => { if (isSelected && !ctaActive) handleBackClick(); }}
          className="w-[64px] h-[64px] md:w-[110px] md:h-[110px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--dark)] border-2 border-[#ff1f8e]/60 rounded-full flex justify-center items-center shadow-[0_0_30px_5px_rgba(255,31,142,0.3)] z-10 transition-shadow duration-200"
          style={{
            cursor: isCenterInteractive ? "pointer" : "default",
            ...(isCenterInteractive && centerHovered ? {
              boxShadow: "0 0 40px 8px rgba(255,31,142,0.5)",
              borderColor: "rgba(255,31,142,0.9)",
            } : {}),
          }}
        >
          {/* LogoMark */}
          <div ref={logoRef} className="absolute inset-0 flex items-center justify-center">
            <LogoMark size={56} className="w-[32px] md:w-[56px] h-auto" />
          </div>

          {/* Industry icons — GSAP-controlled per index */}
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div key={`center-icon-${i}`} ref={el => { centerIconsRef.current[i] = el; }} className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-[28px] md:w-[44px] h-[28px] md:h-[44px] text-white" strokeWidth={1.3} />
              </div>
            );
          })}

          {/* Handshake icon — GSAP-controlled, appears in CTA state */}
          <div ref={ctaHandshakeRef} className="absolute inset-0 flex items-center justify-center">
            <Handshake className="w-[28px] md:w-[44px] h-[28px] md:h-[44px] text-white" strokeWidth={1.3} />
          </div>

          {/* Back arrow — selected industry state hover */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)", borderRadius: "50%", opacity: isSelected && !ctaActive && centerHovered ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
            <ArrowLeft size={28} color="white" strokeWidth={1.5} />
          </div>

          {/* Scroll indicator — CTA state hover */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", borderRadius: "50%", opacity: ctaActive && centerHovered ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
            <ChevronDown size={28} color="white" strokeWidth={1.5} style={{ animation: ctaActive && centerHovered ? "ctaBounce 1.1s ease-in-out infinite" : "none" }} />
          </div>
        </div>

      </div>{/* end apparatus */}

      {/* ── Full-viewport panel overlay — sits outside the maxWidth apparatus so panels
           can use the full half-screen width. Position is relative to the section wrapper
           (100vh, flex-centered) so vertical center matches the apparatus center. ── */}
      {INDUSTRIES.map((ind, i) => (
        <div key={`panels-${i}`} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 8 }}>

          {/* Left panel — Market Expertise */}
          <div
            ref={el => { leftPanelRefs.current[i] = el; }}
            className="absolute left-[5%] right-[5%] top-[75px] bottom-[calc(50%+40px)] md:left-[3%] md:right-[calc(50%+90px)] md:top-0 md:bottom-0 flex flex-col justify-end md:justify-center pr-0 md:pr-10 pointer-events-none"
          >
            {/* Panel header */}
            <div className="mb-4 md:mb-6">
              <span className="text-[0.6rem] md:text-[0.72rem] tracking-[0.28em] text-[var(--pink)] uppercase font-medium block mb-2 md:mb-2.5">
                Market Expertise
              </span>
              <h3 className="text-[1.35rem] md:text-[2rem] font-light text-white m-0 mb-2 md:mb-3 leading-tight line-clamp-2">
                {ind.name} Market Knowledge
              </h3>
              <p className="text-[0.8rem] md:text-[0.95rem] font-light leading-[1.6] text-white/50 m-0 line-clamp-3">
                Hands-on positioning and strategic insight developed through direct engagement in the Greek and regional market.
              </p>
            </div>

            {/* List items — ServicePanel style */}
            <ul className="list-none p-0 m-0 overflow-y-auto pr-2 md:pr-0 md:overflow-visible min-h-[50px]">
              {INDUSTRY_CONTENT[i].expertise.map((item, j) => (
                <li
                  key={j}
                  className="flex items-center gap-3 px-2 md:px-4 py-2 md:py-3.5 -mb-px border-t border-b border-[#ff1f8e]/20 text-[0.85rem] md:text-[1.1rem] font-light leading-snug text-white/75"
                >
                  <ChevronRight className="w-[14px] md:w-[17px] h-auto text-[var(--pink)] shrink-0" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right panel — Key Connections */}
          <div
            ref={el => { rightPanelRefs.current[i] = el; }}
            className="absolute left-[5%] right-[5%] top-[calc(50%+40px)] bottom-[5%] md:left-[calc(50%+90px)] md:right-[3%] md:top-0 md:bottom-0 flex flex-col justify-start md:justify-center pl-0 md:pl-10 pointer-events-none"
          >
            {/* Panel header */}
            <div className="mb-4 md:mb-6">
              <span className="text-[0.6rem] md:text-[0.72rem] tracking-[0.28em] text-[var(--pink)] uppercase font-medium block mb-2 md:mb-2.5">
                Key Connections
              </span>
              <h3 className="text-[1.35rem] md:text-[2rem] font-light text-white m-0 mb-2 md:mb-3 leading-tight line-clamp-2">
                Operational Network
              </h3>
              <p className="text-[0.8rem] md:text-[0.95rem] font-light leading-[1.6] text-white/50 m-0 line-clamp-2">
                Established relationships with the institutions and businesses that drive decisions in this sector.
              </p>
            </div>

            {/* List items — ServicePanel style */}
            <ul className="list-none p-0 m-0 overflow-y-auto pr-2 md:pr-0 md:overflow-visible min-h-[50px]">
              {INDUSTRY_CONTENT[i].connections.map((item, j) => (
                <li
                  key={j}
                  className="flex items-center gap-3 px-2 md:px-4 py-2 md:py-3.5 -mb-px border-t border-b border-[#ff1f8e]/20 text-[0.85rem] md:text-[1.1rem] font-light leading-snug text-white/75"
                >
                  <Network className="w-[14px] md:w-[17px] h-auto text-[var(--pink)] shrink-0" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      ))}

      {/* ── CTA full-viewport overlay ── */}
      <style>{`
        @keyframes ctaBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }
        .cta-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,31,142,0.25); border-radius: 6px;
          padding: 11px 14px; color: white; font-size: 0.95rem; font-weight: 300;
          outline: none; transition: border-color 0.2s, background 0.2s;
          font-family: inherit;
        }
        .cta-input::placeholder { color: rgba(255,255,255,0.3); }
        .cta-input:focus { border-color: rgba(255,31,142,0.7); background: rgba(255,31,142,0.04); }
        .cta-input option { background: #1a0a12; color: white; }
      `}</style>

      {/* CTA panels — only mounted when needed so they never block underlying interaction */}
      {ctaMounted && <>
      <div
        ref={ctaPanelLeftRef}
        className="absolute left-[5%] right-[5%] top-[75px] bottom-[calc(50%+40px)] md:left-[3%] md:right-[calc(50%+90px)] md:top-0 md:bottom-0 flex flex-col justify-end md:justify-center pr-0 md:pr-10 z-[8] pointer-events-auto"
      >
        <span className="text-[0.55rem] md:text-[0.72rem] tracking-[0.28em] text-[var(--pink)] uppercase font-medium block mb-1 md:mb-2 text-center md:text-left">
          Market Context
        </span>
        <h2 className="text-[1.35rem] md:text-[clamp(1.8rem,3vw,2.6rem)] font-light text-white m-0 mb-1 md:mb-2.5 leading-tight whitespace-nowrap text-center md:text-left">
          The Window Is Open
        </h2>
        <p className="text-[0.75rem] md:text-[0.95rem] font-light leading-[1.5] text-white/50 m-0 mb-2 md:mb-8 text-center md:text-left line-clamp-3">
          Greece is attracting record foreign investment. The companies entering now are claiming the positions that matter.
        </p>

        {/* Metric counters */}
        <div className="grid grid-cols-2 gap-2 md:gap-5 mb-3 md:mb-10">
          {METRICS.map((m, i) => (
            <div key={i} className="border-t border-[#ff1f8e]/20 pt-1.5 md:pt-4">
              <div className="text-[1.2rem] md:text-[clamp(1.8rem,2.8vw,2.4rem)] font-extralight text-white leading-none mb-0.5 md:mb-1 text-center md:text-left">
                <span ref={el => { metricCounterRefs.current[i] = el; }}>{m.prefix}0{m.suffix}</span>
              </div>
              <div className="text-[0.5rem] md:text-[0.75rem] tracking-[0.1em] text-[var(--pink)] uppercase font-medium mb-1 text-center md:text-left">{m.label}</div>
              <div className="text-[0.65rem] md:text-[0.8rem] font-light text-white/40 leading-[1.4] text-center md:text-left hidden md:block">{m.sublabel}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-row gap-2 md:gap-4 pointer-events-auto">
          <button
            className="flex-1 flex items-center justify-center py-2 px-0 md:p-3 bg-[var(--pink)] text-white text-[0.6rem] md:text-[0.8rem] tracking-[0.08em] md:tracking-[0.12em] uppercase font-medium rounded border-none cursor-pointer duration-200"
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            onClick={() => {
              setFormType("Appointment Booking");
              lenisRef.current?.scrollTo(document.body.scrollHeight, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
            }}
          >
            Direct Contact
          </button>
          <button
            className="flex-1 py-2 px-0 md:p-3 bg-transparent border border-[#ff1f8e]/45 text-white/85 text-[0.55rem] md:text-[0.8rem] tracking-[0.05em] md:tracking-[0.12em] uppercase font-normal rounded cursor-pointer transition-colors duration-200"
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.9)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.45)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onClick={() => {
              setFormType("Capabilities Deck");
              gsap.fromTo(ctaPanelLeftRef.current, { opacity: 1 }, { opacity: 0.2, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.inOut" });
              gsap.fromTo(ctaPanelRightRef.current, { background: "transparent" }, { background: "rgba(255,31,142,0.1)", duration: 0.28, yoyo: true, repeat: 1, ease: "power2.inOut" });
            }}
          >
            Capabilities Deck
          </button>
        </div>
      </div>

      {/* Right panel — contact form */}
      <div
        ref={ctaPanelRightRef}
        className="absolute left-[5%] right-[5%] top-[calc(50%+40px)] bottom-[2%] md:left-[calc(50%+90px)] md:right-[3%] md:top-0 md:bottom-0 flex flex-col justify-start md:justify-center pl-0 md:pl-10 z-[8] pointer-events-auto overflow-y-auto md:overflow-visible mix-blend-normal"
      >
        <div className="hidden md:block">
          <span className="text-[0.72rem] tracking-[0.28em] text-[var(--pink)] uppercase font-medium block mb-2">Get in Touch</span>
          <h3 className="text-[clamp(1.4rem,2vw,1.8rem)] font-light text-white m-0 mb-2">Start the Conversation</h3>
          <p className="text-[0.88rem] font-light text-white/45 m-0 mb-6 leading-[1.6]">Tell us about your expansion goals and we'll be in touch within 24 hours.</p>
        </div>

        {/* Submission type toggle */}
        <div className="flex mb-3 md:mb-6 border border-[#ff1f8e]/25 rounded-md overflow-hidden shrink-0">
          {(["Appointment Booking", "Message", "Capabilities Deck"] as FormType[]).map(t => (
            <button
              key={t}
              onClick={() => setFormType(t)}
              className="flex-1 py-1.5 px-0.5 md:py-2 md:px-1 text-[0.55rem] md:text-[0.7rem] tracking-[0.04em] md:tracking-[0.08em] uppercase font-normal border-none cursor-pointer transition-colors duration-200 leading-tight"
              style={{
                background: formType === t ? "rgba(255,31,142,0.15)" : "transparent",
                color: formType === t ? "white" : "rgba(255,255,255,0.45)",
                borderRight: t !== "Capabilities Deck" ? "1px solid rgba(255,31,142,0.25)" : "none",
              }}
            >
              {t === "Capabilities Deck" ? "Deck" : t === "Appointment Booking" ? "Call" : "Message"}
            </button>
          ))}
        </div>

        {formSent ? (
          <div className="text-center py-8">
            <div className="text-[2rem] mb-3 text-[var(--pink)]">✓</div>
            <p className="text-white text-[0.95rem] font-light">Thank you — we'll be in touch shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (formType === "Appointment Booking") { setCalendarOpen(true); return; }
              setSubmitting(true);
              setFormError(null);
              try {
                const result = await sendContactEmail({ formType, ...formData });
                if (!result.ok) {
                  setFormError(result.error ?? "Something went wrong. Please try again.");
                  return;
                }
                setFormSent(true);
                setTimeout(() => {
                  setFormSent(false);
                  setFormData({ name: "", company: "", email: "", phone: "", service: "" });
                }, 3000);
              } catch {
                setFormError("Network error. Please check your connection and try again.");
              } finally {
                setSubmitting(false);
              }
            }}
            className="flex flex-col gap-2.5 md:gap-3.5"
          >
            <div className="grid grid-cols-2 gap-2.5 md:gap-3.5">
              <input className="cta-input" placeholder="Full Name" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              <input className="cta-input" placeholder="Company" required value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:gap-3.5">
              <input className="cta-input" type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
              <input className="cta-input" type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <select className="cta-input" required value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
              <option value="">Service Sector</option>
              {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 md:mt-2 py-2.5 md:py-3 bg-[var(--pink)] text-white text-[0.7rem] md:text-[0.8rem] tracking-[0.14em] uppercase font-medium border-none rounded cursor-pointer transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-85"
            >
              {submitting ? "Sending…" : formType === "Appointment Booking" ? "Select Time →" : formType === "Capabilities Deck" ? "Request Deck →" : "Send Message →"}
            </button>
            {formError && <p className="m-0 mt-1 text-[0.75rem] text-red-400 font-light">{formError}</p>}
          </form>
        )}
      </div>

      {/* ── Company Info scroll indicator ── */}
      <div style={{
        position: "absolute",
        bottom: "1.75rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3rem",
        opacity: ctaActive ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }}>
        <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>
          Company Info
        </span>
        <ChevronDown
          size={13}
          color="rgba(255,255,255,0.25)"
          strokeWidth={1.5}
          style={{ animation: ctaActive ? "ctaBounce 1.4s ease-in-out infinite" : "none" }}
        />
      </div>

      {/* ── Calendar modal ── */}
      {calendarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
          onClick={() => setCalendarOpen(false)}
        >
          <div
            style={{ background: "var(--dark)", border: "1px solid rgba(255,31,142,0.25)", borderRadius: "14px", padding: "2rem 2rem 1.75rem", maxWidth: "420px", width: "90%", position: "relative" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setCalendarOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px", lineHeight: 0 }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.28em", color: "var(--pink)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Discovery Call</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 300, color: "white", margin: "0 0 1.5rem" }}>Schedule a Meeting</h3>
            <AppointmentCalendar onClose={() => setCalendarOpen(false)} />
          </div>
        </div>
      )}
      </>}
    </div>
  );
}
