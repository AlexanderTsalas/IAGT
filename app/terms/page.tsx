"use client";

import Header from "@/components/Header";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the IntelliAgTech website (the "Site") or engaging our advisory and representation services, you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any part of these Terms, you must not use the Site or our services. These Terms constitute the entire agreement between you and IntelliAGTech Μονοπροσωπη ΙΚΕ ("IntelliAgTech", "we", "us") with respect to your use of the Site.`,
  },
  {
    title: "2. Services Description",
    body: `IntelliAgTech provides market-entry intelligence, commercial representation, operational setup coordination, regulatory navigation, local operations management, and business development services for international companies seeking to establish or expand their presence in Greece, the Balkans, and South-East Europe. All service engagements are governed by separate written agreements. Nothing on the Site constitutes a binding offer to provide any specific service.`,
  },
  {
    title: "3. Intellectual Property",
    body: `All content on the Site — including text, graphics, logos, data, analyses, and software — is the exclusive property of IntelliAgTech or its licensors and is protected by Greek and international copyright, trademark, and intellectual property law. You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any Site content without our prior written consent. You may share links to the Site and reproduce brief extracts for non-commercial informational purposes, provided that appropriate attribution is given.`,
  },
  {
    title: "4. No Professional Advice",
    body: `The information published on the Site is provided for general informational purposes only. It does not constitute and should not be construed as legal, financial, tax, investment, or regulatory advice. You should seek independent professional advice tailored to your specific circumstances before making any business, legal, or financial decision. IntelliAgTech accepts no liability for any reliance placed on general information presented on the Site.`,
  },
  {
    title: "5. Disclaimer of Warranties",
    body: `The Site and its content are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. IntelliAgTech does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. We reserve the right to modify, suspend, or discontinue the Site at any time without notice.`,
  },
  {
    title: "6. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, IntelliAgTech and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from or in connection with your use of the Site or its content. Our total aggregate liability for any direct damages shall not exceed €100. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability; in such cases, the foregoing limitations apply to the maximum extent permitted.`,
  },
  {
    title: "7. Third-Party Links",
    body: `The Site may contain links to third-party websites. These links are provided for your convenience only. IntelliAgTech has no control over the content or practices of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them. The inclusion of any link does not imply our endorsement of the linked site.`,
  },
  {
    title: "8. User Conduct",
    body: `When using the Site or contacting us, you agree not to: transmit any unlawful, harmful, threatening, or defamatory material; attempt to gain unauthorised access to any part of the Site or its underlying systems; use automated tools to scrape, crawl, or data-mine the Site; impersonate any person or entity; or interfere with the proper operation of the Site in any way. We reserve the right to restrict or terminate access for users who violate these obligations.`,
  },
  {
    title: "9. Governing Law and Jurisdiction",
    body: `These Terms are governed by and construed in accordance with the laws of the Hellenic Republic. Any dispute arising out of or in connection with these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of Athens, Greece, without prejudice to any mandatory consumer protection provisions that may apply in your country of residence.`,
  },
  {
    title: "10. Changes to These Terms",
    body: `IntelliAgTech reserves the right to amend these Terms at any time. Amended Terms will be posted on this page with an updated effective date. Your continued use of the Site following any amendment constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.`,
  },
  {
    title: "11. Contact",
    body: `For any questions regarding these Terms, please contact us at hello@iagt.com or write to IntelliAGTech Μονοπροσωπη ΙΚΕ, Grammou 71, Marousi 151 24, Athens, Greece.`,
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 300, margin: 0 }}>
              Last updated: 1 January 2025 &nbsp;·&nbsp; IntelliAGTech Μονοπροσωπη ΙΚΕ &nbsp;·&nbsp; ΓΕΜΗ 190197803000
            </p>
            <div style={{ width: 48, height: 1, background: "rgba(255,31,142,0.4)", marginTop: "1.5rem" }} />
          </div>

          {/* ── Intro ── */}
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: "3.5rem" }}>
            Please read these Terms of Service carefully before using the IntelliAgTech website or engaging our services. These Terms govern the relationship between you and IntelliAGTech Μονοπροσωπη ΙΚΕ and set out your rights and obligations.
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
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Cookie Policy",  href: "/cookies" },
              { label: "GDPR Request",   href: "/gdpr" },
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
