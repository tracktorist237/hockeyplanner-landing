import { PrimaryCta } from "../components/PrimaryCta";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="container final-cta-inner">
        <div>
          <p className="section-label">Можно начинать</p>
          <h2 id="final-cta-title">Команда уже в сборе.</h2>
        </div>
        <PrimaryCta />
      </div>
    </section>
  );
}
