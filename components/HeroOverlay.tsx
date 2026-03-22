"use client";

interface HeroOverlayProps {
  onScrollToServices: () => void;
}

export default function HeroOverlay({ onScrollToServices }: HeroOverlayProps) {
    return (
      <div
        className="absolute inset-0 z-10 flex flex-col items-start justify-end pointer-events-none pr-[6%] md:pr-[50%]"
        style={{
          paddingTop: "64px",
          paddingBottom: "10vh",
          paddingLeft: "6%",
        }}
      >
        {/* Headline */}
        <div className="pointer-events-auto" style={{ marginBottom: "0.75rem" }}>
          <h1
            className="text-white font-light leading-tight mt-8 md:mt-0"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", maxWidth: "600px", marginBottom: "1rem" }}
          >
            Your operational gateway to{" "}
            <span style={{ color: "var(--pink)" }}>
              Greece &amp; Southeast Europe
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              fontWeight: 300,
            }}
          >
            We don&apos;t just advise &mdash; we execute.
          </p>
        </div>

        {/* Single CTA */}
        <div className="mt-8 pointer-events-auto">
          <button
            style={{
              background: "transparent",
              color: "white",
              padding: "11px 28px",
              fontSize: "0.82rem",
              letterSpacing: "0.07em",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={onScrollToServices}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--pink)";
              e.currentTarget.style.color = "var(--pink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "white";
            }}
          >
            Explore Services ↓
          </button>
        </div>

        {/* Hint */}
        <p
          className="absolute bottom-8"
          style={{
            left: "6%",
            color: "rgba(255,255,255,0.18)",
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
          }}
        >
          HOVER A REGION TO EXPLORE
        </p>
      </div>
    );
}
