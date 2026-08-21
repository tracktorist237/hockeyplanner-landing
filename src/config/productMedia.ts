export interface ProductMediaSource {
  src: string;
  type: "video/mp4" | "video/webm";
}

export interface ProductMediaConfig {
  poster?: string;
  sources: ProductMediaSource[];
}

type SceneName = "hero" | "events" | "attendance" | "roster" | "goalies";

interface ProductMediaAssets {
  mp4: string;
  webm?: string;
  poster?: string;
}

const mediaAssets: Partial<Record<SceneName, ProductMediaAssets>> = {
  hero: {
    mp4: "/media/hero/hero.mp4",
    poster: "/media/hero/poster.jpg",
  },
  events: {
    mp4: "/media/events/events.mp4",
    poster: "/media/events/poster.jpg",
  },
  attendance: {
    mp4: "/media/attendance/attendance.mp4",
    poster: "/media/attendance/poster.jpg",
  },
  roster: {
    mp4: "/media/roster/roster.mp4",
    poster: "/media/roster/poster.jpg",
  },
  goalies: {
    mp4: "/media/goalies/goalies.mp4",
    poster: "/media/goalies/poster.jpg",
  },
};

function media(scene: SceneName): ProductMediaConfig {
  const assets = mediaAssets[scene];
  if (!assets) return { sources: [] };

  const sources: ProductMediaSource[] = [
    { src: assets.mp4, type: "video/mp4" },
  ];
  if (assets.webm) sources.push({ src: assets.webm, type: "video/webm" });

  return {
    poster: assets.poster,
    sources,
  };
}

export const productMedia = {
  hero: media("hero"),
  events: media("events"),
  attendance: media("attendance"),
  roster: media("roster"),
  goalies: media("goalies"),
} satisfies Record<SceneName, ProductMediaConfig>;
