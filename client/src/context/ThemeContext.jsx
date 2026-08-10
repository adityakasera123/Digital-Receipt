import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'billvora-theme';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'system';
  });

  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    updateTheme(media);

    media.addEventListener('change', updateTheme);

    return () => media.removeEventListener('change', updateTheme);
  }, []);

  // Apply theme to html element
  useEffect(() => {
    const root = document.documentElement;

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    console.log('Theme:', theme);
    console.log('System Theme:', systemTheme);
    console.log('Resolved Theme:', resolvedTheme);

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      console.log('Added dark class');
    } else {
      root.classList.remove('dark');
      console.log('Removed dark class');
    }

    console.log('HTML classes:', root.className);

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, systemTheme]);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
    }),
    [theme, resolvedTheme, systemTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}