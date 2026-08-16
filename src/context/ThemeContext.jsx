import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Text size steps, as a real root font-size.
 *
 * Everything in the app is sized in rem, so changing the root scales the
 * whole interface proportionally rather than only the body copy. 90% is the
 * starting point: the redesign is generous with spacing and at 100% a lot of
 * screens need more scrolling than they should on a phone.
 */
export const FONT_SCALES = {
  small: { px: '14.4px', label: 'Chica (90%)', step: 1 },
  normal: { px: '16px', label: 'Normal (100%)', step: 2 },
  large: { px: '17.5px', label: 'Mediana (110%)', step: 3 },
  xlarge: { px: '19.5px', label: 'Grande (120%)', step: 4 }
};

export const FONT_SIZE_ORDER = ['small', 'normal', 'large', 'xlarge'];
export const DEFAULT_FONT_SIZE = 'small';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_app_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'light';
    }
  });

  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('nyc_app_font_scale');
      // A saved preference always wins — this default only applies to someone
      // who has never touched the control.
      return (saved && FONT_SCALES[saved]) ? saved : DEFAULT_FONT_SIZE;
    } catch {
      return DEFAULT_FONT_SIZE;
    }
  });

  // Apply Theme & Font Scale to HTML root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const metaThemeColor = document.getElementById('theme-color-meta');

    // Theme handling
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      body.style.backgroundColor = '#090D16';
      body.style.color = '#FFFFFF';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#090D16');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      body.style.backgroundColor = '#F8FAFC';
      body.style.color = '#000000';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#F8FAFC');
    }

    // Font Scale handling on root html element
    root.setAttribute('data-font-size', fontSize);
    root.style.fontSize = (FONT_SCALES[fontSize] || FONT_SCALES[DEFAULT_FONT_SIZE]).px;

    localStorage.setItem('nyc_app_theme', theme);
    localStorage.setItem('nyc_app_font_scale', fontSize);
  }, [theme, fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /** Steps through the scale and wraps back to the smallest. */
  const cycleFontSize = () => {
    setFontSize(prev => {
      const i = FONT_SIZE_ORDER.indexOf(prev);
      return FONT_SIZE_ORDER[(i + 1) % FONT_SIZE_ORDER.length];
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      isDark: theme === 'dark',
      fontSize,
      fontSizeLabel: (FONT_SCALES[fontSize] || FONT_SCALES[DEFAULT_FONT_SIZE]).label,
      fontSizeStep: (FONT_SCALES[fontSize] || FONT_SCALES[DEFAULT_FONT_SIZE]).step,
      setFontSize,
      cycleFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
