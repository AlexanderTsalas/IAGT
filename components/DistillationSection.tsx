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
import { LogoMark } from "./FlyingLogo";

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
  [ 72, 120],  // 1 – left-upper  (AI)
  [ 72, 480],  // 2 – left-lower  (Data Centers)
  [500, 578],  // 3 – bottom      (Infrastructure)
  [928, 480],  // 4 – right-lower (Energy)
  [928, 120],  // 5 – right-upper (Telecom)
];

const INDUSTRY_EDGES: { d: string; grad: string }[] = [
  // Technology — split around "In Six" text
  { d: `M 500 245 L 500 197`, grad: "url(#g-tech-lower)" },  // 0 center→below text
  { d: `M 500 173 L 500 64`,  grad: "url(#g-tech-upper)" },  // 1 above text→near node
  // Diagonals
  { d: `M 449 279 C 340 279, 190 150, 111 136`, grad: "url(#edgeGlow)" },  // 2 AI
  { d: `M 449 321 C 340 321, 190 450, 111 464`, grad: "url(#edgeGlow)" },  // 3 Data Centers
  // Infrastructure — split around "Industries" text
  { d: `M 500 355 L 500 403`, grad: "url(#g-infra-upper)" }, // 4 center→above text
  { d: `M 500 427 L 500 536`, grad: "url(#g-infra-lower)" }, // 5 below text→near node
  { d: `M 551 321 C 660 321, 810 450, 889 464`, grad: "url(#edgeGlow)" },  // 6 Energy
  { d: `M 551 279 C 660 279, 810 150, 889 136`, grad: "url(#edgeGlow)" },  // 7 Telecom
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
      lenis.scrollTo(lenis.scroll + rectTop, { immediate: true });
      lenis.stop();
      return;
    }

    // ② Upward re-engagement: step machine was complete, section crossing back into
    //    viewport from below (prevRectTop was negative, rectTop is crossing -2→0)
    if (stepRef.current === 5 && prevRectTop < -2 && rectTop >= -2) {
      lenis.scrollTo(lenis.scroll + rectTop, { immediate: true });
      lenis.stop();
      stepRef.current = 4;
      if (selectedCtaActiveRef.current) {
        // Came from the selectedIndustry→CTA path: tls[4] was never built.
        // handleBackClick handles full cleanup (handshake, icon, nodes) correctly.
        handleBackClick();
      } else {
        tls.current[4]?.reverse();
      }
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: `${vbW}px`,
          aspectRatio: `${vbW} / ${vbH}`,
          flexShrink: 0,
        }}
      >
        {/* ── SVG: hourglass + edges ── */}
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
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
              style={{
                position: "absolute",
                left: `${(SOURCE_X[i] / vbW) * 100}%`,
                top:  `${(SOURCE_Y   / vbH) * 100}%`,
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "12px", zIndex: 2,
                filter: "grayscale(100%) opacity(0.7)",
              }}
            >
              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={32} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2px", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>{card.top}</span>
                <span style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{card.sub}</span>
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
              style={{
                position: "absolute",
                left: `${(TARGET_X[i] / vbW) * 100}%`,
                top:  `${(TARGET_Y   / vbH) * 100}%`,
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "12px", zIndex: 3,
              }}
            >
              <div style={{
                width: "72px", height: "72px", borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(255,31,142,0.15) 0%, rgba(255,31,142,0.03) 100%)",
                border: "1px solid var(--pink)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(255,31,142,0.12)",
                backdropFilter: "blur(4px)", flexShrink: 0,
              }}>
                <Icon size={38} color="white" strokeWidth={1.5} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2px", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "1.35rem", fontWeight: 400, color: "white" }}>{card.top}</span>
                <span style={{ fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>{card.sub}</span>
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
              style={{
                position: "absolute",
                left: `${(nx / vbW) * 100}%`,
                top:  `${(ny / vbH) * 100}%`,
                transform: hoveredNode === i
                  ? "translate(-50%, -50%) scale(1.12)"
                  : "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "10px", zIndex: 4,
                cursor: "pointer",
                transition: "transform 0.22s ease",
              }}
            >
              <div style={{
                width: "76px", height: "76px", borderRadius: "50%",
                background: hoveredNode === i
                  ? "rgba(255,31,142,0.16)"
                  : "rgba(255,31,142,0.07)",
                border: hoveredNode === i
                  ? "1px solid rgba(255,31,142,0.8)"
                  : "1px solid rgba(255,31,142,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: hoveredNode === i
                  ? "0 0 36px rgba(255,31,142,0.5), inset 0 0 14px rgba(255,31,142,0.1)"
                  : "0 0 22px rgba(255,31,142,0.14)",
                transition: "background 0.22s, border 0.22s, box-shadow 0.22s",
              }}>
                <Icon size={34} color="white" strokeWidth={1.5} />
              </div>
              <span style={{
                fontSize: "0.75rem", letterSpacing: "0.18em",
                color: hoveredNode === i ? "white" : "rgba(255,255,255,0.65)",
                textTransform: "uppercase",
                fontWeight: 400, whiteSpace: "nowrap",
                transition: "color 0.22s",
              }}>
                {ind.name}
              </span>
            </div>
          );
        })}

        {/* ── TOP LABEL: four states ── */}
        <div ref={inSixRef} style={{ position: "absolute", left: "50%", top: `${(IN_SIX_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 5, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>In Six</span>
        </div>
        {/* State 2: industry name (selected, not hovering) */}
        <div style={{ position: "absolute", left: "50%", top: `${(IN_SIX_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 6, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: isSelected && !ctaActive && !centerHovered ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>{selectedIndustry !== null ? INDUSTRIES[selectedIndustry].name : ""}</span>
        </div>
        {/* State 3: Return (selected, hovering) */}
        <div style={{ position: "absolute", left: "50%", top: `${(IN_SIX_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 7, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: isSelected && !ctaActive && centerHovered ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>Return</span>
        </div>
        {/* State 4: "The Window" (CTA active) */}
        <div style={{ position: "absolute", left: "50%", top: `${(IN_SIX_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 8, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: ctaActive ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>The Window</span>
        </div>

        {/* ── BOTTOM LABEL: four states ── */}
        <div ref={industriesTextRef} style={{ position: "absolute", left: "50%", top: `${(INDUSTRIES_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 5, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>Industries</span>
        </div>
        {/* State 2: "Industry" (selected, not hovering) */}
        <div style={{ position: "absolute", left: "50%", top: `${(INDUSTRIES_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 6, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: isSelected && !ctaActive && !centerHovered ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>Industry</span>
        </div>
        {/* State 3: "View" (selected, hovering) */}
        <div style={{ position: "absolute", left: "50%", top: `${(INDUSTRIES_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 7, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: isSelected && !ctaActive && centerHovered ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>View</span>
        </div>
        {/* State 4: "Is Open" (CTA active) */}
        <div style={{ position: "absolute", left: "50%", top: `${(INDUSTRIES_Y / vbH) * 100}%`, transform: "translateX(-50%)", zIndex: 8, background: "var(--dark)", padding: "2px 14px", pointerEvents: "none", opacity: ctaActive ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.32em", color: "white", textTransform: "uppercase" }}>Is Open</span>
        </div>

        {/* ── Central Logo Circle ── */}
        <div
          ref={circleRef}
          onMouseEnter={() => { if (isCenterInteractive) setCenterHovered(true); }}
          onMouseLeave={() => setCenterHovered(false)}
          onClick={() => { if (isSelected && !ctaActive) handleBackClick(); }}
          style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: "110px", height: "110px", borderRadius: "50%",
            background: "var(--dark)",
            border: "2px solid rgba(255,31,142,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px 5px rgba(255,31,142,0.3)",
            zIndex: 10,
            cursor: isCenterInteractive ? "pointer" : "default",
            transition: "box-shadow 0.2s",
            ...(isCenterInteractive && centerHovered ? {
              boxShadow: "0 0 40px 8px rgba(255,31,142,0.5)",
              border: "2px solid rgba(255,31,142,0.9)",
            } : {}),
          }}
        >
          {/* LogoMark */}
          <div ref={logoRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={56} />
          </div>

          {/* Industry icons — GSAP-controlled per index */}
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div key={`center-icon-${i}`} ref={el => { centerIconsRef.current[i] = el; }} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={44} color="white" strokeWidth={1.3} />
              </div>
            );
          })}

          {/* Handshake icon — GSAP-controlled, appears in CTA state */}
          <div ref={ctaHandshakeRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Handshake size={44} color="white" strokeWidth={1.3} />
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
            style={{
              position: "absolute",
              left: "3%", right: "calc(50% + 90px)",
              top: 0, bottom: 0,
              display: "flex", flexDirection: "column", justifyContent: "center",
              paddingRight: "40px",
              pointerEvents: "none",
            }}
          >
            {/* Panel header */}
            <div style={{ marginBottom: "1.6rem" }}>
              <span style={{
                fontSize: "0.72rem", letterSpacing: "0.28em",
                color: "var(--pink)", textTransform: "uppercase", fontWeight: 500,
                display: "block", marginBottom: "0.65rem",
              }}>
                Market Expertise
              </span>
              <h3 style={{
                fontSize: "clamp(1.5rem, 2.2vw, 2rem)", fontWeight: 300,
                color: "white", margin: "0 0 0.8rem", lineHeight: 1.2,
              }}>
                {ind.name} Market Knowledge
              </h3>
              <p style={{
                fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.65,
                color: "rgba(255,255,255,0.5)", margin: 0,
              }}>
                Hands-on positioning and strategic insight developed through direct engagement in the Greek and regional market.
              </p>
            </div>

            {/* List items — ServicePanel style */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {INDUSTRY_CONTENT[i].expertise.map((item, j) => (
                <li
                  key={j}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "1.1rem 1rem",
                    marginBottom: "-1px",
                    borderTop: "1px solid rgba(255,31,142,0.2)",
                    borderBottom: "1px solid rgba(255,31,142,0.2)",
                    fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.5,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <ChevronRight size={17} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right panel — Key Connections */}
          <div
            ref={el => { rightPanelRefs.current[i] = el; }}
            style={{
              position: "absolute",
              left: "calc(50% + 90px)", right: "3%",
              top: 0, bottom: 0,
              display: "flex", flexDirection: "column", justifyContent: "center",
              paddingLeft: "40px",
              pointerEvents: "none",
            }}
          >
            {/* Panel header */}
            <div style={{ marginBottom: "1.6rem" }}>
              <span style={{
                fontSize: "0.72rem", letterSpacing: "0.28em",
                color: "var(--pink)", textTransform: "uppercase", fontWeight: 500,
                display: "block", marginBottom: "0.65rem",
              }}>
                Key Connections
              </span>
              <h3 style={{
                fontSize: "clamp(1.5rem, 2.2vw, 2rem)", fontWeight: 300,
                color: "white", margin: "0 0 0.8rem", lineHeight: 1.2,
              }}>
                Operational Network
              </h3>
              <p style={{
                fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.65,
                color: "rgba(255,255,255,0.5)", margin: 0,
              }}>
                Established relationships with the institutions and businesses that drive decisions in this sector.
              </p>
            </div>

            {/* List items — ServicePanel style */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {INDUSTRY_CONTENT[i].connections.map((item, j) => (
                <li
                  key={j}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "1.1rem 1rem",
                    marginBottom: "-1px",
                    borderTop: "1px solid rgba(255,31,142,0.2)",
                    borderBottom: "1px solid rgba(255,31,142,0.2)",
                    fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.5,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <Network size={17} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
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
        style={{
          position: "absolute",
          left: "3%", right: "calc(50% + 90px)",
          top: 0, bottom: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingRight: "40px", zIndex: 8, pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>Market Context</span>
        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 300, color: "white", margin: "0 0 0.6rem", lineHeight: 1.15, whiteSpace: "nowrap" }}>The Window Is Open</h2>
        <p style={{ fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: "0 0 2rem" }}>
          Greece is attracting record foreign investment. The companies entering now are claiming the positions that matter.
        </p>

        {/* Metric counters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "2.5rem" }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(255,31,142,0.2)", paddingTop: "1rem" }}>
              <div style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)", fontWeight: 200, color: "white", lineHeight: 1, marginBottom: "0.35rem" }}>
                <span ref={el => { metricCounterRefs.current[i] = el; }}>{m.prefix}0{m.suffix}</span>
              </div>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, marginBottom: "0.3rem" }}>{m.label}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{m.sublabel}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", pointerEvents: "auto" }}>
          <button
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "13px 0", background: "var(--pink)", color: "white", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, borderRadius: "5px", border: "none", cursor: "pointer", transition: "opacity 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            onClick={() => {
              setFormType("Appointment Booking");
              // Scroll to footer so phone + email are visible
              lenisRef.current?.scrollTo(document.body.scrollHeight, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
            }}
          >
            Direct Contact
          </button>
          <button
            style={{ flex: 1, padding: "13px 0", background: "transparent", border: "1px solid rgba(255,31,142,0.45)", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 400, borderRadius: "5px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.9)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,31,142,0.45)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onClick={() => {
              setFormType("Capabilities Deck");
              // Briefly dim left panel, then flash-highlight the right form panel
              gsap.fromTo(ctaPanelLeftRef.current,
                { opacity: 1 },
                { opacity: 0.2, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.inOut" },
              );
              gsap.fromTo(ctaPanelRightRef.current,
                { background: "transparent" },
                { background: "rgba(255,31,142,0.1)", duration: 0.28, yoyo: true, repeat: 1, ease: "power2.inOut" },
              );
            }}
          >
            Request Capabilities Deck
          </button>
        </div>
      </div>

      {/* Right panel — contact form */}
      <div
        ref={ctaPanelRightRef}
        style={{
          position: "absolute",
          left: "calc(50% + 90px)", right: "3%",
          top: 0, bottom: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: "40px", zIndex: 8, pointerEvents: "auto",
        }}
      >
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>Get in Touch</span>
        <h3 style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 300, color: "white", margin: "0 0 0.5rem" }}>Start the Conversation</h3>
        <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", margin: "0 0 1.6rem", lineHeight: 1.6 }}>Tell us about your expansion goals and we'll be in touch within 24 hours.</p>

        {/* Submission type toggle */}
        <div style={{ display: "flex", gap: "0", marginBottom: "1.4rem", border: "1px solid rgba(255,31,142,0.25)", borderRadius: "6px", overflow: "hidden" }}>
          {(["Appointment Booking", "Message", "Capabilities Deck"] as FormType[]).map(t => (
            <button
              key={t}
              onClick={() => setFormType(t)}
              style={{ flex: 1, padding: "9px 4px", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400, background: formType === t ? "rgba(255,31,142,0.15)" : "transparent", color: formType === t ? "white" : "rgba(255,255,255,0.45)", border: "none", borderRight: t !== "Capabilities Deck" ? "1px solid rgba(255,31,142,0.25)" : "none", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
            >
              {t}
            </button>
          ))}
        </div>

        {formSent ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
            <p style={{ color: "white", fontSize: "1rem", fontWeight: 300 }}>Thank you — we'll be in touch shortly.</p>
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
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <input className="cta-input" placeholder="Full Name" required value={formData.name}    onChange={e => setFormData(p => ({ ...p, name:    e.target.value }))} />
              <input className="cta-input" placeholder="Company Legal Name" required value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <input className="cta-input" type="email" placeholder="Email" required value={formData.email}   onChange={e => setFormData(p => ({ ...p, email:   e.target.value }))} />
              <input className="cta-input" type="tel"   placeholder="Phone (optional)" value={formData.phone}   onChange={e => setFormData(p => ({ ...p, phone:   e.target.value }))} />
            </div>
            <select className="cta-input" required value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
              <option value="">Service of Interest</option>
              {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="submit"
              disabled={submitting}
              style={{ marginTop: "0.4rem", padding: "13px 0", background: submitting ? "rgba(255,31,142,0.45)" : "var(--pink)", color: "white", fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", borderRadius: "5px", cursor: submitting ? "not-allowed" : "pointer", transition: "opacity 0.2s, background 0.2s", fontFamily: "inherit" }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {submitting ? "Sending…" : formType === "Appointment Booking" ? "Select a Time →" : formType === "Capabilities Deck" ? "Request Deck →" : "Send Message →"}
            </button>
            {formError && (
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#f87171", fontWeight: 300 }}>
                {formError}
              </p>
            )}
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
