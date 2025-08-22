import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading, Body } from "../../src/components/ui";

export default function SecurityScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Heading>Security</Heading>

        <Text className="text-lg font-semibold mt-6">Overview</Text>
        <Body className="mt-2">
          Ampara follows security best practices including encryption in transit
          (HTTPS/TLS) and role-based access controls. This page is a concise
          overview for users.
        </Body>

        <Text className="text-lg font-semibold mt-6">Your Account</Text>
        <Body className="mt-2">
          • Use a strong password and enable screen lock on your device.
        </Body>
        <Body>
          • Don’t share your access token or device with untrusted users.
        </Body>

        <Text className="text-lg font-semibold mt-6">Reporting</Text>
        <Body className="mt-2">
          If you suspect a security issue, email: security@getampara.app
        </Body>
      </ScrollView>
    </SafeAreaView>
  );
}
