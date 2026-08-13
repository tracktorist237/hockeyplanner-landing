import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Capabilities } from "./sections/Capabilities";
import { FinalCta } from "./sections/FinalCta";
import { Hero } from "./sections/Hero";

export function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Capabilities />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
