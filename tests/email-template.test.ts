import { describe, expect, it } from "vitest";
import { EMAIL_LOGO_CID, renderContactEmail, type ContactEmail } from "@/lib/email-template";

const base: ContactEmail = {
  locale: "en",
  siteName: "Ahmad Marzouk",
  siteUrl: "https://example.com",
  name: "Sara",
  email: "sara@example.com",
  phone: "+966 50 123 4567",
  rows: [{ label: "What do you want to build?", values: ["Online store", "Dashboard"], kind: "choice" }],
  message: "Hello",
  sentAt: "24 Nov 2026",
  copy: {
    eyebrow: "New project inquiry",
    intro: "Sent you a message.",
    details: "Details",
    message: "Message",
    replyEmail: "Reply by email",
    replyWhatsapp: "Reply on WhatsApp",
    footer: "Footer",
    dashboard: "Open in dashboard",
  },
};

describe("renderContactEmail", () => {
  it("escapes everything the visitor typed", () => {
    const html = renderContactEmail({ ...base, name: "<b>x</b>", message: '<script>alert("x")</script>' });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("shows each picked option, reply links and the inline logo", () => {
    const html = renderContactEmail(base);
    expect(html).toContain("Online store");
    expect(html).toContain("Dashboard");
    expect(html).toContain("mailto:sara@example.com");
    expect(html).toContain("https://wa.me/966501234567");
    expect(html).toContain(`cid:${EMAIL_LOGO_CID}`);
  });

  it("lays Arabic out right to left", () => {
    const html = renderContactEmail({ ...base, locale: "ar" });
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("border-right:3px solid");
  });
});
