import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { FinalCta } from "./sections/FinalCta";
import { HelpFaq } from "./sections/HelpFaq";
import { Hero } from "./sections/Hero";
import { ProductStories } from "./sections/ProductStories";
import { useEffect } from "react";
import { initAnalytics } from "./lib/analytics";

export function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <ProductStories />
        <HelpFaq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
