// Checks a changed site text before it is saved, so a typo can't break a page.
// Kept apart from site-texts.ts so the ICU parser stays out of browser bundles.
import { parse, TYPE, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";

/** The {placeholders} a message uses, e.g. "All {count} projects" → ["count"]. */
export function messageArgs(message: string): Set<string> {
  const args = new Set<string>();
  const walk = (elements: MessageFormatElement[]) => {
    for (const el of elements) {
      if (el.type === TYPE.literal || el.type === TYPE.pound) continue;
      if ("value" in el && typeof el.value === "string") args.add(el.value);
      if (el.type === TYPE.plural || el.type === TYPE.select) {
        for (const option of Object.values(el.options)) walk(option.value);
      }
      // next-intl reads <b>…</b> as a tag that needs code to render, so none are allowed
      if (el.type === TYPE.tag) throw new Error("tag");
    }
  };
  walk(parse(message));
  return args;
}

/**
 * Why `text` can't replace `original`, or null when it can: it must be a valid
 * message and may only use the placeholders the original has.
 */
export function textProblem(text: string, original: string): string | null {
  let used: Set<string>;
  try {
    used = messageArgs(text);
  } catch {
    return "Check the { } braces and remove any <tags>";
  }
  const allowed = messageArgs(original);
  const unknown = [...used].filter((a) => !allowed.has(a));
  return unknown.length ? `Unknown placeholder: ${unknown.map((a) => `{${a}}`).join(", ")}` : null;
}
