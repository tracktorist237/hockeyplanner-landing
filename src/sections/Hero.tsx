import { PrimaryCta } from "../components/PrimaryCta";
import { ProductPreview } from "../components/ProductPreview";
import { ProductVideo } from "../components/ProductVideo";
import { productMedia } from "../config/productMedia";
import { ShareButton } from "../components/ShareButton";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Планировщик хоккейной команды</p>
          <h1>
            Хоккей без
            <br />
            организационного хаоса.
          </h1>
          <p className="hero-subtitle">
            Тренировки, матчи, посещаемость, состав и вратари — без бесконечных
            сообщений и потерянных договорённостей в командном чате.
          </p>
          <div className="hero-actions">
            <PrimaryCta eventName="hero_cta" />
            <ShareButton compact />
          </div>
        </div>
        <div className="hero-visual">
          <ProductVideo
            {...productMedia.hero}
            priority
            description="Обзор события, посещаемости и вратарей в HockeyPlanner"
            fallback={<ProductPreview />}
          />
        </div>
      </div>
    </section>
  );
}
