import "server-only";

/** wa.me chat link for a stored WhatsApp number. */
export const waLink = (number: string) => `https://wa.me/${number.replace(/\D/g, "")}`;

/**
 * Sends a WhatsApp message to the site owner via CallMeBot (free).
 * No-op unless CALLMEBOT_PHONE and CALLMEBOT_APIKEY are set. Never throws.
 */
export async function notifyWhatsApp({ text, replyTo }: { text: string; replyTo?: string }) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;

  const body = [
    "📩 *رسالة جديدة من البورتفوليو*",
    "",
    text.length > 1500 ? `${text.slice(0, 1500)}…` : text,
    replyTo ? `\n💬 للرد: ${waLink(replyTo)}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", body);
  url.searchParams.set("apikey", apikey);

  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!res.ok) console.error("[whatsapp]", res.status, await res.text());
  } catch (error) {
    console.error("[whatsapp]", error);
  }
}
