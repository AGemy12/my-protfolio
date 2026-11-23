import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { EMAIL_LOGO_PNG } from "./email-logo";
import { EMAIL_LOGO_CID } from "./email-template";

/**
 * Contact messages sent from the site straight to your Gmail, through Gmail's
 * SMTP with an App Password (Google Account → Security → 2-Step Verification →
 * App passwords). Nothing opens on the visitor's side.
 */
const user = () => process.env.GMAIL_USER?.trim() ?? "";
const pass = () => (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""); // Google shows it as "abcd efgh ijkl mnop"

export const hasMailer = () => Boolean(user() && pass());

/** Where contact emails land: CONTACT_EMAIL_TO, or the Gmail account itself. */
export const mailbox = () => (hasMailer() ? process.env.CONTACT_EMAIL_TO?.trim() || user() : "");

let transport: Transporter | null = null;
const transporter = () =>
  (transport ??= nodemailer.createTransport({ service: "gmail", auth: { user: user(), pass: pass() } }));

export async function sendContactEmail({
  subject,
  html,
  plain,
  replyTo,
  name,
}: {
  subject: string;
  /** Full HTML document from renderContactEmail. */
  html: string;
  /** The same message as plain text, for clients that don't show HTML. */
  plain: string;
  replyTo?: string;
  name?: string;
}) {
  await transporter().sendMail({
    // Gmail only sends as the signed-in account; the visitor goes in the name and Reply-To.
    from: { name: name ? `${name} (Portfolio)` : "Portfolio contact", address: user() },
    to: mailbox(),
    replyTo: replyTo || undefined,
    subject,
    text: plain,
    html,
    // The logo travels with the email, so it shows without loading anything from the site.
    attachments: [
      {
        filename: "logo.png",
        content: Buffer.from(EMAIL_LOGO_PNG, "base64"),
        contentType: "image/png",
        cid: EMAIL_LOGO_CID,
      },
    ],
  });
}
