import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Alert } from "react-native";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

import Dashboard from "./screens/dashboard/Dashboard";
import Chat from "./screens/chat/Chat";
import Health from "./screens/health/Health";
import Settings from "./screens/settings/Settings";
import CalendarScreen from "./screens/calendar/Calendar";
import {
  LogIn,
  SignUp,
  ForgotPassword,
  WelcomeScreen,
  CreateElderUser,
} from "./screens/auth";
import EmotionalCheckIn from "./screens/dashboard/EmotionalCheckIn";
import ElderUserProfile from "./screens/elder_profile/elder_profile";
import SettingsNavigator from "./navigation/SettingsNavigator";

import { AuthContext, User } from "./controllers/AuthContext";
import { designTokens } from "./design-tokens";
import LogoTitle from "./src/components/ui/LogoTitle";
import { ThemeProvider, useTheme } from "./controllers/ThemeContext";
import apiFetch from "./services/api";

// Navegadores
const Tab = createBottomTabNavigator();
const AuthStackNav = createStackNavigator();
const DashboardInnerStack = createStackNavigator();

/** Stack interno SOLO para la tab Dashboard */
function DashboardStackScreen() {
  return (
    <DashboardInnerStack.Navigator
      screenOptions={{
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: true,
      }}
    >
      {/* Home de la tab Dashboard (sin header porque la Tab ya lo maneja) */}
      <DashboardInnerStack.Screen
        name="DashboardHome"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      {/* Detalle accesible desde Dashboard */}
      <DashboardInnerStack.Screen
        name="EmotionalCheckIns"
        component={EmotionalCheckIn}
        options={{ headerShown: false }}
      />
      <DashboardInnerStack.Screen
        name="ElderUserProfile"
        component={ElderUserProfile}
        options={{ headerShown: false }}
      />
    </DashboardInnerStack.Navigator>
  );
}

/** Auth Stack (igual, pero con screenOptions estático y títulos por pantalla) */
const AuthStack = () => (
  <AuthStackNav.Navigator
    screenOptions={{
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#fff" },
      headerShadowVisible: true,
    }}
  >
    <AuthStackNav.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <AuthStackNav.Screen
      name="LogIn"
      component={LogIn}
      options={{ headerShown: false }}
    />
    <AuthStackNav.Screen
      name="SignUp"
      component={SignUp}
      options={{ headerShown: false }}
    />
    <AuthStackNav.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ headerShown: false }}
    />
    <AuthStackNav.Screen
      name="CreateElderUser"
      component={CreateElderUser}
      options={{ headerShown: false }}
    />
  </AuthStackNav.Navigator>
);

/** Tabs principales de la app autenticada */
const MainTabs = () => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerTitleAlign: "left",
        tabBarActiveTintColor: tokens.highlight,
        tabBarInactiveTintColor: tokens.subtitle,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackScreen}
        options={{
          headerTitle: () => <LogoTitle title="Ampara" />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                (focused
                  ? "home"
                  : "home-outline") as keyof typeof Ionicons.glyphMap
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          headerTitle: () => <LogoTitle title="Chat" />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                (focused
                  ? "chatbox-ellipses"
                  : "chatbox-ellipses-outline") as keyof typeof Ionicons.glyphMap
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerTitle: () => <LogoTitle title="Calendar" />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                (focused
                  ? "calendar"
                  : "calendar-outline") as keyof typeof Ionicons.glyphMap
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Health}
        options={{
          headerTitle: () => <LogoTitle title="Health" />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                (focused
                  ? "heart"
                  : "heart-outline") as keyof typeof Ionicons.glyphMap
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator} // ⬅️ antes era `Settings`
        options={{
          headerTitle: () => <LogoTitle title="Settings" />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                (focused
                  ? "settings"
                  : "settings-outline") as keyof typeof Ionicons.glyphMap
              }
              size={size}
              color={color}
            />
          ),
          headerShown: false, // opcional si el stack maneja su propio header
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) setIsAuthenticated(true);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
    } catch (e) {
      console.error("Failed to remove token", e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/user/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to load user", err);
        Alert.alert("Network Error", "Unable to load user information.");
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser, signOut }}
    >
      <ThemeProvider>
        <AppShell isAuthenticated={isAuthenticated} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

const AppShell = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];
  const baseTheme =
    colorScheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: tokens.primary,
      background: tokens.background,
      card: tokens.background,
      text: tokens.text,
      border: tokens.border,
      notification: tokens.accent,
    },
  };
  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <View className="flex-1 bg-background dark:bg-background-dark">
        <NavigationContainer theme={navTheme}>
          {isAuthenticated ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </View>
    </>
  );
};
