import React, {
  useState,
  createContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

import Dashboard from "./screens/dashboard/Dashboard";
import Chat from "./screens/chat/Chat";
import Health from "./screens/health/Health";
import Settings from "./screens/settings/Settings";
import CalendarScreen from "./screens/calendar/Calendar";
import { LogIn, SignUp, ForgotPassword } from "./screens/log_in";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LogIn" component={LogIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={({ route }) => ({
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
      tabBarActiveTintColor: "#F59E0B",
      tabBarInactiveTintColor: "#6B7280",
    })}
  >
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Chat" component={Chat} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Health" component={Health} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // ignore restoring errors
      }
    };

    restoreToken();
  }, []);

  return (
    <View className="flex-1">
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <NavigationContainer>
          {isAuthenticated ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
}
