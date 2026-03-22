"use client";

import { useState, useRef, forwardRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { services } from "@/lib/services";

export const LogoMark = ({ size, style, className }: { size: number; style?: React.CSSProperties; className?: string }) => (
  <svg className={className} viewBox="0 0 237.33 201.29" width={size} height={size * (201.29 / 237.33)} fill="var(--pink)" aria-label="IntelliAgTech logo" style={{ display: "block", ...style }}>
    <g transform="translate(239.05078,59.818358)">
      <path d="m -239.05078,-59.818359 v 41.322265 41.322266 l 58.99414,59.005859 c 0,0 39.04288,39.627959 58.99414,59.005859 0.21891,0.21262 0.66602,0.62891 0.66602,0.62891 0,0 0.44854,-0.41614 0.66796,-0.62891 19.966757,-19.36127 59.003911,-58.99414 59.003911,-58.99414 L -1.71875,22.849609 V -18.484375 -59.818359 L -61.050781,-0.49609375 -120.38477,58.826172 -179.71875,-0.49609375 Z m 226.679686,26.599609 c -0.0033,0.41138 -0.008,1.062064 -0.01367,2.056641 -0.02515,4.401472 0,24.3417965 0,24.3417965 V 17.521484 l -37.009765,36.992188 -37.007813,36.990234 -0.683593,0.675781 -0.685547,-0.675781 -12.296878,-12.349609 -12.29883,-12.347656 48.998051,-48.984375 c 0,0 32.781798,-32.540609 48.998047,-48.984375 0.640118,-0.649098 1.874621,-1.926799 2,-2.056641 z m -216.013676,0.06055 50.08204,50.082031 50.08203,50.083984 -12.16016,11.914063 c -4.48173,4.03845 -8.25879,7.503285 -14.01758,12.587891 L -191.39258,54.498047 -228.38477,17.486328 V -7.8359375 Z m 108,108.048828 12.66797,12.615234 12.666019,12.613278 -12.306639,12.35938 c 0,0 -8.2015,8.2438 -12.3086,12.35937 -0.23934,0.23983 -0.71875,0.71875 -0.71875,0.71875 0,0 -0.4792,-0.47866 -0.71875,-0.71875 -4.10647,-4.11577 -12.30859,-12.35937 -12.30859,-12.35937 l -12.30664,-12.35938 12.66602,-12.613278 z" />
    </g>
  </svg>
);

const serviceNumbers = ["01", "02", "03", "04", "05", "06"];

interface HeaderProps {
  rightLabel?: string;
  rightHref?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ rightLabel = "Get in Touch", rightHref = "/contact" }, ref) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      setMounted(true);
      
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize(); // trigger on mount
      window.addEventListener("resize", handleResize);

      if (mobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      
      return () => {
        window.removeEventListener("resize", handleResize);
        document.body.style.overflow = "";
      };
    }, [mobileMenuOpen]);

    const openDropdown  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropdownOpen(true); };
    const closeDropdown = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 120); };

    return (
      <header
        ref={ref}
        className="fixed top-0 left-0 right-0 z-[100] h-[64px] flex items-center justify-between"
        style={{
          background: "rgba(17,17,19,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingLeft: "max(24px, 5vw)",
          paddingRight: "max(24px, 5vw)",
        }}
      >
        {/* DESKTOP LEFT — Navigation */}
        <div className="hidden md:flex flex-1 max-w-[30%] items-center justify-start">
          <nav className="flex items-center gap-8">
            <div style={{ position: "relative" }} onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <button
                style={{
                  background: "none", border: "none", padding: 0,
                  color: dropdownOpen ? "white" : "rgba(255,255,255,0.55)",
                  fontSize: "0.8rem", letterSpacing: "0.08em",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: "5px",
                  transition: "color 0.2s ease",
                }}
              >
                Services
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", opacity: 0.6 }}>
                  <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Dropdown panel */}
              <div
                style={{
                  position: "absolute", top: "calc(100% + 18px)", left: "-1.25rem", width: "280px",
                  background: "rgba(17,17,19,0.97)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px", padding: "0.5rem 0", boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  opacity: dropdownOpen ? 1 : 0, pointerEvents: dropdownOpen ? "auto" : "none",
                  transform: dropdownOpen ? "translateY(0)" : "translateY(-6px)", transition: "opacity 0.18s ease, transform 0.18s ease",
                }}
              >
                {services.map((s, i) => (
                  <Link
                    key={s.id} href={`/services/${s.id}`} onClick={closeDropdown}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.85rem",
                      padding: "0.65rem 1.1rem", textDecoration: "none",
                      borderBottom: i < services.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,31,142,0.06)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span style={{ color: "rgba(255,31,142,0.55)", fontSize: "0.6rem", letterSpacing: "0.15em", flexShrink: 0 }}>{serviceNumbers[i]}</span>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.35 }}>{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/news"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", letterSpacing: "0.08em", textDecoration: "none", transition: "color 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              Market News
            </Link>
          </nav>
        </div>

        {/* LOGO — Scalable & Truncating */}
        <div className="flex flex-1 justify-start md:w-1/3 md:justify-center items-center min-w-0 pr-4 md:pr-0">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline min-w-0"
            onClick={e => {
              if (typeof window !== "undefined" && window.location.pathname === "/" && !window.location.search) {
                e.preventDefault();
                window.location.href = "/";
              }
            }}
          >
            <LogoMark size={24} style={{ flexShrink: 0 }} />
            <span className="text-white text-[0.65rem] md:text-[0.88rem] font-medium tracking-[0.12em] md:tracking-[0.22em] truncate">
              INTELLIAGTECH
            </span>
          </Link>
        </div>

        {/* RIGHT — CTA & Mobile Toggle */}
        <div className="flex flex-1 md:w-1/3 justify-end items-center gap-4 shrink-0 md:pr-0">
          <div className="hidden md:block">
            <Link
              href={rightHref}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,31,142,0.5)",
                color: "var(--pink)",
                padding: "8px 20px",
                fontSize: "0.78rem", letterSpacing: "0.08em",
                borderRadius: "4px", cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap", textDecoration: "none", display: "inline-block",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,31,142,0.1)"; e.currentTarget.style.borderColor = "var(--pink)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,31,142,0.5)"; }}
            >
              {rightLabel}
            </Link>
          </div>
          
          {mounted && isMobile && (
            <button 
              style={{ 
                display: "flex", 
                flexDirection: "column",
                justifyContent: "space-between",
                width: "24px", 
                height: "16px", 
                background: "transparent", 
                border: "none", 
                cursor: "pointer",
                flexShrink: 0,
                zIndex: 9999
              }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle Navigation"
            >
              <div style={{ width: "100%", height: "2px", backgroundColor: "white", borderRadius: "2px" }} />
              <div style={{ width: "100%", height: "2px", backgroundColor: "white", borderRadius: "2px" }} />
              <div style={{ width: "100%", height: "2px", backgroundColor: "white", borderRadius: "2px" }} />
            </button>
          )}
        </div>

        {/* MOBILE MENU DRAWER (PORTALED) */}
        {mounted && createPortal(
          <>
            <div 
              className={`md:hidden fixed inset-0 bg-[#111113]/80 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
              style={{ zIndex: 200 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <div 
              className="md:hidden fixed top-0 right-0 w-[85vw] max-w-[360px] h-full bg-[#111113] border-l border-white/5 flex flex-col py-24 px-8 gap-8 shadow-2xl overflow-y-auto"
              style={{ 
                zIndex: 201,
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                aria-label="Close mobile menu"
              >
                <div style={{ position: "relative", width: "24px", height: "24px" }}>
                  <div style={{ position: "absolute", top: "11px", left: 0, width: "100%", height: "2px", backgroundColor: "white", transform: "rotate(45deg)" }} />
                  <div style={{ position: "absolute", top: "11px", left: 0, width: "100%", height: "2px", backgroundColor: "white", transform: "rotate(-45deg)" }} />
                </div>
              </button>

              <Link href="/news" onClick={() => setMobileMenuOpen(false)} style={{ color: "white", fontSize: "1.2rem", letterSpacing: "0.1em", textDecoration: "none" }}>Market News</Link>
              <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", letterSpacing: "0.2em", marginBottom: "-0.5rem" }}>SERVICES</h3>
              {services.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", textDecoration: "none" }}
                >
                  {s.title}
                </Link>
              ))}
              <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.1)", marginTop: "0.5rem" }} />
              <Link href={rightHref} onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--pink)", fontSize: "1rem", letterSpacing: "0.1em", textDecoration: "none", border: "1px solid var(--pink)", padding: "12px 32px", borderRadius: "4px", marginTop: "auto", textAlign: "center" }}>
                {rightLabel}
              </Link>
            </div>
          </>,
          document.body
        )}
      </header>
    );
  }
);

Header.displayName = "Header";
export default Header;
