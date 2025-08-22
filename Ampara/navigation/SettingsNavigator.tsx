// navigation/SettingsNavigator.tsx
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Tipos opcionales (si no querés, podés dejarlos en undefined)
export type SettingsStackParamList = {
  SettingsHome: undefined;
  HelpCenter: { topic?: string } | undefined;
  TermsPrivacy: { initialTab?: "terms" | "privacy" } | undefined;
  Security: { highlight?: "overview" | "account" | "reporting" } | undefined;
};

// Screens
import Settings from "../screens/settings/Settings";
import HelpCenterScreen from "../screens/settings/HelpCenterScreen";
import TermsPrivacyScreen from "../screens/settings/TermsPrivacyScreen";
import SecurityScreen from "../screens/settings/SecurityScreen";

const SettingsInnerStack = createStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <SettingsInnerStack.Navigator>
      <SettingsInnerStack.Screen
        name="SettingsHome"
        component={Settings}
        options={{ title: "Settings" }}
      />
      <SettingsInnerStack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{ title: "Help Center" }}
      />
      <SettingsInnerStack.Screen
        name="TermsPrivacy"
        component={TermsPrivacyScreen}
        options={{ title: "Terms & Privacy" }}
      />
      <SettingsInnerStack.Screen
        name="Security"
        component={SecurityScreen}
        options={{ title: "Security" }}
      />
    </SettingsInnerStack.Navigator>
  );
}
