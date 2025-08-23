// screens/settings/Settings.tsx
import React, { useState } from "react";
import { useAuth } from "../../controllers/AuthContext";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Switch,
  Alert,
  Linking,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { designTokens } from "../../design-tokens";
import { useTheme } from "../../controllers/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { SettingsStackParamList } from "../../navigation/SettingsNavigator";

// ---- UI helpers (Row / Card) iguales a los tuyos ----
const Row = ({
  icon,
  label,
  subtitle,
  onPress,
  right,
  tokens,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  tokens: any;
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    className="flex-row items-center justify-between px-4 py-3"
    style={{ borderBottomWidth: 1, borderColor: tokens.border }}
  >
    <View className="flex-row items-center flex-1">
      <View
        className="rounded-xl mr-3 p-2"
        style={{ backgroundColor: tokens.background }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-medium" style={{ color: tokens.text }}>
          {label}
        </Text>
        {!!subtitle && (
          <Text className="text-xs mt-0.5" style={{ color: tokens.subtitle }}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    {right ?? (
      <Feather name="chevron-right" size={18} color={tokens.subtitle} />
    )}
  </Pressable>
);

const Card = ({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: any;
}) => (
  <View
    className="rounded-2xl overflow-hidden mt-3"
    style={{
      backgroundColor: tokens.background,
      borderWidth: 1,
      borderColor: tokens.border,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }}
  >
    {children}
  </View>
);

// ✅ TIPADO CORRECTO PARA ESTE STACK
type SettingsNav = StackNavigationProp<SettingsStackParamList, "SettingsHome">;

const Settings: React.FC = () => {
  const { colorScheme, setTheme } = useTheme();
  const scheme = colorScheme;
  const tokens = designTokens[scheme];
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation<SettingsNav>();

  const onSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const goToProfile = () => {
    const params = {
      elderName: user?.name ?? "",
      dob: user?.dob ?? "",
      tags: user?.tags ?? [],
      avatarUrl: user?.avatarUrl,
    };
    // Ir al TAB "Dashboard" y a la screen interna "ElderUserProfile"
    navigation.getParent()?.navigate("Dashboard", {
      screen: "ElderUserProfile",
      params,
    });
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mx-4 mt-2">
        <Text className="text-xl font-bold" style={{ color: tokens.text }}>
          More Options
        </Text>

        {/* Profile card */}
        <Card tokens={tokens}>
          <View className="flex-row items-center px-4 py-4">
            <View
              className="rounded-2xl mr-3 p-3"
              style={{ backgroundColor: tokens.highlight }}
            >
              <Feather name="user" size={20} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold" style={{ color: tokens.text }}>
                {user?.name || user?.email || 'User'}
              </Text>
              <Text className="text-xs" style={{ color: tokens.subtitle }}>
                {user?.email || user?.role || 'Authenticated User'}
              </Text>
            </View>
            <Pressable
              className="rounded-lg px-3 py-2"
              style={{ backgroundColor: tokens.highlight }}
              onPress={goToProfile} // ✅ FIX
            >
              <Text className="text-white font-semibold">View Profile</Text>
            </Pressable>
          </View>
        </Card>

        {/* Settings */}
        <Text
          className="mt-5 mb-1 text-sm font-semibold"
          style={{ color: tokens.subtitle }}
        >
          Settings
        </Text>

        <Card tokens={tokens}>
          <Row
            icon={<Feather name="bell" size={18} color={tokens.subtitle} />}
            label="Notifications"
            tokens={tokens}
            right={
              <Switch value={notifications} onValueChange={setNotifications} />
            }
          />

          {/* Dark Mode (descomentá cuando lo uses)
          <Row
            icon={<Feather name="moon" size={18} color={tokens.subtitle} />}
            label="Dark Mode"
            tokens={tokens}
            right={
              <Switch
                value={scheme === "dark"}
                onValueChange={(v) => setTheme(v ? "dark" : "light")}
              />
            }
          /> */}

          <Row
            icon={<Feather name="sliders" size={18} color={tokens.subtitle} />}
            label="App Settings"
            tokens={tokens}
            onPress={() => Linking.openSettings()}
          />
        </Card>

        {/* Support */}
        <Text
          className="mt-5 mb-1 text-sm font-semibold"
          style={{ color: tokens.subtitle }}
        >
          Support
        </Text>

        <Card tokens={tokens}>
          <Row
            icon={
              <Feather name="help-circle" size={18} color={tokens.subtitle} />
            }
            label="Help Center"
            tokens={tokens}
            onPress={() =>
              navigation.navigate("HelpCenter", { topic: "getting-started" })
            }
          />
          <Row
            icon={
              <Feather name="file-text" size={18} color={tokens.subtitle} />
            }
            label="Terms & Privacy"
            tokens={tokens}
            onPress={() =>
              navigation.navigate("TermsPrivacy", { initialTab: "terms" })
            }
          />
          <Row
            icon={<Feather name="shield" size={18} color={tokens.subtitle} />}
            label="Security"
            tokens={tokens}
            onPress={() =>
              navigation.navigate("Security", { highlight: "overview" })
            }
          />
        </Card>

        {/* Sign out */}
        <Pressable
          onPress={onSignOut}
          className="rounded-2xl mt-5 px-4 py-3 items-center"
          style={{ borderWidth: 1, borderColor: tokens.border }}
        >
          <Text className="font-semibold" style={{ color: tokens.highlight }}>
            Sign Out
          </Text>
        </Pressable>

        {/* Footer */}
        <View className="items-center mt-5 mb-4">
          <Text className="text-xs" style={{ color: tokens.subtitle }}>
            CareConnect v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
