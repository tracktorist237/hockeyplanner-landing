import { PrimaryCta } from "../components/PrimaryCta";
import { Reveal } from "../components/Reveal";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <Reveal className="container final-cta-inner">
        <div>
          <p className="section-label">От события до готового состава</p>
          <h2 id="final-cta-title">Команда готова. Осталось выйти на лёд.</h2>
        </div>
        <PrimaryCta eventName="final_cta" />
      </Reveal>
    </section>
  );
}
