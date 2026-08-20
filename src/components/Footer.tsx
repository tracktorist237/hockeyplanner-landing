import { PrimaryCta } from "./PrimaryCta";
import { ShareButton } from "./ShareButton";
import { trackEvent } from "../lib/analytics";

const productLinks = [["События", "#events"], ["Посещаемость", "#attendance"], ["Состав", "#roster"], ["Вратари", "#goalies"], ["Справка", "#help"]];
const legalLinks = [
  ["О сервисе", "https://hockeyplanner.ru/about"],
  ["Пользовательское соглашение", "https://hockeyplanner.ru/terms"],
  ["Политика конфиденциальности", "https://hockeyplanner.ru/privacy"],
  ["Условия оказания услуг", "https://hockeyplanner.ru/service-terms"],
  ["Контакты", "https://hockeyplanner.ru/contacts"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="HockeyPlanner — главная"><img className="brand-icon" src="/icon-192.png" alt="" width="36" height="36" /><span>HockeyPlanner</span></a>
          <p>Организация хоккейной команды — от события до готового состава.</p>
          <div className="footer-actions"><PrimaryCta compact label="Открыть приложение" eventName="footer_cta" /><ShareButton compact /></div>
        </div>
        <nav className="footer-column" aria-label="Разделы страницы"><h2>Продукт</h2>{productLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
        <nav className="footer-column footer-column--legal" aria-label="Юридическая информация"><h2>Документы</h2>{legalLinks.map(([label, href]) => <a href={href} key={href} onClick={() => trackEvent("legal_open")}>{label}</a>)}</nav>
      </div>
      <div className="container footer-bottom"><span>HockeyPlanner © 2026</span><a href="mailto:support@hockeyplanner.ru" onClick={() => trackEvent("help_contact")}>support@hockeyplanner.ru</a></div>
    </footer>
  );
}
