interface PrimaryCtaProps {
  compact?: boolean;
  label?: string;
}

export function PrimaryCta({ compact = false, label = "Открыть HockeyPlanner" }: PrimaryCtaProps) {
  return (
    <a
      className={`primary-cta${compact ? " primary-cta--compact" : ""}`}
      href="https://hockeyplanner.ru/"
    >
      <span>{label}</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}
