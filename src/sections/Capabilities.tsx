const capabilities = ["События", "Состав", "Посещаемость", "Вратари"];

export function Capabilities() {
  return (
    <section className="capabilities" aria-labelledby="capabilities-title">
      <div className="container capabilities-inner">
        <p className="section-label">В одном месте</p>
        <h2 id="capabilities-title">Всё, что нужно команде до выхода на лёд.</h2>
        <ul className="capability-list">
          {capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
        <p className="capabilities-note">
          Создайте событие, соберите ответы и заранее поймите, кто будет на тренировке или матче.
        </p>
      </div>
    </section>
  );
}
