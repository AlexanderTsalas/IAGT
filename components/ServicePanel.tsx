"use client";

import { useRef, useLayoutEffect, forwardRef, useImperativeHandle } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { type Service } from "@/lib/services";
import { BULLET_ICONS } from "@/lib/mapPins";

const serviceNumbers = ["01", "02", "03", "04", "05", "06"];

const descriptions: Record<string, string> = {
  "market-entry":
    "Ground-level intelligence before you commit. We assess the opportunity, map competitors, and deliver a clear entry strategy so your first move in the market is the right one.",
  "commercial-rep":
    "Your local team, without building one. We represent your business on the ground — qualifying prospects, engaging decision-makers, and driving deals to close.",
  "operational-setup":
    "From entity formation to operational infrastructure, we handle the full setup so you can focus on running the business rather than building it from scratch.",
  "regulatory":
    "We coordinate with legal, tax, and compliance advisors and liaise directly with authorities — keeping your licensing and compliance on track without the friction.",
  "local-ops":
    "Ongoing operational management on your behalf. We oversee vendors, coordinate execution, and report directly to headquarters so nothing falls through the cracks.",
  "business-dev":
    "We identify opportunities and build the partnerships that fuel expansion — across Greece, the Balkans, and into the broader Southeast European and Middle Eastern markets.",
};

const bullets: Record<string, string[]> = {
  "market-entry": [
    "Market assessment & opportunity analysis",
    "Go-to-market strategy development",
    "Competitive landscape analysis",
    "Partner & channel identification",
  ],
  "commercial-rep": [
    "Acting as your local commercial representative",
    "Business development & sales support",
    "Customer identification & engagement",
    "Negotiation support & contract facilitation",
  ],
  "operational-setup": [
    "Local entity setup coordination",
    "Office & infrastructure coordination",
    "Vendor & supplier identification",
    "Operational process design",
  ],
  "regulatory": [
    "Coordination with legal, tax & regulatory advisors",
    "Licensing & compliance support",
    "Liaison with government authorities",
    "Regulatory risk assessment",
  ],
  "local-ops": [
    "Acting as local operational partner",
    "Management of local vendors & partners",
    "Project coordination & execution",
    "Reporting to parent company",
  ],
  "business-dev": [
    "Identification of new business opportunities",
    "Strategic partnership development",
    "Customer acquisition support",
    "Regional expansion: Balkans, SEE, Middle East",
  ],
};

export interface ServicePanelHandle {
  enter: (fromHero: boolean) => void;
  exit: () => void;
}

interface ServicePanelProps {
  service: Service;
  isActive: boolean;
  index: number;
  activeBullet: number | null;
  onBulletHover: (index: number | null) => void;
}

const ServicePanel = forwardRef<ServicePanelHandle, ServicePanelProps>(
  ({ service, isActive, index, activeBullet, onBulletHover }, ref) => {
    const router     = useRouter();
    const counterRef = useRef<HTMLDivElement>(null);
    const titleRef   = useRef<HTMLHeadingElement>(null);
    const descRef    = useRef<HTMLParagraphElement>(null);
    const itemRefs   = useRef<(HTMLLIElement | null)[]>([]);
    const ctaRef     = useRef<HTMLAnchorElement>(null);

    // Start every element hidden so the wrapper can be opacity:1 without flashing content.
    // useLayoutEffect fires before paint so children are invisible on the first frame.
    useLayoutEffect(() => {
      const els = [
        counterRef.current,
        titleRef.current,
        descRef.current,
        ...itemRefs.current,
        ctaRef.current,
      ].filter(Boolean);
      if (els.length) gsap.set(els, { opacity: 0, x: 0, y: 0 });
    }, []);

    useImperativeHandle(ref, () => ({
      // ── Entrance ────────────────────────────────────────────────────────────
      enter(fromHero: boolean) {
        const counter = counterRef.current;
        const title   = titleRef.current;
        const desc    = descRef.current;
        const items   = itemRefs.current.filter(Boolean) as HTMLElement[];
        const cta     = ctaRef.current;
        const all     = [counter, title, desc, ...items, cta].filter(Boolean) as HTMLElement[];

        gsap.killTweensOf(all);

        if (fromHero) {
          // Simple fade — no movement, just opacity
          gsap.fromTo(
            all,
            { opacity: 0, x: 0, y: 0 },
            { opacity: 1, duration: 0.28, stagger: 0.04, ease: "power2.out" },
          );
        } else {
          // Counter rolls in from below
          gsap.fromTo(
            counter,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.22, ease: "power3.out" },
          );
          // Title + description fade in
          gsap.fromTo(
            [title, desc].filter(Boolean),
            { opacity: 0 },
            { opacity: 1, duration: 0.22, ease: "power2.out", delay: 0.05 },
          );
          // List items + CTA stagger in from the left
          gsap.fromTo(
            [...items, cta].filter(Boolean),
            { x: -18, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.20, stagger: 0.05, ease: "power2.out", delay: 0.08 },
          );
        }
      },

      // ── Exit ────────────────────────────────────────────────────────────────
      exit() {
        const counter = counterRef.current;
        const title   = titleRef.current;
        const desc    = descRef.current;
        const items   = itemRefs.current.filter(Boolean) as HTMLElement[];
        const cta     = ctaRef.current;

        gsap.killTweensOf([counter, title, desc, ...items, cta].filter(Boolean));

        // Counter rolls up and out
        gsap.to(counter, { y: -14, opacity: 0, duration: 0.16, ease: "power2.in" });
        // Title + description fade out
        gsap.to([title, desc].filter(Boolean), { opacity: 0, duration: 0.16 });
        // List items + CTA domino out to the left
        gsap.to(
          [...items, cta].filter(Boolean),
          { x: -18, opacity: 0, duration: 0.15, stagger: 0.04, ease: "power2.in" },
        );
      },
    }));

    const icons    = BULLET_ICONS[service.id] ?? [];
    const bullets_ = bullets[service.id] ?? [];

    return (
      <div
        style={{
          width: "44%",
          maxWidth: "600px",
          marginLeft: "6%",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        {/* Counter (with divider beneath) + Title side by side */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
          <div ref={counterRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <span style={{ color: "var(--pink)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, lineHeight: 1.2 }}>
              {serviceNumbers[index]}
            </span>
            <div style={{ width: "32px", height: "1px", background: "rgba(255,31,142,0.35)", marginTop: "0.5rem" }} />
          </div>
          <h2 ref={titleRef} style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "white", lineHeight: 1.2, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {service.title}
          </h2>
        </div>

        {/* Description */}
        <p ref={descRef} style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.925rem", lineHeight: 1.75, fontWeight: 300, margin: "0 0 1.25rem" }}>
          {descriptions[service.id] ?? service.fullDescription}
        </p>

        {/* Bullet list */}
        <ul
          style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", pointerEvents: isActive ? "auto" : "none" }}
          onMouseLeave={() => onBulletHover(null)}
        >
          {bullets_.map((b, i) => {
            const Icon = icons[i];
            const hovered = activeBullet === i;
            return (
              <li
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "1.1rem 1.2rem",
                  marginBottom: "-1px",
                  borderTop: "1px solid rgba(255,31,142,0.2)",
                  borderBottom: "1px solid rgba(255,31,142,0.2)",
                  background: hovered ? "rgba(255,31,142,0.06)" : "transparent",
                  color: hovered ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.72)",
                  fontSize: "1.15rem",
                  lineHeight: 1.5,
                  cursor: "pointer",
                  transition: "background 0.18s ease, color 0.18s ease",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                onMouseEnter={() => onBulletHover(i)}
                onClick={() => router.push(`/services/${service.id}?item=${i}`)}
              >
                {Icon && <Icon size={22} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                <span style={{ flex: 1 }}>{b}</span>
                {/* Arrow — right end, rotates diagonally on hover */}
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{
                    flexShrink: 0,
                    transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    opacity: hovered ? 1 : 0.45,
                  }}
                >
                  <path d="M2 6h8M7 2l3 4-3 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link
          ref={ctaRef}
          href={`/services/${service.id}`}
          style={{
            display: "inline-block",
            background: "transparent",
            border: "1px solid rgba(255,31,142,0.4)",
            color: "var(--pink)",
            padding: "10px 24px",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
            pointerEvents: isActive ? "auto" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,31,142,0.1)";
            e.currentTarget.style.borderColor = "var(--pink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,31,142,0.4)";
          }}
        >
          LEARN MORE →
        </Link>
      </div>
    );
  }
);

ServicePanel.displayName = "ServicePanel";
export default ServicePanel;
