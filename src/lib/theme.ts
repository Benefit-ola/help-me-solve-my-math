export function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Inline script string, injected directly into <head> via layout.tsx.
// Runs before React hydrates, so there's no flash of the wrong theme.
export const themeInitScript = `
(function() {
  try {
    var raw = localStorage.getItem("hmsm_settings");
    var theme = raw ? JSON.parse(raw).theme : "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;
