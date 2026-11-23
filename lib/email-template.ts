// The contact email, in the site's look: warm paper background, white card,
// ember-orange accents, the "Stack A" mark. Built for Gmail: tables and inline
// styles only (no <style> it would strip, no SVG it would block), everything
// the visitor typed escaped.

export const EMAIL_LOGO_CID = "logo@portfolio";

const C = {
  paper: "#f5f3ef",
  card: "#ffffff",
  line: "#e8e2d9",
  ink: "#2b2622",
  text: "#4a443c",
  muted: "#7a7166",
  brand: "#e34d00",
  brandSoft: "#fdeee6",
  brandInk: "#b93f00",
  dark: "#1d1a17",
  quote: "#faf8f5",
};

const FONT = "'Readex Pro',-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

export type EmailRow = {
  label: string;
  /** One entry per picked option for choices, a single entry otherwise. */
  values: string[];
  kind: "text" | "email" | "phone" | "choice";
};

export type EmailCopy = {
  eyebrow: string;
  intro: string;
  details: string;
  message: string;
  replyEmail: string;
  replyWhatsapp: string;
  footer: string;
  dashboard: string;
};

export type ContactEmail = {
  locale: string;
  siteName: string;
  siteUrl: string;
  name: string;
  email?: string;
  /** E.164, e.g. "+201001234567", for the WhatsApp reply button. */
  phone?: string;
  rows: EmailRow[];
  message: string;
  sentAt: string;
  copy: EmailCopy;
};

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Escaped text with line breaks kept. */
const multiline = (s: string) => escapeHtml(s).replace(/\r?\n/g, "<br>");

/** `end` is "left" or "right": Gmail ignores logical margins, so the gap side is spelled out. */
function rowValue(row: EmailRow, end: string) {
  const link = `color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.line}`;
  switch (row.kind) {
    case "choice":
      return row.values
        .map(
          (v) =>
            `<span style="display:inline-block;margin:0 0 6px;margin-${end}:6px;padding:4px 12px;border-radius:999px;background:${C.brandSoft};color:${C.brandInk};font-size:13px;line-height:18px;font-weight:500">${escapeHtml(v)}</span>`,
        )
        .join("");
    case "email":
      return `<a href="mailto:${escapeHtml(row.values[0])}" dir="ltr" style="${link}">${escapeHtml(row.values[0])}</a>`;
    case "phone":
      return `<a href="https://wa.me/${row.values[0].replace(/\D/g, "")}" dir="ltr" style="${link};font-family:${MONO};font-size:14px">${escapeHtml(row.values[0])}</a>`;
    default:
      return multiline(row.values[0] ?? "");
  }
}

function button(href: string, label: string, primary: boolean, end: string) {
  const style = primary
    ? `background:${C.dark};color:#ffffff;border:1px solid ${C.dark}`
    : `background:${C.card};color:${C.ink};border:1px solid ${C.line}`;
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 0 8px;margin-${end}:8px;padding:12px 22px;border-radius:999px;${style};font-size:14px;font-weight:600;line-height:20px;text-decoration:none">${escapeHtml(label)}</a>`;
}

export function renderContactEmail(e: ContactEmail) {
  const rtl = e.locale === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const start = rtl ? "right" : "left";
  const end = rtl ? "left" : "right";
  const preview = e.message.replace(/\s+/g, " ").slice(0, 110);

  const details = e.rows.length
    ? `
      <tr><td style="padding:28px 32px 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};font-weight:600">${escapeHtml(e.copy.details)}</td></tr>
      <tr><td style="padding:0 32px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${e.rows
            .map(
              (row, i) => `
          <tr>
            <td valign="top" width="36%" style="padding:12px 0;${i ? `border-top:1px solid ${C.line};` : ""}padding-${end}:16px;font-size:13px;line-height:20px;color:${C.muted}">${escapeHtml(row.label)}</td>
            <td valign="top" style="padding:12px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-size:15px;line-height:22px;color:${C.ink}">${rowValue(row, end)}</td>
          </tr>`,
            )
            .join("")}
        </table>
      </td></tr>`
    : "";

  const message = e.message
    ? `
      <tr><td style="padding:24px 32px 8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};font-weight:600">${escapeHtml(e.copy.message)}</td></tr>
      <tr><td style="padding:0 32px">
        <div dir="auto" style="background:${C.quote};border-${start}:3px solid ${C.brand};border-radius:12px;padding:18px 20px;font-size:15px;line-height:26px;color:${C.text}">${multiline(e.message)}</div>
      </td></tr>`
    : "";

  const replies = [
    e.email ? button(`mailto:${e.email}`, e.copy.replyEmail, true, end) : "",
    e.phone ? button(`https://wa.me/${e.phone.replace(/\D/g, "")}`, e.copy.replyWhatsapp, !e.email, end) : "",
  ].join("");

  return `<!doctype html>
<html lang="${e.locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>${escapeHtml(e.copy.eyebrow)}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper}">${escapeHtml(preview)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}">
<tr><td align="center" style="padding:32px 16px">
  <table role="presentation" dir="${dir}" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:${FONT};text-align:${start}">

    <tr><td style="padding:0 4px 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td valign="middle" style="width:44px"><img src="cid:${EMAIL_LOGO_CID}" width="40" height="40" alt="" style="display:block;border:0;border-radius:10px"></td>
        <td valign="middle" style="padding-${start}:12px;font-size:16px;font-weight:700;color:${C.ink}">${escapeHtml(e.siteName)}</td>
        <td valign="middle" align="${end}" style="font-size:12px;color:${C.muted}">${escapeHtml(e.sentAt)}</td>
      </tr></table>
    </td></tr>

    <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:18px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <!-- rounded itself: Gmail ignores overflow:hidden on the card -->
        <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.brand};border-radius:17px 17px 0 0">&nbsp;</td></tr>
        <tr><td style="padding:30px 32px 0;font-size:13px;font-weight:600;color:${C.brand}">
          <span style="display:inline-block;width:18px;height:2px;background:${C.brand};vertical-align:middle;margin-${end}:8px"></span>${escapeHtml(e.copy.eyebrow)}
        </td></tr>
        <tr><td style="padding:10px 32px 0;font-size:28px;line-height:36px;font-weight:700;color:${C.ink}">${escapeHtml(e.name)}</td></tr>
        <tr><td style="padding:6px 32px 0;font-size:15px;line-height:24px;color:${C.muted}">${escapeHtml(e.copy.intro)}</td></tr>
        ${details}
        ${message}
        ${replies ? `<tr><td style="padding:26px 32px 22px">${replies}</td></tr>` : `<tr><td style="height:28px"></td></tr>`}
      </table>
    </td></tr>

    <tr><td align="center" style="padding:22px 24px 0;font-size:12px;line-height:20px;color:${C.muted};text-align:center">
      ${escapeHtml(e.copy.footer)}<br>
      <a href="${escapeHtml(e.siteUrl)}" style="color:${C.muted}">${escapeHtml(e.siteUrl.replace(/^https?:\/\//, ""))}</a>
      &nbsp;·&nbsp;
      <a href="${escapeHtml(`${e.siteUrl}/${e.locale}/admin/messages`)}" style="color:${C.brand};text-decoration:none;font-weight:600">${escapeHtml(e.copy.dashboard)}</a>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}
