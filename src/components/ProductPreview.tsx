import type { ReactNode } from "react";

type PreviewVariant = "overview" | "events" | "attendance" | "roster" | "goalies";

const attendeeNames = ["Алексей Морозов", "Илья Соколов", "Максим Орлов"];

function PreviewShell({ children, title = "Команда «Север»" }: { children: ReactNode; title?: string }) {
  return (
    <div className="preview-shell">
      <div className="preview-appbar">
        <span className="preview-back">←</span>
        <div className="preview-profile">
          <span className="preview-profile-avatar">24</span>
          <span><strong>{title}</strong><small>HockeyPlanner</small></span>
        </div>
        <span className="preview-menu">•••</span>
      </div>
      <div className="preview-content">{children}</div>
    </div>
  );
}

function EventInfo() {
  return (
    <article className="event-card">
      <div className="event-meta"><span className="event-type">Тренировка</span><span className="event-time">Сегодня, 21:30</span></div>
      <h3>Командная тренировка</h3>
      <p className="event-location">Ледовая арена · Москва · 1 ч 15 мин</p>
      <div className="event-note"><span className="event-note-icon">i</span><span>Сбор команды в 21:10 у раздевалки № 4</span></div>
    </article>
  );
}

function Attendance() {
  return (
    <article className="attendance-card">
      <div className="card-heading-row"><div><span className="eyebrow">17 ответов</span><h3>Посещаемость</h3></div><span className="response-total">Обновлено сейчас</span></div>
      <div className="attendance-stats">
        <div className="attendance-stat attendance-stat--yes"><strong>12</strong><span>идут</span></div>
        <div className="attendance-stat attendance-stat--maybe"><strong>3</strong><span>думают</span></div>
        <div className="attendance-stat attendance-stat--no"><strong>2</strong><span>не идут</span></div>
      </div>
      <div className="attendee-list">
        {attendeeNames.map((name, index) => (
          <div className="attendee" key={name}>
            <span className="attendee-avatar">{[17, 71, 9][index]}</span>
            <span className="attendee-copy"><strong>{name}</strong><small>{index === 2 ? "Ответил сегодня" : "Ответил недавно"}</small></span>
            <span className="attendee-status">✓</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function EventsPreview() {
  const days = ["18", "19", "20", "21", "22", "23", "24"];
  const week = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  return (
    <PreviewShell title="События команды">
      <div className="calendar-toolbar"><div><span className="eyebrow">Август 2026</span><h3>Ближайшие события</h3></div><span className="preview-add">＋ Создать</span></div>
      <div className="calendar-strip">{days.map((day, index) => <span className={index === 3 ? "is-active" : ""} key={day}><small>{week[index]}</small><strong>{day}</strong></span>)}</div>
      <div className="event-list">
        <article><span className="event-date-block"><strong>21:30</strong><small>сегодня</small></span><span><strong>Командная тренировка</strong><small>Ледовая арена · сбор в 21:10</small></span><b>12 идут</b></article>
        <article><span className="event-date-block"><strong>19:00</strong><small>24 авг</small></span><span><strong>Матч против «Вектора»</strong><small>Спорткомплекс «Север»</small></span><b>9 идут</b></article>
      </div>
    </PreviewShell>
  );
}

function AttendancePreview() {
  return <PreviewShell><div className="preview-event-heading"><span className="event-type">Тренировка</span><strong>Сегодня, 21:30 · Ледовая арена</strong></div><Attendance /></PreviewShell>;
}

function RosterPreview() {
  const lines = [["А. Морозов", "И. Соколов", "М. Орлов"], ["П. Волков", "Д. Лебедев", "Р. Попов"]];
  return (
    <PreviewShell title="Состав на тренировку">
      <div className="roster-toolbar"><div><span className="eyebrow">12 игроков подтверждены</span><h3>Состав и звенья</h3></div><span className="response-total">Автосохранение</span></div>
      <div className="roster-layout">
        <div className="rink-board">
          <span className="rink-line" />
          {lines.map((line, lineIndex) => <div className={`player-line player-line--${lineIndex + 1}`} key={lineIndex}>{line.map((player, playerIndex) => <span className="player-chip" key={player}><b>{lineIndex * 3 + playerIndex + 1}</b><small>{player}</small></span>)}</div>)}
          <span className="goalie-chip"><b>ВР</b><small>Н. Егоров</small></span>
        </div>
        <aside className="roster-bench"><span className="eyebrow">Доступны</span>{["К. Фёдоров", "С. Виноградов", "А. Павлов"].map((player, index) => <span key={player}><b>{index + 14}</b><small>{player}</small></span>)}</aside>
      </div>
    </PreviewShell>
  );
}

function GoaliesPreview() {
  return (
    <PreviewShell title="Вратари команды">
      <div className="goalies-heading"><span className="eyebrow">Тренировка · сегодня, 21:30</span><h3>Нужен 1 вратарь</h3></div>
      <div className="goalie-list">
        <article className="goalie-person goalie-person--confirmed"><span className="goalie-avatar">30</span><span><strong>Никита Егоров</strong><small>Подтвердил участие</small></span><b>Подтверждён</b></article>
        <article className="goalie-person"><span className="goalie-avatar">72</span><span><strong>Артём Беляев</strong><small>Приглашение отправлено</small></span><b>Ожидаем ответ</b></article>
      </div>
      <div className="goalie-summary"><span className="status-dot" /><strong>На событие есть вратарь</strong><small>Статус видит вся команда</small></div>
    </PreviewShell>
  );
}

function OverviewPreview() {
  return <PreviewShell><EventInfo /><div className="preview-tabs"><span className="preview-tab preview-tab--active">Посещаемость</span><span className="preview-tab">Состав</span><span className="preview-tab">Вратари</span></div><div className="preview-grid"><Attendance /><aside className="goalie-card"><div className="goalie-icon">ВР</div><span className="eyebrow">Вратари</span><h3>Вратарь найден</h3><p>На тренировку подтверждён один вратарь.</p><div className="goalie-status"><span className="status-dot" /><span>Подтверждён · 1/1</span></div></aside></div></PreviewShell>;
}

export function ProductPreview({ variant = "overview" }: { variant?: PreviewVariant }) {
  return (
    <div className={`product-preview product-preview--${variant}`}>
      {variant === "overview" ? <OverviewPreview /> : null}
      {variant === "events" ? <EventsPreview /> : null}
      {variant === "attendance" ? <AttendancePreview /> : null}
      {variant === "roster" ? <RosterPreview /> : null}
      {variant === "goalies" ? <GoaliesPreview /> : null}
    </div>
  );
}
