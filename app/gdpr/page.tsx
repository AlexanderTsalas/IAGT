"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

const REQUEST_TYPES = [
  { id: "access",      label: "Right of Access",       desc: "Receive a copy of the personal data we hold about you." },
  { id: "rectify",     label: "Right to Rectification", desc: "Correct inaccurate or incomplete data." },
  { id: "erase",       label: "Right to Erasure",       desc: "Request deletion of your personal data where no longer necessary." },
  { id: "restrict",    label: "Right to Restriction",   desc: "Limit how we process your data in certain circumstances." },
  { id: "portability", label: "Right to Portability",   desc: "Receive your data in a structured, machine-readable format." },
  { id: "object",      label: "Right to Object",        desc: "Object to processing based on legitimate interests." },
];

const SECTIONS = [
  {
    title: "Your Rights Under the GDPR",
    body: `The General Data Protection Regulation (EU 2016/679) grants you a set of rights over the personal data we hold about you. You may exercise any of these rights free of charge. We will respond to your request within 30 calendar days of receipt. Where a request is complex or numerous, we may extend this period by a further two months and will notify you accordingly.`,
  },
  {
    title: "How We Verify Your Identity",
    body: `To protect your privacy and prevent unauthorised access to your data, we are required to verify your identity before processing any data subject request. We may ask you to provide confirmation of your name, email address, or other details we already hold on file. We will not share data with any person who cannot be reasonably verified as the data subject.`,
  },
  {
    title: "Exemptions and Limitations",
    body: `Certain rights are subject to exemptions. For example, the right to erasure does not apply where we are required to retain data to comply with a legal obligation or to establish, exercise, or defend legal claims. Where an exemption applies, we will explain the reasons in our response. The right to data portability applies only to data processed by automated means on the basis of consent or contract.`,
  },
  {
    title: "Complaints",
    body: `If you are dissatisfied with our response to your request, or believe that we are processing your personal data in a way that does not comply with applicable data protection law, you have the right to lodge a complaint with the Hellenic Data Protection Authority (HDPA) at www.dpa.gr, or with the supervisory authority in your country of residence within the European Economic Area.`,
  },
];

export default function GdprPage() {
  const [selected, setSelected]   = useState<string>("");
  const [formData, setFormData]   = useState({ name: "", email: "", details: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <style>{`
        .gdpr-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,31,142,0.25); border-radius: 6px;
          padding: 11px 14px; color: white; font-size: 0.9rem; font-weight: 300;
          outline: none; transition: border-color 0.2s, background 0.2s;
          font-family: inherit; box-sizing: border-box;
        }
        .gdpr-input::placeholder { color: rgba(255,255,255,0.3); }
        .gdpr-input:focus { border-color: rgba(255,31,142,0.7); background: rgba(255,31,142,0.04); }
        .request-card {
          border: 1px solid rgba(255,31,142,0.14); border-radius: 7px;
          padding: 1rem 1.1rem; cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .request-card:hover   { border-color: rgba(255,31,142,0.35); background: rgba(255,31,142,0.03); }
        .request-card.active  { border-color: rgba(255,31,142,0.55); background: rgba(255,31,142,0.07); }
      `}</style>

      <Header rightLabel="Home" rightHref="/" />
      <div style={{ minHeight: "100vh", background: "var(--dark)", paddingTop: 64 }}>
        <div style={{ padding: "6vh 8% 10vh" }}>

          {/* ── Header block ── */}
          <div style={{ marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>
              Legal
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "white", margin: "0.6rem 0 0.5rem", lineHeight: 1.1 }}>
              GDPR Data Request
            </h1>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 300, margin: 0 }}>
              Last updated: 1 January 2025 &nbsp;·&nbsp; IntelliAGTech Μονοπροσωπη ΙΚΕ &nbsp;·&nbsp; ΓΕΜΗ 190197803000
            </p>
            <div style={{ width: 48, height: 1, background: "rgba(255,31,142,0.4)", marginTop: "1.5rem" }} />
          </div>

          {/* ── Intro ── */}
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: "3.5rem" }}>
            Use this form to submit a data subject rights request under the General Data Protection Regulation. We take every request seriously and will respond within the statutory 30-day period. For enquiries of a general nature, please use our <Link href="/contact" style={{ color: "var(--pink)", textDecoration: "none" }}>contact page</Link>.
          </p>

          {/* ── Two-column layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "start" }}>

            {/* Left — info sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {SECTIONS.map(s => (
                <div key={s.title} style={{ borderTop: "1px solid rgba(255,31,142,0.12)", paddingTop: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 500, color: "white", letterSpacing: "0.01em", margin: "0 0 1.1rem" }}>
                    {s.title}
                  </h2>
                  <p style={{ fontSize: "1.1rem", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Right — request form */}
            <div>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: "1.1rem" }}>
                Submit a Request
              </span>

              {submitted ? (
                <div style={{ padding: "2.5rem 0", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
                  <p style={{ color: "white", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.65 }}>
                    Your request has been received. We will respond to the email address provided within 30 days.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setSelected(""); setFormData({ name: "", email: "", details: "" }); }}
                    style={{ marginTop: "1.5rem", background: "none", border: "1px solid rgba(255,31,142,0.35)", color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", letterSpacing: "0.1em", padding: "9px 20px", borderRadius: 5, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {/* Request type */}
                  <div>
                    <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "0.65rem" }}>
                      Request Type
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {REQUEST_TYPES.map(r => (
                        <div
                          key={r.id}
                          className={`request-card${selected === r.id ? " active" : ""}`}
                          onClick={() => setSelected(r.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                            <div style={{
                              width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                              border: `1px solid ${selected === r.id ? "var(--pink)" : "rgba(255,31,142,0.35)"}`,
                              background: selected === r.id ? "var(--pink)" : "transparent",
                              transition: "all 0.15s ease",
                            }} />
                            <span style={{ fontSize: "0.8rem", fontWeight: 400, color: selected === r.id ? "white" : "rgba(255,255,255,0.7)" }}>
                              {r.label}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.75rem", fontWeight: 300, color: "rgba(255,255,255,0.38)", margin: "0 0 0 1.4rem", lineHeight: 1.5 }}>
                            {r.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <input
                    className="gdpr-input"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                  <input
                    className="gdpr-input"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  />
                  <textarea
                    className="gdpr-input"
                    placeholder="Additional details (optional) — e.g. the specific data or time period concerned"
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
                    style={{ resize: "vertical" }}
                  />

                  <button
                    type="submit"
                    disabled={!selected}
                    style={{
                      padding: "13px 0", background: selected ? "var(--pink)" : "rgba(255,31,142,0.15)",
                      color: selected ? "white" : "rgba(255,255,255,0.35)",
                      fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase",
                      fontWeight: 500, border: "none", borderRadius: 5,
                      cursor: selected ? "pointer" : "not-allowed",
                      transition: "background 0.2s, color 0.2s", fontFamily: "inherit",
                    }}
                  >
                    Submit Request →
                  </button>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                    Alternatively, submit your request in writing to hello@iagt.com or by post to Grammou 71, Marousi 151 24, Athens, Greece.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ── Footer nav ── */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,31,142,0.12)", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy",   href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy",    href: "/cookies" },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label} →
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
