import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return (
        localStorage.getItem('forma-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light')
      );
    } catch {
      return 'light';
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('forma-theme', theme);
    } catch {
      /* Storage may be disabled. */
    }
  }, [theme]);
  return {
    theme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
  };
}
