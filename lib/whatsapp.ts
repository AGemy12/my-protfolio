import "server-only";

type Notice = { name: string; email: string; whatsapp: string; subject?: string; message: string };

/** wa.me chat link for a stored WhatsApp number. */
export const waLink = (number: string) => `https://wa.me/${number.replace(/\D/g, "")}`;

/**
 * Sends a WhatsApp message to the site owner via CallMeBot (free).
 * No-op unless CALLMEBOT_PHONE and CALLMEBOT_APIKEY are set. Never throws.
 */
export async function notifyWhatsApp({ name, email, whatsapp, subject, message }: Notice) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;

  const text = [
    "📩 *رسالة جديدة من البورتفوليو*",
    `👤 ${name}`,
    `📱 ${whatsapp}`,
    `✉️ ${email}`,
    subject ? `📌 ${subject}` : null,
    "",
    message.length > 1200 ? `${message.slice(0, 1200)}…` : message,
    "",
    `💬 للرد: ${waLink(whatsapp)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);

  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!res.ok) console.error("[whatsapp]", res.status, await res.text());
  } catch (error) {
    console.error("[whatsapp]", error);
  }
}
