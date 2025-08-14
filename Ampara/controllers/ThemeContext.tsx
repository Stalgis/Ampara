import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeWindStyleSheet } from "nativewind";

export type ThemePreference = "light" | "dark" | "system";

export type ThemeContextValue = {
  theme: ThemePreference;
  colorScheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
};

const THEME_KEY = "theme_preference";

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  colorScheme: "light",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemePreference>("system");

  const colorScheme = theme === "system" ? systemColorScheme || "light" : theme;

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    NativeWindStyleSheet.setColorScheme(colorScheme);
  }, [colorScheme]);

  const setTheme = (value: ThemePreference) => {
    setThemeState(value);
    AsyncStorage.setItem(THEME_KEY, value);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

