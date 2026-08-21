import { ProductPreview } from "../components/ProductPreview";
import { ProductVideo } from "../components/ProductVideo";
import { Reveal } from "../components/Reveal";
import { productMedia } from "../config/productMedia";

const stories = [
  { id: "events", number: "01", label: "События", title: "Вся команда знает, где и когда.", description: "Создайте тренировку или матч, укажите время, место и детали сбора. Ближайшие события остаются перед глазами у всей команды.", media: productMedia.events, variant: "events" as const, videoDescription: "Создание и просмотр тренировки в HockeyPlanner" },
  { id: "attendance", number: "02", label: "Посещаемость", title: "Ответы видны заранее.", description: "Игроки отмечают, придут ли они. Организатор сразу видит, кто идёт, кто ещё думает и на кого не рассчитывать.", media: productMedia.attendance, variant: "attendance" as const, videoDescription: "Изменение ответа игрока и обновление посещаемости события", reverse: true },
  { id: "roster", number: "03", label: "Состав", title: "Соберите тех, кто выйдет на лёд.", description: "Работайте с подтверждёнными игроками, позициями и звеньями в одном составе — без отдельных таблиц и списков в чате.", media: productMedia.roster, variant: "roster" as const, videoDescription: "Работа с составом, позициями и звеньями HockeyPlanner" },
  { id: "goalies", number: "04", label: "Вратари", title: "Вратарь — не вопрос последней минуты.", description: "Приглашайте вратарей на событие и следите за ответами. Команда заранее понимает, подтверждён ли нужный игрок.", media: productMedia.goalies, variant: "goalies" as const, videoDescription: "Приглашение и подтверждение вратаря на событие", reverse: true },
];

export function ProductStories() {
  return (
    <div className="product-stories" aria-label="Возможности HockeyPlanner">
      {stories.map((story) => (
        <section className={`product-story${story.reverse ? " product-story--reverse" : ""}`} id={story.id} aria-labelledby={`${story.id}-title`} key={story.id}>
          <div className="container">
            <Reveal className="product-story-grid">
              <div className="story-copy">
                <p className="story-index"><span>{story.number}</span>{story.label}</p>
                <h2 id={`${story.id}-title`}>{story.title}</h2>
                <p>{story.description}</p>
              </div>
              <div className="story-media">
                <ProductVideo {...story.media} description={story.videoDescription} fallback={<ProductPreview variant={story.variant} />} />
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
