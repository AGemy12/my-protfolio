"use client";

import { useEffect } from "react";

const SELECTOR = '[data-variant="ember"]';
const HOVER_EVERY_MS = 90;
const CLICK_BURST = 16;

function isIdle(el: Element) {
  return !el.matches(":disabled, [aria-disabled='true'], [aria-busy='true']");
}

/** One spark rising from the button's top edge, drawn on <body> in viewport coordinates. */
function spawn(el: Element) {
  const r = el.getBoundingClientRect();
  if (!r.width) return;
  const s = document.createElement("i");
  s.className = "ember-spark";
  s.setAttribute("aria-hidden", "true");
  s.style.left = `${r.left + r.width * (0.08 + Math.random() * 0.84)}px`;
  s.style.top = `${r.top + r.height * 0.18}px`;
  s.style.setProperty("--dx", `${(Math.random() * 36 - 18).toFixed(1)}px`);
  s.style.setProperty("--dy", `${(-(26 + Math.random() * 38)).toFixed(1)}px`);
  s.style.setProperty("--s", (0.6 + Math.random() * 0.9).toFixed(2));
  s.style.animationDuration = `${650 + Math.random() * 650}ms`;
  s.addEventListener("animationend", () => s.remove(), { once: true });
  document.body.appendChild(s);
}

/**
 * Sparks for every `<Button variant="ember">`: a light stream while a mouse hovers it
 * and a burst on click. Listens once on the document, so buttons rendered anywhere
 * (server components, dialogs, `asChild` links) get them without any wiring.
 */
export function EmberSparks() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Map<Element, number>();

    const stop = (el: Element) => {
      window.clearInterval(timers.get(el));
      timers.delete(el);
    };

    const onEnter = (e: PointerEvent) => {
      const el = e.target;
      if (!(el instanceof Element) || !el.matches(SELECTOR)) return;
      if (e.pointerType !== "mouse" || motion.matches || !isIdle(el)) return;
      stop(el);
      spawn(el);
      timers.set(
        el,
        window.setInterval(() => (el.isConnected && isIdle(el) ? spawn(el) : stop(el)), HOVER_EVERY_MS),
      );
    };

    const onLeave = (e: PointerEvent) => {
      if (e.target instanceof Element && timers.has(e.target)) stop(e.target);
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (!el || motion.matches) return;
      for (let i = 0; i < CLICK_BURST; i++) spawn(el);
    };

    // pointerenter/leave don't bubble, but they do pass through the capture phase.
    document.addEventListener("pointerenter", onEnter, true);
    document.addEventListener("pointerleave", onLeave, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerenter", onEnter, true);
      document.removeEventListener("pointerleave", onLeave, true);
      document.removeEventListener("click", onClick);
      timers.forEach((id) => window.clearInterval(id));
    };
  }, []);

  return null;
}
