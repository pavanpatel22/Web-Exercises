import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

// Define our theme structure
const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
    border: '#dee2e6'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  },
  typography: {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif'
  }
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#0d6efd',
    secondary: '#5a6268',
    background: '#121212',
    text: '#f8f9fa',
    border: '#495057'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  },
  typography: {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif'
  }
};

// Create contexts
const ThemeReadContext = createContext(lightTheme);
const ThemeDispatchContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);

  // Memoized theme object for referential stability
  const currentTheme = useMemo(() => theme, [theme]);

  // Memoized dispatch functions
  const dispatch = useMemo(() => ({
    toggleTheme: () => {
      setTheme(current => current.mode === 'light' ? darkTheme : lightTheme);
    },
    setLightTheme: () => setTheme(lightTheme),
    setDarkTheme: () => setTheme(darkTheme),
    updateTheme: (updates) => {
      setTheme(current => ({
        ...current,
        ...updates,
        colors: { ...current.colors, ...updates.colors },
        spacing: { ...current.spacing, ...updates.spacing },
        typography: { ...current.typography, ...updates.typography }
      }));
    }
  }), []);

  return (
    <ThemeReadContext.Provider value={currentTheme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeReadContext.Provider>
  );
}

// Hook to read theme
export function useTheme() {
  const theme = useContext(ThemeReadContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

// Hook to get theme dispatch functions
export function useThemeDispatch() {
  const dispatch = useContext(ThemeDispatchContext);
  if (!dispatch) {
    throw new Error('useThemeDispatch must be used within a ThemeProvider');
  }
  return dispatch;
}

// Optimized selector hook - only re-renders when selected value changes
export function useThemeSelector(selector) {
  const theme = useContext(ThemeReadContext);
  
  if (!theme) {
    throw new Error('useThemeSelector must be used within a ThemeProvider');
  }

  const selectedValue = useMemo(() => selector(theme), [theme, selector]);

  return selectedValue;
}

// Custom optimized hooks for common theme properties
export function useThemeColors() {
  return useThemeSelector(theme => theme.colors);
}

export function useThemeMode() {
  return useThemeSelector(theme => theme.mode);
}

export function useThemeSpacing() {
  return useThemeSelector(theme => theme.spacing);
}

// Component using the theme with selector optimization
export function ThemedButton({ children, onClick }) {
  // Only re-renders when colors.primary changes
  const primaryColor = useThemeSelector(theme => theme.colors.primary);
  const spacing = useThemeSpacing();

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: primaryColor,
        color: 'white',
        padding: `${spacing.small} ${spacing.medium}`,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}

export function ThemeToggle() {
  const { toggleTheme } = useThemeDispatch();
  const mode = useThemeMode(); // Only re-renders when mode changes

  return (
    <button onClick={toggleTheme}>
      Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

export function Header() {
  // Only re-renders when background color or text color changes
  const backgroundColor = useThemeSelector(theme => theme.colors.background);
  const textColor = useThemeSelector(theme => theme.colors.text);
  const spacing = useThemeSpacing();

  return (
    <header style={{
      backgroundColor,
      color: textColor,
      padding: spacing.medium,
      borderBottom: `1px solid ${useThemeSelector(theme => theme.colors.border)}`
    }}>
      <h1>My App Header</h1>
      <ThemeToggle />
    </header>
  );
}

// Demo component showing the optimization benefits
export function ThemeDebug() {
  const theme = useTheme(); // Re-renders on any theme change
  const primaryColor = useThemeSelector(theme => theme.colors.primary); // Only re-renders when primary color changes

  console.log('ThemeDebug rendered');

  return (
    <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #ccc' }}>
      <h3>Theme Debug (Check console for re-renders)</h3>
      <p>Full theme re-renders: {Math.random()}</p>
      <p>Primary color only: {primaryColor}</p>
      <p>Current mode: {theme.mode}</p>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <main style={{ padding: '20px' }}>
          <ThemedButton onClick={() => console.log('Clicked!')}>
            Optimized Themed Button
          </ThemedButton>
          <ThemeDebug />
        </main>
      </div>
    </ThemeProvider>
  );
}