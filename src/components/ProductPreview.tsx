const attendees = [
  { number: 17, label: "Игрок #17", note: "Ответил 12 мин назад" },
  { number: 71, label: "Игрок #71", note: "Ответил сегодня" },
  { number: 9, label: "Игрок #9", note: "Без комментария" },
];

export function ProductPreview() {
  return (
    <section className="product-preview" aria-label="Пример интерфейса события в HockeyPlanner">
      <div className="preview-appbar" aria-hidden="true">
        <span className="preview-back">←</span>
        <div className="preview-profile">
          <span className="preview-profile-avatar">24</span>
          <span>
            <strong>Команда «Север»</strong>
            <small>Организатор события</small>
          </span>
        </div>
        <span className="preview-menu">•••</span>
      </div>

      <div className="preview-content" aria-hidden="true">
        <article className="event-card">
          <div className="event-meta">
            <span className="event-type">Тренировка</span>
            <span className="event-time">Сегодня, 21:30</span>
          </div>
          <h2>Командная тренировка</h2>
          <p className="event-location">Ледовая арена · 1 ч 15 мин</p>
          <div className="event-note">
            <span className="event-note-icon">i</span>
            <span>Сбор команды в 21:10 у раздевалки № 4</span>
          </div>
        </article>

        <div className="preview-tabs">
          <span className="preview-tab preview-tab--active">Посещаемость</span>
          <span className="preview-tab">Состав</span>
          <span className="preview-tab">Вратари</span>
        </div>

        <div className="preview-grid">
          <article className="attendance-card">
            <div className="card-heading-row">
              <div>
                <span className="eyebrow">Ответы команды</span>
                <h3>Посещаемость</h3>
              </div>
              <span className="response-total">17 ответов</span>
            </div>

            <div className="attendance-stats">
              <div className="attendance-stat attendance-stat--yes">
                <strong>12</strong>
                <span>идут</span>
              </div>
              <div className="attendance-stat attendance-stat--maybe">
                <strong>3</strong>
                <span>думают</span>
              </div>
              <div className="attendance-stat attendance-stat--no">
                <strong>2</strong>
                <span>не идут</span>
              </div>
            </div>

            <div className="attendee-list">
              {attendees.map((attendee) => (
                <div className="attendee" key={attendee.number}>
                  <span className="attendee-avatar">{attendee.number}</span>
                  <span className="attendee-copy">
                    <strong>{attendee.label}</strong>
                    <small>{attendee.note}</small>
                  </span>
                  <span className="attendee-status">✓</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="goalie-card">
            <div className="goalie-icon" aria-hidden="true">ВР</div>
            <span className="eyebrow">Вратари</span>
            <h3>Вратарь найден</h3>
            <p>На тренировку подтверждён один вратарь.</p>
            <div className="goalie-status">
              <span className="status-dot" />
              <span>Подтверждён · 1/1</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
