import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data";
import { tr } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

// The image shown when a page of the site is shared (WhatsApp, LinkedIn, X…).
// Project pages override it with their cover. Text is always in English: the
// image renderer can't join Arabic letters correctly.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

const BRAND = "#e34d00";
const INK = "#161313";

/** Local files (/images/…) are read from disk; uploads are fetched by URL. */
async function source(src: string) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  if (!/\.(png|jpe?g)$/i.test(src)) return null; // the renderer only reads PNG / JPEG
  try {
    const data = await readFile(join(process.cwd(), "public", src));
    return `data:image/${src.toLowerCase().endsWith(".png") ? "png" : "jpeg"};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const s = await getSettings();

  // An image picked in the dashboard (Profile → SEO) wins over the generated card.
  const custom = await source(s.ogImage);
  if (custom) {
    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element
      <img src={custom} alt="" width={size.width} height={size.height} style={{ objectFit: "cover" }} />,
      size,
    );
  }

  const name = tr(s.name, "en");
  const role = tr(s.role, "en");
  const headline = tr(s.headline, "en").replace(/\*/g, "");
  const avatar = await source(s.avatar);
  const domain = siteUrl().replace(/^https?:\/\//, "");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: INK,
        color: "#f5f3ef",
        backgroundImage: `radial-gradient(circle at 88% 12%, rgba(227,77,0,0.35), transparent 45%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#bdb5ad" }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: BRAND }} />
        {domain}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        {avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            width={220}
            height={220}
            style={{ borderRadius: 999, objectFit: "cover", border: `6px solid ${BRAND}` }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{name}</div>
          {role && <div style={{ marginTop: 18, fontSize: 38, color: BRAND }}>{role}</div>}
          {headline && (
            <div style={{ marginTop: 22, fontSize: 28, lineHeight: 1.4, color: "#bdb5ad", maxWidth: 760 }}>
              {headline.length > 120 ? `${headline.slice(0, 117)}…` : headline}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", height: 6, width: 160, borderRadius: 999, background: BRAND }} />
    </div>,
    size,
  );
}
