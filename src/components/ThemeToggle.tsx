type Theme = "light" | "dark";

const STORAGE_KEY = "hockeyplanner-landing-theme";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const toggleTheme = () => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#07111f" : "#f4f7fb");
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Keep the selected theme for this page when storage is unavailable.
    }
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Переключить цветовую тему"
      title="Переключить цветовую тему"
    >
      <span className="theme-toggle-icon theme-toggle-icon--to-light" aria-hidden="true">☀</span>
      <span className="theme-toggle-icon theme-toggle-icon--to-dark" aria-hidden="true">☾</span>
    </button>
  );
}
