import { PrimaryCta } from "./PrimaryCta";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="HockeyPlanner — главная">
          <img className="brand-icon" src="/icon-192.png" alt="" width="36" height="36" />
          <span>HockeyPlanner</span>
        </a>
        <nav className="header-nav" aria-label="Возможности HockeyPlanner">
          <a href="#events">События</a>
          <a href="#attendance">Посещаемость</a>
          <a href="#roster">Состав</a>
          <a href="#goalies">Вратари</a>
          <a href="#help">Справка</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <PrimaryCta compact label="Открыть приложение" mobileLabel="Открыть" eventName="header_cta" />
        </div>
      </div>
    </header>
  );
}
