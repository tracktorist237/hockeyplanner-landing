import { Reveal } from "../components/Reveal";
import { trackEvent } from "../lib/analytics";

const questions = [
  ["Для кого подходит HockeyPlanner?", "Для любительских хоккейных команд, организаторов тренировок и игроков, которым нужно договориться о событии, собрать ответы и подготовить состав."],
  ["Что можно планировать?", "Тренировки и матчи: дату, время, место, информацию о сборе и другие детали, которые важно знать участникам команды."],
  ["Как работает посещаемость?", "Игрок отвечает на конкретное событие, а организатор видит актуальные группы: идут, думают и не идут. Это помогает оценить состав заранее."],
  ["Можно ли работать с составом и вратарями?", "Да. В событии можно подготовить состав и звенья, а также пригласить вратарей и увидеть их текущий статус."],
  ["Нужно ли устанавливать отдельную программу?", "HockeyPlanner открывается как веб-приложение в современном браузере на телефоне или компьютере."],
];

export function HelpFaq() {
  return (
    <section className="help-section" id="help" aria-labelledby="help-title">
      <div className="container help-layout">
        <Reveal className="help-intro">
          <p className="section-label">Справка</p>
          <h2 id="help-title">Коротко о главном.</h2>
          <p>Если нужного ответа нет, напишите в поддержку HockeyPlanner.</p>
          <a href="https://hockeyplanner.ru/contacts" onClick={() => trackEvent("help_contact")}>Связаться с поддержкой →</a>
        </Reveal>
        <Reveal className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question} onToggle={(event) => { if (event.currentTarget.open) trackEvent("help_open"); }}>
              <summary>{question}<span aria-hidden="true">＋</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
