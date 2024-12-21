import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode, 
    useEffect 
  } from 'react';
  import { useColorScheme } from 'react-native';
  import { Theme } from '../types';
  
  interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
  }
  
  const lightTheme: Theme = {
    dark: false,
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#007bff',
      secondary: '#6c757d'
    }
  };
  
  const darkTheme: Theme = {
    dark: true,
    colors: {
      background: '#121212',
      text: '#FFFFFF',
      primary: '#3f51b5',
      secondary: '#bb86fc'
    }
  };
  
  const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    toggleTheme: () => {}
  });
  
  export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
    const theme = isDarkMode ? darkTheme : lightTheme;
  
    const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
    };
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useTheme = () => useContext(ThemeContext);