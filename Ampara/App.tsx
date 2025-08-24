import React from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StatusBar, Text } from "react-native";
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
} from "./screens/auth";
import EmotionalCheckIn from "./screens/dashboard/EmotionalCheckIn";
import ElderUserProfile from "./screens/elder_profile/elder_profile";
import CreateElderUser from "./screens/elder_profile/CreateElderUser";
import SettingsNavigator from "./navigation/SettingsNavigator";

import { AuthProvider, useAuth } from "./controllers/AuthContext";
import { designTokens } from "./design-tokens";
import LogoTitle from "./src/components/ui/LogoTitle";
import { ThemeProvider, useTheme } from "./controllers/ThemeContext";
import EmailVerificationScreen from "./screens/auth/EmailVerificationScreen";

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
      <DashboardInnerStack.Screen
        name="CreateElderUser"
        component={CreateElderUser}
        options={{ 
          headerShown: true,
          title: "Add New Elder",
          headerStyle: { backgroundColor: "#fff" },
        }}
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
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </AuthProvider>
  );
}

const AppShell = () => {
  const { colorScheme } = useTheme();
  const { isAuthenticated, isLoading, emailVerificationRequired, user, markEmailVerified, retryAuth } = useAuth();
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

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-text">Loading...</Text>
      </View>
    );
  }

  if (emailVerificationRequired) {
    return (
      <EmailVerificationScreen 
        userEmail={user?.email} 
        onVerificationComplete={markEmailVerified}
        onRetryAuth={retryAuth}
      />
    );
  }

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
