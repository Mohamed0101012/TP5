import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du thème:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du thème:", error);
    }
  };

  const colors = {
    light: {
      background: "#ffffff",
      text: "#000000",
      primary: "#007AFF",
      secondary: "#5856D6",
      border: "#E5E5EA",
      card: "#F2F2F7",
    },
    dark: {
      background: "#000000",
      text: "#ffffff",
      primary: "#0A84FF",
      secondary: "#5E5CE6",
      border: "#38383A",
      card: "#1C1C1E",
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: colors[theme],
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
