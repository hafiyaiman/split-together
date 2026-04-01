"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function syncFavicon(theme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const faviconHref = theme === "dark" ? "/favicon-dark.ico" : "/favicon.ico";
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
  ];

  for (const selector of selectors) {
    const links = document.head.querySelectorAll<HTMLLinkElement>(selector);

    if (links.length === 0) {
      const link = document.createElement("link");
      link.rel = selector.includes("shortcut") ? "shortcut icon" : "icon";
      link.href = faviconHref;
      document.head.appendChild(link);
      continue;
    }

    links.forEach((link) => {
      link.href = faviconHref;
      link.removeAttribute("media");
    });
  }
}

function getSystemTheme(): ResolvedTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() =>
    getInitialTheme(defaultTheme),
  );
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() =>
    getSystemTheme(),
  );

  const resolvedTheme =
    theme === "system" && enableSystem ? systemTheme : (theme as ResolvedTheme);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    syncFavicon(resolvedTheme);

    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [resolvedTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
