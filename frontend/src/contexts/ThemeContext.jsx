import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    // Eliminamos los estilos inline en JS para que index.css controle el background
    localStorage.setItem('theme', 'dark');
  }, [theme]);

  const toggleTheme = () => {
    // Deshabilitado: Forzamos Dark Mode
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
