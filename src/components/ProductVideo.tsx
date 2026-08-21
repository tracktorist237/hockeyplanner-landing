import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { ProductMediaSource } from "../config/productMedia";

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
  const descriptionId = useId();
  const hasVideo = sources.length > 0;
  const reducedMotion = motionPreference === "reduce";
  const canRenderVideo = hasVideo && shouldLoad && motionPreference === "no-preference" && !videoFailed;

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
    if (reducedMotion || isPaused || !isVisible) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [isPaused, isVisible, reducedMotion, shouldLoad]);

  const togglePlayback = () => {
    setIsPaused((paused) => !paused);
  };

  return (
    <figure
      ref={frameRef}
      className="product-video"
      style={{ aspectRatio }}
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
        <button
          className="video-control"
          type="button"
          onClick={togglePlayback}
          aria-label={isPaused ? "Воспроизвести демонстрацию" : "Приостановить демонстрацию"}
        >
          <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
        </button>
      ) : null}
    </figure>
  );
}
