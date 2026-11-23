import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

/**
 * The hero's signature: a request-trace waterfall (like a tracing tool's span view)
 * showing one page request travelling through every layer of the stack.
 * Timings are illustrative, not measured — the footer says so.
 */

type Kind = "ui" | "api" | "db" | "infra";
type Span = { key: string; sub: string; kind: Kind; start: number; ms: number; depth: 0 | 1 | 2 };

const AXIS_MAX = 72;
const TICKS = [0, 16, 32, 48, 64];

const SPANS: Span[] = [
  { key: "page", sub: "next.js · ssr", kind: "ui", start: 0, ms: 64, depth: 0 },
  { key: "routing", sub: "middleware · i18n", kind: "infra", start: 1, ms: 3, depth: 1 },
  { key: "api", sub: "nestjs · /api/projects", kind: "api", start: 6, ms: 35, depth: 1 },
  { key: "auth", sub: "jwt guard · rbac", kind: "api", start: 7, ms: 3, depth: 2 },
  { key: "cache", sub: "redis · miss", kind: "infra", start: 11, ms: 2, depth: 2 },
  { key: "db", sub: "postgresql · select", kind: "db", start: 15, ms: 18, depth: 2 },
  { key: "render", sub: "react server components", kind: "ui", start: 42, ms: 20, depth: 1 },
];

const BAR: Record<Kind, string> = {
  ui: "bg-brand",
  api: "bg-brand-2",
  db: "bg-peach",
  infra: "bg-[rgb(242_239_233/0.28)]",
};

const pct = (v: number) => `${(v / AXIS_MAX) * 100}%`;

export async function Trace({ className }: { className?: string }) {
  const locale = await getLocale();
  const t = await getTranslations("hero.trace");

  return (
    <figure
      className={cn("bg-metal m-0 min-w-0 overflow-hidden rounded-2xl text-(--metal-fg) shadow-2xl shadow-black/30", className)}
    >
      <figcaption className="flex items-baseline justify-between gap-4 border-b border-(--metal-line) px-5 py-4">
        <span className="text-[15px] font-medium text-(--metal-heading)">{t("title")}</span>
        <span dir="ltr" className="font-mono text-[11px] tracking-wider whitespace-nowrap text-(--metal-dim)">
          GET /{locale}/projects
        </span>
      </figcaption>

      <ol className="py-2">
        {SPANS.map((s, i) => (
          <li
            key={s.key}
            className="grid grid-cols-[minmax(0,40%)_minmax(0,1fr)] items-center gap-3 px-4 py-1.5 transition-colors hover:bg-white/[0.03] sm:gap-4 sm:px-5"
          >
            <div className={cn("flex min-w-0 flex-col leading-snug", s.depth === 1 && "ps-3", s.depth === 2 && "ps-6")}>
              <span className="truncate text-[13px] font-medium text-(--metal-heading)">{t(s.key)}</span>
              <span dir="ltr" className="truncate font-mono text-[10.5px] text-(--metal-dim) rtl:text-right">
                {s.sub}
              </span>
            </div>
            <div className="relative h-[18px] border-s border-(--metal-line)">
              <span
                className={cn("trace-bar absolute top-[3px] h-3 rounded-[2px]", BAR[s.kind])}
                style={{ insetInlineStart: pct(s.start), width: pct(s.ms), animationDelay: `${0.1 + i * 0.09}s` }}
              >
                <span className="absolute start-[calc(100%+6px)] -top-[3px] font-mono text-[10px] whitespace-nowrap text-(--metal-dim)">
                  <bdi dir="ltr">{s.ms}ms</bdi>
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div aria-hidden className="grid grid-cols-[minmax(0,40%)_minmax(0,1fr)] gap-3 px-4 sm:gap-4 sm:px-5">
        <span />
        <div className="relative h-4 font-mono text-[9.5px] text-(--metal-dim)">
          {TICKS.map((v) => (
            <span key={v} className="absolute ltr:-translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: pct(v) }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-(--metal-line) px-5 py-3.5 text-xs">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["ui", "server", "data"] as const).map((k, i) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-[2px]", ["bg-brand", "bg-brand-2", "bg-peach"][i])} />
              {t(k)}
            </span>
          ))}
        </div>
        <span className="text-(--metal-dim)">
          {t("note")} ·{" "}
          <span dir="ltr" className="font-mono text-(--metal-heading)">
            <span className="text-emerald-400">200 OK</span> · 64ms
          </span>
        </span>
      </div>
    </figure>
  );
}
