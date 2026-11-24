"use client";

import { useEffect } from "react";

const KEY = "scroll-y:";
/** Give up if the page hasn't grown tall enough by then (slow network, removed section). */
const GIVE_UP_MS = 6000;

/** Only the first page load restores; later moves are client navigations Next.js handles. */
let firstLoad = true;

/**
 * Puts a reloaded page back where the visitor left it, and honours a #section in the
 * address on a fresh visit.
 *
 * The browser can't do either here. The first HTML it receives is the loading screen
 * (about one screen tall) while the sections stream in after the database answers. It
 * restores the old position against that short page, gets clamped near the top, and
 * never tries again once the real content arrives. So this waits for the page to be
 * tall enough (or for the #section to exist), then jumps there instantly.
 *
 * It steps aside as soon as the visitor scrolls on their own.
 */
export function ScrollRestore() {
  useEffect(() => {
    const keyFor = () => KEY + window.location.pathname;

    let saving = false;
    let frame = 0;
    const save = () => {
      if (!saving) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(keyFor(), String(Math.round(window.scrollY)));
        } catch {
          // storage blocked (private mode, quota): restoring just won't happen
        }
      });
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);

    const cleanupSave = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
    };

    if (!firstLoad) {
      saving = true;
      return cleanupSave;
    }
    firstLoad = false;

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let savedY = NaN;
    if (nav?.type === "reload") {
      try {
        savedY = Number(sessionStorage.getItem(keyFor()));
      } catch {}
    }
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const wantY = Number.isFinite(savedY) && savedY > 0;

    if (!wantY && !hash) {
      saving = true;
      return cleanupSave;
    }

    let done = false;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => attempt());
    const giveUp = window.setTimeout(() => finish(), GIVE_UP_MS);
    const finish = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      clearTimeout(giveUp);
      for (const type of USER_SCROLL) window.removeEventListener(type, finish);
      saving = true;
    };
    function attempt() {
      if (done) return;
      if (wantY) {
        // "instant" overrides the stylesheet's smooth scrolling, so the page doesn't glide in from the top.
        if (root.scrollHeight - window.innerHeight >= savedY - 2) {
          window.scrollTo({ top: savedY, behavior: "instant" });
          finish();
        }
        return;
      }
      const target = document.getElementById(hash);
      if (target && !target.closest("[hidden]")) {
        target.scrollIntoView({ block: "start", behavior: "instant" });
        finish();
      }
    }

    // The visitor taking over cancels the jump.
    for (const type of USER_SCROLL) window.addEventListener(type, finish, { passive: true });
    observer.observe(document.body);
    attempt();

    return () => {
      finish();
      cleanupSave();
    };
  }, []);

  return null;
}

const USER_SCROLL = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
