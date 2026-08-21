export interface ProductMediaSource {
  src: string;
  type: "video/mp4" | "video/webm";
}

export interface ProductMediaConfig {
  poster?: string;
  sources: ProductMediaSource[];
}

type SceneName = "hero" | "events" | "attendance" | "roster" | "goalies";

// Add a scene name after its MP4 and poster have been placed under public/media.
const enabledMedia = new Set<SceneName>([]);

function media(scene: SceneName): ProductMediaConfig {
  if (!enabledMedia.has(scene)) return { sources: [] };
  return {
    poster: `/media/${scene}/poster.jpg`,
    sources: [
      { src: `/media/${scene}/${scene}.mp4`, type: "video/mp4" },
      { src: `/media/${scene}/${scene}.webm`, type: "video/webm" },
    ],
  };
}

export const productMedia = {
  hero: media("hero"),
  events: media("events"),
  attendance: media("attendance"),
  roster: media("roster"),
  goalies: media("goalies"),
} satisfies Record<SceneName, ProductMediaConfig>;
