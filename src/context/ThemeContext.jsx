import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

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
      return saved || 'normal'; // 'normal', 'large', 'xlarge'
    } catch {
      return 'normal';
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
    if (fontSize === 'xlarge') {
      root.style.fontSize = '19.5px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '17.5px';
    } else {
      root.style.fontSize = '16px';
    }

    localStorage.setItem('nyc_app_theme', theme);
    localStorage.setItem('nyc_app_font_scale', fontSize);
  }, [theme, fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      isDark: theme === 'dark',
      fontSize,
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
