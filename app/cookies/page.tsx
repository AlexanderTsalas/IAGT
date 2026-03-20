"use client";

import Header from "@/components/Header";
import Link from "next/link";

const COOKIE_TABLE = [
  {
    name: "__session",
    type: "Essential",
    provider: "iagt.com",
    purpose: "Maintains your session state across page requests.",
    duration: "Session",
  },
  {
    name: "_csrf",
    type: "Essential",
    provider: "iagt.com",
    purpose: "Protects against cross-site request forgery attacks on form submissions.",
    duration: "Session",
  },
  {
    name: "_ga",
    type: "Analytics",
    provider: "Google LLC",
    purpose: "Registers a unique ID used to generate statistical data on website usage.",
    duration: "2 years",
  },
  {
    name: "_ga_*",
    type: "Analytics",
    provider: "Google LLC",
    purpose: "Used by Google Analytics to persist session state.",
    duration: "2 years",
  },
  {
    name: "iagt_cookie_consent",
    type: "Preference",
    provider: "iagt.com",
    purpose: "Stores your cookie consent preferences so you are not asked again on return visits.",
    duration: "12 months",
  },
];

const SECTIONS = [
  {
    title: "1. What Are Cookies",
    body: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, to remember your preferences, and to provide information to site operators. Cookies do not contain executable code and cannot transmit viruses. Similar technologies such as web beacons and local storage may be used for analogous purposes and are covered by this policy.`,
  },
  {
    title: "2. Cookies We Use",
    body: `We use the categories of cookies described in the table above. Essential cookies are necessary for the website to function and cannot be switched off without affecting core functionality. Analytics cookies help us understand how visitors interact with the Site so we can improve it. Preference cookies remember choices you make to improve your experience.`,
  },
  {
    title: "3. Third-Party Cookies",
    body: `Some cookies are set by third-party services that appear on our pages. Google Analytics is used to measure website traffic and usage patterns; data collected is processed in accordance with Google's privacy policy. We do not currently use social-media cookies, advertising cookies, or retargeting technologies on this Site.`,
  },
  {
    title: "4. Your Choices",
    body: `You can control and delete cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or alert you before a cookie is set. Note that disabling cookies may affect the functionality of the Site. You may also opt out of Google Analytics tracking across all websites by installing the Google Analytics Opt-out Browser Add-on available at tools.google.com/dlpage/gaoptout.`,
  },
  {
    title: "5. Cookie Consent",
    body: `On your first visit to the Site we will request your consent for non-essential cookies. You may withdraw your consent at any time by adjusting your browser settings or by contacting us directly. Withdrawing consent does not affect the lawfulness of any processing carried out before withdrawal.`,
  },
  {
    title: "6. Updates to This Policy",
    body: `We may update this Cookie Policy as new technologies are deployed or regulatory requirements change. Please review this page periodically. Material changes will be reflected in the "Last updated" date below.`,
  },
  {
    title: "7. Contact",
    body: `If you have any questions about our use of cookies, please contact us at hello@iagt.com.`,
  },
];

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 300, margin: 0 }}>
              Last updated: 1 January 2025 &nbsp;·&nbsp; IntelliAGTech Μονοπροσωπη ΙΚΕ &nbsp;·&nbsp; ΓΕΜΗ 190197803000
            </p>
            <div style={{ width: 48, height: 1, background: "rgba(255,31,142,0.4)", marginTop: "1.5rem" }} />
          </div>

          {/* ── Intro ── */}
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.85, color: "rgba(255,255,255,0.55)", marginBottom: "3.5rem" }}>
            This Cookie Policy explains how IntelliAGTech Μονοπροσωπη ΙΚΕ uses cookies and similar tracking technologies on this website, and what choices you have in relation to them.
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

          {/* ── Cookie table ── */}
          <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,31,142,0.12)", paddingTop: "2rem" }}>
            <h2 style={{ fontSize: "0.88rem", fontWeight: 500, color: "white", letterSpacing: "0.04em", margin: "0 0 1.25rem" }}>
              Cookie Inventory
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", fontWeight: 300 }}>
                <thead>
                  <tr>
                    {["Name", "Type", "Provider", "Purpose", "Duration"].map(h => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left", padding: "0.6rem 0.85rem",
                          borderBottom: "1px solid rgba(255,31,142,0.2)",
                          color: "rgba(255,31,142,0.8)", fontSize: "0.65rem",
                          letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COOKIE_TABLE.map((row, i) => (
                    <tr
                      key={row.name}
                      style={{ background: i % 2 === 0 ? "rgba(255,31,142,0.02)" : "transparent" }}
                    >
                      <td style={{ padding: "0.7rem 0.85rem", color: "white", fontFamily: "monospace", fontSize: "0.78rem", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{row.name}</td>
                      <td style={{ padding: "0.7rem 0.85rem", color: "var(--pink)", fontSize: "0.72rem", letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{row.type}</td>
                      <td style={{ padding: "0.7rem 0.85rem", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{row.provider}</td>
                      <td style={{ padding: "0.7rem 0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.purpose}</td>
                      <td style={{ padding: "0.7rem 0.85rem", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer nav ── */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,31,142,0.12)", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy",   href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
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
