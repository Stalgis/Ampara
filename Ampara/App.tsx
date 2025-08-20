import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import EmotionalCheckIn from "./screens/dashboard/EmotionalCheckIn";
import ElderUserProfile from "./screens/elder_profile/elder_profile";

import { AuthContext } from "./controllers/AuthContext";
import { designTokens } from "./design-tokens";
import LogoTitle from "./src/components/ui/LogoTitle";

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
      options={{ headerTitle: () => <LogoTitle title="Welcome" /> }}
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
  </AuthStackNav.Navigator>
);

/** Tabs principales de la app autenticada */
const MainTabs = () => {
  const scheme = useColorScheme() ?? "light";
  const tokens = designTokens[scheme];

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
        component={Settings}
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
        }}
      />
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
        if (token) setIsAuthenticated(true);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <View className="flex-1">
        <NavigationContainer>
          {isAuthenticated ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </View>
    </AuthContext.Provider>
  );
}
