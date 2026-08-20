import { useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";

const SHARE_TITLE = "HockeyPlanner — планировщик хоккейной команды";
const SHARE_TEXT = "Тренировки, матчи, посещаемость, состав и вратари — в одном приложении.";
const SHARE_URL = "https://хоккейный-планировщик.рф/";

async function copyWithFallback(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.cssText = "position:fixed;opacity:0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Copy is unavailable");
}

export function ShareButton({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState("");
  const timeoutRef = useRef<number | undefined>(undefined);
  const showStatus = (message: string) => {
    setStatus(message);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setStatus(""), 2600);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
        trackEvent("share_success");
        showStatus("Готово");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await copyWithFallback(SHARE_URL);
      trackEvent("share_copy");
      showStatus("Ссылка скопирована");
    } catch {
      showStatus("Не удалось скопировать ссылку");
    }
  };

  return (
    <span className="share-control">
      <button className={`share-button${compact ? " share-button--compact" : ""}`} type="button" onClick={handleShare}>
        <span className="share-icon" aria-hidden="true">↗</span>
        <span>{compact ? "Поделиться" : "Поделиться HockeyPlanner"}</span>
      </button>
      <span className="share-status" aria-live="polite" aria-atomic="true">{status}</span>
    </span>
  );
}
