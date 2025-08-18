import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

import Dashboard from "./screens/dashboard/Dashboard";
import Chat from "./screens/chat/Chat";
import Health from "./screens/health/Health";
import Settings from "./screens/settings/Settings";
import CalendarScreen from "./screens/calendar/Calendar";
import { LogIn, SignUp, ForgotPassword, WelcomeScreen } from "./screens/log_in";
import { AuthContext } from "./controllers/AuthContext";
import { designTokens } from "./design-tokens";
import LogoTitle from "./src/components/ui/LogoTitle";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={({ route }) => ({
      headerTitleAlign: "left",
      headerTitle: () => <LogoTitle title={route.name} />,
      headerStyle: { backgroundColor: "#fff" }, // opcional
      headerShadowVisible: true, // opcional
    })}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="LogIn" component={LogIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const scheme = useColorScheme() ?? "light";
  const tokens = designTokens[scheme];
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerTitleAlign: "left",
        headerTitle: () => (
          <LogoTitle
            title={route.name === "Dashboard" ? "Ampara" : route.name}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";
          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Chat":
              iconName = focused
                ? "chatbox-ellipses"
                : "chatbox-ellipses-outline";
              break;
            case "Calendar":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Health":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
          }
          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: tokens.highlight,
        tabBarInactiveTintColor: tokens.subtitle,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Health" component={Health} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeProvider>
        <AppNavigation isAuthenticated={isAuthenticated} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
