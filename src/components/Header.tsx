import { PrimaryCta } from "./PrimaryCta";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="HockeyPlanner — главная">
          <img className="brand-icon" src="/icon-192.png" alt="" width="36" height="36" />
          <span>HockeyPlanner</span>
        </a>
        <PrimaryCta compact label="Открыть приложение" />
      </div>
    </header>
  );
}
