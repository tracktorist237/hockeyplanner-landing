export type AnalyticsEvent =
  | "header_cta"
  | "hero_cta"
  | "final_cta"
  | "share_success"
  | "share_copy"
  | "help_open"
  | "help_contact"
  | "footer_cta"
  | "legal_open";

declare global {
  interface Window {
    ym?: ((counterId: number, method: string, ...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  }
}

const rawCounterId = import.meta.env.VITE_YANDEX_METRIKA_ID?.trim();
const counterId = rawCounterId && /^\d+$/.test(rawCounterId) ? Number(rawCounterId) : null;
let initialized = false;

export function initAnalytics() {
  if (!counterId || initialized || typeof window === "undefined") return;
  initialized = true;
  window.ym = window.ym || function (...args: unknown[]) {
    (window.ym!.a ||= []).push(args);
  };
  window.ym.l = Date.now();

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.append(script);
  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function trackEvent(event: AnalyticsEvent) {
  if (!counterId || !window.ym) return;
  window.ym(counterId, "reachGoal", event);
}
