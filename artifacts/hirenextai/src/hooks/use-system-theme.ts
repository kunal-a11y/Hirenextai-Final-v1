import { useEffect, useState } from "react";

export function useSystemTheme(themeOverride?: string) {
  const [storedTheme, setStoredTheme] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("hirenext_theme") || "dark" : "dark",
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false,
  );

  useEffect(() => {
    if (themeOverride) return;
    const onStorage = () => setStoredTheme(localStorage.getItem("hirenext_theme") || "dark");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [themeOverride]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = themeOverride ?? storedTheme;
    const dark = activeTheme === "dark" || (activeTheme === "system" && systemPrefersDark);
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
  }, [themeOverride, storedTheme, systemPrefersDark]);
}
