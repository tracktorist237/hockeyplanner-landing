import { PrimaryCta } from "../components/PrimaryCta";
import { ProductPreview } from "../components/ProductPreview";

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
            HockeyPlanner помогает команде вести тренировки и матчи, собирать состав,
            отмечать посещаемость и находить вратарей.
          </p>
          <PrimaryCta />
        </div>
        <div className="hero-visual">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
