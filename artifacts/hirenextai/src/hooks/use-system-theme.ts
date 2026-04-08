import { useEffect, useState } from "react";

export function useSystemTheme(theme: string) {
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const dark = theme === "dark" || (theme === "system" && systemPrefersDark);
    root.classList.toggle("dark", dark);
  }, [theme, systemPrefersDark]);
}
