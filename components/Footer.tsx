"use client";

import Link from "next/link";
import { LogoMark } from "./Header";

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] border-t border-[#ff1f8e]/15 py-12 md:py-16 px-6 md:px-[5%] flex flex-col md:flex-row justify-center items-start gap-14 md:gap-8 w-full overflow-hidden shrink-0">
      
      {/* ── Left — brand + contact ── */}
      <div className="flex flex-col items-center text-center w-full md:flex-1 gap-2 md:gap-3">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <LogoMark size={26} className="w-[26px] h-[26px]" />
          <span className="text-white text-[0.88rem] font-medium tracking-[0.22em]">
            INTELLIAGTECH
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 md:gap-2">
          <a
            href="mailto:hello@iagt.com"
            className="text-white/45 text-[0.8rem] font-light no-underline tracking-[0.02em] transition-colors duration-200 hover:text-white"
          >
            hello@iagt.com
          </a>
          <a
            href="tel:+302102603751"
            className="text-white/45 text-[0.8rem] font-light no-underline tracking-[0.02em] transition-colors duration-200 hover:text-white"
          >
            +30 210 260 3751
          </a>
          <span className="text-white/35 text-[0.8rem] font-light leading-[1.6] mt-1">
            Grammou 71, Marousi 151 24, Greece
            <br />
            BCO Business Center Offices
          </span>
        </div>
      </div>

      {/* ── Center — legal links ── */}
      <div className="flex flex-col items-center text-center w-full md:flex-1 gap-2">
        <span className="text-[0.62rem] tracking-[0.22em] text-white/25 uppercase mb-1 md:mb-2">
          Legal
        </span>
        {[
          { label: "Privacy Policy",      href: "/privacy" },
          { label: "Terms of Service",    href: "/terms" },
          { label: "Cookie Policy",       href: "/cookies" },
          { label: "GDPR Data Request",   href: "/gdpr" },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white/40 text-[0.78rem] font-light no-underline tracking-[0.03em] transition-colors duration-200 py-0.5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* ── Right — registry ── */}
      <div className="flex flex-col items-center text-center w-full md:flex-1 gap-1.5">
        <span className="text-[0.62rem] tracking-[0.22em] text-white/25 uppercase mb-1 md:mb-2">
          Company
        </span>
        <span className="text-white/70 text-[0.82rem] font-normal tracking-[0.03em]">
          IntelliAGTech Μονοπρόσωπη ΙΚΕ
        </span>
        <span className="text-white/40 text-[0.78rem] font-light mt-0.5">
          Business Registry No.
        </span>
        <span className="text-white/60 text-[0.82rem] font-normal tracking-[0.06em]">
          ΓΕΜΗ 190197803000
        </span>
        <span className="text-white/25 text-[0.72rem] font-light mt-4">
          © {new Date().getFullYear()} IntelliAgTech. All rights reserved.
        </span>
        <span className="text-white/25 text-[0.72rem] font-light mt-0.5">
          Developed and Maintained by{" "}
          <a
            href="https://distarter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pink)] no-underline transition-opacity duration-200 hover:opacity-75"
          >
            Distarter
          </a>
        </span>
      </div>

    </footer>
  );
}
