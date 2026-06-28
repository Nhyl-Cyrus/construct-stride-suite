// Theme service — the UI binding lives in src/components/theme-provider.tsx;
// this module exposes the pure helpers in a framework-agnostic form so they
// can be reused outside React (tests, server fns, etc.).
export type ResolvedTheme = "light" | "dark";

export const themeService = {
  systemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },
};
