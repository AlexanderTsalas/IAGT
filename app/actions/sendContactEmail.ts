"use server";

import nodemailer from "nodemailer";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ContactPayload {
  formType: "Appointment Booking" | "Message" | "Capabilities Deck";
  name: string;
  company: string;
  email: string;
  phone?: string;
  service: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/* ─── Email HTML template ────────────────────────────────────────────────── */

function buildEmailHtml(p: ContactPayload, submittedAt: string): string {
  const categoryColour: Record<ContactPayload["formType"], string> = {
    "Appointment Booking": "#10b981",
    "Message":             "#ff1f8e",
    "Capabilities Deck":   "#6366f1",
  };
  const colour = categoryColour[p.formType];

  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:10px 16px;font-size:13px;color:#9ca3af;white-space:nowrap;vertical-align:top;border-bottom:1px solid #1f2937;">${label}</td>
           <td style="padding:10px 16px;font-size:13px;color:#f9fafb;vertical-align:top;border-bottom:1px solid #1f2937;">${value}</td>
         </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <tr>
          <td style="background:#111113;border:1px solid #1f2937;border-bottom:none;border-radius:10px 10px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="margin:0 0 6px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${colour};font-weight:600;">IntelliAgTech · Contact Pipeline</p>
                <h1 style="margin:0;font-size:22px;font-weight:300;color:#ffffff;">New ${p.formType} Request</h1>
              </td>
              <td align="right" valign="top">
                <span style="display:inline-block;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;background:${colour}22;color:${colour};border:1px solid ${colour}55;">${p.formType}</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr><td style="background:${colour};height:2px;"></td></tr>

        <tr>
          <td style="background:#111113;border:1px solid #1f2937;border-top:none;border-bottom:none;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Full Name",  p.name)}
              ${row("Company",   p.company)}
              ${row("Email",     p.email)}
              ${row("Phone",     p.phone ?? "")}
              ${row("Service",   p.service)}
              ${row("Category",  p.formType)}
              ${row("Submitted", submittedAt)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#111113;border:1px solid #1f2937;border-top:1px solid #1f2937;border-bottom:none;padding:24px 32px;">
            <a href="mailto:${p.email}?subject=Re%3A%20Your%20${encodeURIComponent(p.formType)}%20Request%20%E2%80%94%20IntelliAgTech"
               style="display:inline-block;padding:11px 24px;background:${colour};color:#fff;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border-radius:5px;">
              Reply to ${p.name} →
            </a>
          </td>
        </tr>

        <tr>
          <td style="background:#0d0d10;border:1px solid #1f2937;border-top:1px solid #1f2937;border-radius:0 0 10px 10px;padding:20px 32px;">
            <p style="margin:0;font-size:11px;color:#4b5563;line-height:1.6;">
              Automated notification — IntelliAGTech Μονοπροσωπη ΙΚΕ · Grammou 71, Marousi 151 24 · ΓΕΜΗ 190197803000
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Server action ──────────────────────────────────────────────────────── */

export async function sendContactEmail(payload: ContactPayload): Promise<ActionResult> {
  // Basic server-side validation
  if (!payload.name || !payload.email || !payload.company || !payload.service) {
    return { ok: false, error: "Missing required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "Invalid email address." };
  }

  const smtpHost  = process.env.SMTP_HOST;
  const smtpPort  = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser  = process.env.SMTP_USER;
  const smtpPass  = process.env.SMTP_PASS;
  const notifyTo  = process.env.NOTIFICATION_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !notifyTo) {
    console.error("Missing SMTP environment variables.");
    return { ok: false, error: "Server configuration error." };
  }

  const transporter = nodemailer.createTransport({
    host:   smtpHost,
    port:   smtpPort,
    secure: smtpPort === 465,
    auth:   { user: smtpUser, pass: smtpPass },
  });

  const submittedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
    timeZone: "Europe/Athens",
  });

  const subjectPrefix: Record<ContactPayload["formType"], string> = {
    "Appointment Booking": "📅 Appointment Request",
    "Message":             "✉️ New Message",
    "Capabilities Deck":   "📄 Capabilities Deck Request",
  };

  try {
    await transporter.sendMail({
      from:     `"IntelliAgTech Contact" <${smtpUser}>`,
      to:       notifyTo.split(",").map(e => e.trim()),
      replyTo:  payload.email,
      subject:  `${subjectPrefix[payload.formType]}: ${payload.name} — ${payload.company}`,
      html:     buildEmailHtml(payload, submittedAt),
    });

    return { ok: true };
  } catch (err) {
    console.error("SMTP send error:", err);
    return { ok: false, error: "Failed to send notification. Please try again." };
  }
}
