"use client";

import { useRef, useEffect } from "react";
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

interface ServicePanelProps {
  service: Service;
  isActive: boolean;
  index: number;
  activeBullet: number | null;
  onBulletHover: (index: number | null) => void;
}

export default function ServicePanel({ service, isActive, index, activeBullet, onBulletHover }: ServicePanelProps) {
  const panelRef   = useRef<HTMLDivElement>(null);
  const prevActive = useRef(false);

  useEffect(() => {
    if (!panelRef.current) return;
    if (isActive && !prevActive.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.15 }
      );
    } else if (!isActive && prevActive.current) {
      gsap.to(panelRef.current, { opacity: 0, x: -20, duration: 0.35, ease: "power2.in" });
    }
    prevActive.current = isActive;
  }, [isActive]);

  const icons   = BULLET_ICONS[service.id] ?? [];
  const bullets_ = bullets[service.id] ?? [];

  return (
    <div
      ref={panelRef}
      style={{
        opacity: 0,
        width: "44%",
        maxWidth: "600px",
        marginLeft: "6%",
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      {/* Counter (with divider beneath) + Title side by side */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <span style={{ color: "var(--pink)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, lineHeight: 1.2 }}>
            {serviceNumbers[index]}
          </span>
          <div style={{ width: "32px", height: "1px", background: "rgba(255,31,142,0.35)", marginTop: "0.5rem" }} />
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "white", lineHeight: 1.2, margin: 0 }}>
          {service.title}
        </h2>
      </div>

      {/* Description */}
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.925rem", lineHeight: 1.75, fontWeight: 300, margin: "0 0 1.25rem" }}>
        {descriptions[service.id] ?? service.fullDescription}
      </p>

      {/* Bullet list — styled containers */}
      <ul
        style={{ listStyle: "none", padding: 0, margin: "0 0 2rem" }}
        onMouseLeave={() => onBulletHover(null)}
      >
        {bullets_.map((b, i) => {
          const Icon = icons[i];
          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "0.9rem 1.1rem",
                marginBottom: "-1px",
                borderTop: "1px solid rgba(255,31,142,0.2)",
                borderBottom: "1px solid rgba(255,31,142,0.2)",
                background: activeBullet === i ? "rgba(255,31,142,0.06)" : "transparent",
                color: activeBullet === i ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.72)",
                fontSize: "1.05rem",
                lineHeight: 1.5,
                cursor: "default",
                transition: "background 0.18s ease, color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,31,142,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.96)";
                onBulletHover(i);
              }}
              onMouseLeave={(e) => {
                // Only reset if not externally highlighted by a map box hover
                if (activeBullet !== i) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.72)";
                }
              }}
            >
              {Icon && <Icon size={18} color="var(--pink)" strokeWidth={1.5} style={{ flexShrink: 0 }} />}
              {b}
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <button
        style={{
          background: "transparent",
          border: "1px solid rgba(255,31,142,0.4)",
          color: "var(--pink)",
          padding: "10px 24px",
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "all 0.2s ease",
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
      </button>
    </div>
  );
}
