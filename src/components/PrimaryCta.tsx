import { trackEvent, type AnalyticsEvent } from "../lib/analytics";

interface PrimaryCtaProps {
  compact?: boolean;
  label?: string;
  mobileLabel?: string;
  eventName?: AnalyticsEvent;
}

export function PrimaryCta({ compact = false, label = "Открыть HockeyPlanner", mobileLabel, eventName = "hero_cta" }: PrimaryCtaProps) {
  return (
    <a
      className={`primary-cta${compact ? " primary-cta--compact" : ""}`}
      href="https://hockeyplanner.ru/"
      onClick={() => trackEvent(eventName)}
    >
      <span className={mobileLabel ? "cta-label cta-label--desktop" : "cta-label"}>{label}</span>
      {mobileLabel ? <span className="cta-label cta-label--mobile">{mobileLabel}</span> : null}
      <span aria-hidden="true">→</span>
    </a>
  );
}
