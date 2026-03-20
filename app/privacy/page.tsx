"use client";

import Header from "@/components/Header";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Who We Are",
    body: `IntelliAGTech Μονοπροσωπη ΙΚΕ ("IntelliAgTech", "we", "us", or "our") is a market-entry and commercial representation advisory firm registered in Greece under business registry number ΓΕΜΗ 190197803000, with its registered office at Grammou 71, Marousi 151 24, Greece. We act as the data controller for personal data collected through this website and in the course of providing our services.`,
  },
  {
    title: "2. What Data We Collect",
    body: `We collect information you provide directly to us, including: full name and job title; company name and legal registration details; business email address and telephone number; the nature of your enquiry or service interest; and any additional information you voluntarily include in correspondence. We also collect limited technical data automatically, such as IP address, browser type, pages visited, and session duration, solely for website security and performance purposes.`,
  },
  {
    title: "3. How We Use Your Data",
    body: `We use your personal data to respond to enquiries and to provide the advisory, representation, and operational services you have requested; to send you information about our services that may be of legitimate professional interest; to fulfil our contractual obligations and to comply with applicable legal requirements; and to maintain the security and integrity of our systems. We do not use your data for automated decision-making or profiling.`,
  },
  {
    title: "4. Legal Basis for Processing",
    body: `Our processing of your personal data relies on the following legal bases under the General Data Protection Regulation (EU 2016/679): performance of a contract or pre-contractual steps at your request; our legitimate interests in conducting and growing our business, provided those interests are not overridden by your rights and freedoms; compliance with a legal obligation; and, where required, your explicit consent.`,
  },
  {
    title: "5. Data Sharing",
    body: `We do not sell, rent, or trade your personal data. We may share information with trusted service providers who assist us in operating our website and delivering services (such as cloud hosting and communication platforms), and only to the extent necessary for those purposes. All third-party processors are contractually bound to handle data in accordance with applicable data protection law. We may also disclose data where required by law, court order, or regulatory authority.`,
  },
  {
    title: "6. International Transfers",
    body: `Where personal data is transferred outside the European Economic Area, we ensure that appropriate safeguards are in place — such as Standard Contractual Clauses approved by the European Commission — to maintain an equivalent level of protection to that afforded within the EEA.`,
  },
  {
    title: "7. Retention",
    body: `We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. In practice, data relating to client engagements is retained for seven years following the conclusion of a matter in accordance with Greek commercial law obligations. Data submitted through our contact form that does not result in an engagement is retained for no longer than twelve months.`,
  },
  {
    title: "8. Your Rights",
    body: `Under the GDPR you have the right to access the personal data we hold about you; to request correction of inaccurate or incomplete data; to request erasure where data is no longer necessary or processing is unlawful; to object to processing based on legitimate interests; to request restriction of processing in certain circumstances; and to data portability where processing is based on consent or contract. To exercise any of these rights, please contact us at hello@iagt.com. You also have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).`,
  },
  {
    title: "9. Cookies",
    body: `This website uses cookies and similar technologies. For full details of the cookies we set and your choices regarding them, please refer to our Cookie Policy.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in law or our data practices. Material changes will be notified by updating the "Last updated" date below. Continued use of our website after such changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "11. Contact",
    body: `If you have any questions about this Privacy Policy or our data practices, please contact our designated privacy point of contact at: hello@iagt.com or in writing to IntelliAGTech Μονοπροσωπη ΙΚΕ, Grammou 71, Marousi 151 24, Athens, Greece.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header rightLabel="Home" rightHref="/" />
      <div style={{ minHeight: "100vh", background: "var(--dark)", paddingTop: 64 }}>
        <div style={{ padding: "6vh 8% 10vh" }}>

          {/* ── Header block ── */}
          <div style={{ marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--pink)", textTransform: "uppercase", fontWeight: 500 }}>
              Legal
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "white", margin: "0.6rem 0 0.5rem", lineHeight: 1.1 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 300, margin: 0 }}>
              Last updated: 1 January 2025 &nbsp;·&nbsp; IntelliAGTech Μονοπροσωπη ΙΚΕ &nbsp;·&nbsp; ΓΕΜΗ 190197803000
            </p>
            <div style={{ width: 48, height: 1, background: "rgba(255,31,142,0.4)", marginTop: "1.5rem" }} />
          </div>

          {/* ── Intro ── */}
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: "3.5rem" }}>
            IntelliAgTech is committed to protecting the privacy and security of the personal data entrusted to us. This Privacy Policy explains what data we collect, how we use it, and what rights you have in relation to it. Please read it carefully.
          </p>

          {/* ── Sections ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3.25rem" }}>
            {SECTIONS.map(s => (
              <div key={s.title} style={{ borderTop: "1px solid rgba(255,31,142,0.12)", paddingTop: "1.75rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 500, color: "white", letterSpacing: "0.01em", margin: "0 0 1.1rem" }}>
                  {s.title}
                </h2>
                <p style={{ fontSize: "1.15rem", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* ── Footer nav ── */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,31,142,0.12)", flexWrap: "wrap" }}>
            {[
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy",    href: "/cookies" },
              { label: "GDPR Request",     href: "/gdpr" },
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
