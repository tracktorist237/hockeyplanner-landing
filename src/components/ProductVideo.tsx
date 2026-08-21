import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { ProductMediaSource } from "../config/productMedia";

const PLAYBACK_RATES = [0.5, 0.75, 1] as const;
type PlaybackRate = (typeof PLAYBACK_RATES)[number];

let sharedPlaybackRate: PlaybackRate = 1;
const playbackRateListeners = new Set<() => void>();

const subscribeToPlaybackRate = (listener: () => void) => {
  playbackRateListeners.add(listener);
  return () => playbackRateListeners.delete(listener);
};

const getPlaybackRate = () => sharedPlaybackRate;
const getServerPlaybackRate = (): PlaybackRate => 1;

const setSharedPlaybackRate = (rate: PlaybackRate) => {
  sharedPlaybackRate = rate;
  playbackRateListeners.forEach((listener) => listener());
};

interface ProductVideoProps {
  sources: ProductMediaSource[];
  poster?: string;
  description: string;
  fallback: ReactNode;
  priority?: boolean;
  aspectRatio?: string;
}

export function ProductVideo({
  sources,
  poster,
  description,
  fallback,
  priority = false,
  aspectRatio = "16 / 10",
}: ProductVideoProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [motionPreference, setMotionPreference] = useState<"unknown" | "reduce" | "no-preference">("unknown");
  const [videoFailed, setVideoFailed] = useState(false);
  const playbackRate = useSyncExternalStore(
    subscribeToPlaybackRate,
    getPlaybackRate,
    getServerPlaybackRate,
  );
  const descriptionId = useId();
  const hasVideo = sources.length > 0;
  const reducedMotion = motionPreference === "reduce";
  const canRenderVideo = hasVideo && shouldLoad && motionPreference === "no-preference" && !videoFailed;
  const usesPortraitMedia = hasVideo && !videoFailed;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionPreference(query.matches ? "reduce" : "no-preference");
    sync();
    if (query.addEventListener) {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  useEffect(() => {
    if (!hasVideo || priority || shouldLoad || !frameRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "320px 0px", threshold: 0 });
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [hasVideo, priority, shouldLoad]);

  useEffect(() => {
    if (!hasVideo || !frameRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [hasVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
    if (reducedMotion || isPaused || !isVisible) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [isPaused, isVisible, playbackRate, reducedMotion, shouldLoad]);

  const togglePlayback = () => {
    setIsPaused((paused) => !paused);
  };

  const cyclePlaybackRate = () => {
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
    setSharedPlaybackRate(PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length]);
  };

  const playbackRateLabel = `${playbackRate}x`;

  return (
    <figure
      ref={frameRef}
      className={`product-video${usesPortraitMedia ? " product-video--portrait-media" : ""}`}
      style={{ aspectRatio: usesPortraitMedia ? "426 / 920" : aspectRatio }}
      aria-labelledby={descriptionId}
    >
      <figcaption className="sr-only" id={descriptionId}>{description}</figcaption>
      {canRenderVideo ? (
        <video
          ref={videoRef}
          autoPlay={isVisible && !isPaused}
          muted
          loop
          playsInline
          preload={priority ? "metadata" : "none"}
          poster={poster}
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : poster && hasVideo && !videoFailed ? (
        <img
          className="product-video-poster"
          src={poster}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className="product-video-fallback" aria-hidden="true">
          {fallback}
        </div>
      )}
      {canRenderVideo ? (
        <div className="video-controls">
          <button
            className="video-speed-control"
            type="button"
            onClick={cyclePlaybackRate}
            aria-label={`Скорость воспроизведения: ${playbackRateLabel}. Изменить скорость`}
          >
            {playbackRateLabel}
          </button>
          <button
            className="video-control"
            type="button"
            onClick={togglePlayback}
            aria-label={isPaused ? "Воспроизвести демонстрацию" : "Приостановить демонстрацию"}
          >
            <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
          </button>
        </div>
      ) : null}
    </figure>
  );
}
