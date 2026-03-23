"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { X } from "lucide-react";
import Header from "@/components/Header";
import AppointmentCalendar from "@/components/AppointmentCalendar";

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

export default function ContactPage() {
  const [formType,     setFormType]     = useState<FormType>("Message");
  const [formData,     setFormData]     = useState({ name: "", company: "", email: "", phone: "", service: "" });
  const [formSent,     setFormSent]     = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Clear success timer on unmount
  useEffect(() => () => { if (successTimer.current) clearTimeout(successTimer.current); }, []);

  // Animate metric counters on mount
  useEffect(() => {
    METRICS.forEach((m, i) => {
      const el = metricRefs.current[i];
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: m.value,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.3 + i * 0.1,
        onUpdate: () => { el.textContent = m.prefix + Math.round(obj.val) + m.suffix; },
      });
    });
  }, []);

  return (
    <>
      <style>{`
        .contact-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,31,142,0.25); border-radius: 6px;
          padding: 11px 14px; color: white; font-size: 0.95rem; font-weight: 300;
          outline: none; transition: border-color 0.2s, background 0.2s;
          font-family: inherit; box-sizing: border-box;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.3); }
        .contact-input:focus { border-color: rgba(255,31,142,0.7); background: rgba(255,31,142,0.04); }
        .contact-input option { background: #1a0a12; color: white; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--dark)", display: "flex", flexDirection: "column" }}>

        <Header rightLabel="Home" rightHref="/" />

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col lg:flex-row items-stretch pt-[64px] min-h-screen">

          {/* ── Left panel — market context ── */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-[6%] lg:pl-[8%] py-12 lg:py-[5vh] border-b lg:border-b-0 lg:border-r border-[#ff1f8e]/10">
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
              Market Context
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: "white", margin: "0 0 0.75rem", lineHeight: 1.1, whiteSpace: "nowrap" }}>
              The Window Is Open
            </h1>
            <p style={{ fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: "0 0 2.5rem" }}>
              Greece is attracting record foreign investment. The companies entering now are claiming the positions that matter. We make that entry efficient, low-risk, and operational from day one.
            </p>

            {/* Metric grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.4rem] mb-[2.75rem]">
              {METRICS.map((m, i) => (
                <div key={i} className="border-t border-[#ff1f8e]/20 pt-[1rem]">
                  <div className="text-[clamp(1.8rem,2.8vw,2.4rem)] font-light text-white leading-none mb-[0.35rem]">
                    <span ref={el => { metricRefs.current[i] = el; }}>{m.prefix}0{m.suffix}</span>
                  </div>
                  <div className="text-[0.72rem] tracking-[0.1em] text-[var(--pink)] uppercase font-medium mb-[0.3rem]">
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 300, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
                    {m.sublabel}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:a.galani@intelliagtech.com"
                style={{ background: "var(--pink)", transition: "opacity 0.2s" }}
                className="flex-1 flex items-center justify-center py-[13px] text-white text-[0.78rem] tracking-[0.12em] uppercase font-medium rounded-[5px] no-underline hover:opacity-85"
              >
                Direct Contact
              </a>
              <a
                href="/capabilities-deck.pdf"
                style={{ background: "transparent", transition: "border-color 0.2s, color 0.2s" }}
                className="flex-1 flex items-center justify-center py-[13px] border border-[#ff1f8e]/45 text-white/85 text-[0.78rem] tracking-[0.12em] uppercase font-normal rounded-[5px] no-underline hover:border-[#ff1f8e]/90 hover:text-white"
              >
                Capabilities Deck
              </a>
            </div>
          </div>

          {/* ── Right panel — form ── */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-[8%] lg:pr-[6%] py-12 lg:py-[5vh]">
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.28em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
              Get in Touch
            </span>
            <h2 style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)", fontWeight: 300, color: "white", margin: "0 0 0.5rem" }}>
              Start the Conversation
            </h2>
            <p style={{ fontSize: "0.88rem", fontWeight: 300, color: "rgba(255,255,255,0.45)", margin: "0 0 1.75rem", lineHeight: 1.6 }}>
              Tell us about your expansion goals and we'll be in touch within 24 hours.
            </p>

            {/* Submission type toggle */}
            <div className="flex flex-col sm:flex-row mb-[1.4rem] border border-[#ff1f8e]/25 rounded-md overflow-hidden">
              {(["Appointment Booking", "Message", "Capabilities Deck"] as FormType[]).map((t, idx, arr) => (
                <button
                  key={t}
                  onClick={() => setFormType(t)}
                  style={{ background: formType === t ? "rgba(255,31,142,0.15)" : "transparent", color: formType === t ? "white" : "rgba(255,255,255,0.45)", fontFamily: "inherit" }}
                  className={`flex-1 py-[11px] px-2 text-[0.65rem] sm:text-[0.7rem] tracking-[0.08em] uppercase font-normal border-none cursor-pointer transition-colors duration-200 ${idx < arr.length - 1 ? "border-b sm:border-b-0 sm:border-r border-[#ff1f8e]/25" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {formSent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
                <p style={{ color: "white", fontSize: "1rem", fontWeight: 300 }}>Thank you — we'll be in touch shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (formType === "Appointment Booking") { setCalendarOpen(true); return; }
                  setFormSent(true);
                  if (successTimer.current) clearTimeout(successTimer.current);
                  successTimer.current = setTimeout(() => {
                    setFormSent(false);
                    setFormData({ name: "", company: "", email: "", phone: "", service: "" });
                  }, 3000);
                }}
                style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.85rem]">
                  <input className="contact-input" placeholder="Full Name" required value={formData.name}    onChange={e => setFormData(p => ({ ...p, name:    e.target.value }))} />
                  <input className="contact-input" placeholder="Company Legal Name" required value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.85rem]">
                  <input className="contact-input" type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  <input className="contact-input" type="tel" placeholder="Phone (optional)" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <select className="contact-input" required value={formData.service} onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}>
                  <option value="">Service of Interest</option>
                  {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="submit"
                  style={{ marginTop: "0.4rem", padding: "13px 0", background: "var(--pink)", color: "white", fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, border: "none", borderRadius: "5px", cursor: "pointer", transition: "opacity 0.2s", fontFamily: "inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {formType === "Appointment Booking" ? "Select a Time →" : formType === "Capabilities Deck" ? "Request Deck →" : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </main>
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
    </>
  );
}
