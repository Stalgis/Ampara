import React from "react";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading, Body } from "../../src/components/ui"; // ajusta la ruta si cambia

export default function HelpCenterScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Heading>Help Center</Heading>
        <Body className="mt-2">
          Welcome to the Ampara Help Center. Here are quick answers and ways to
          reach us.
        </Body>

        <Text className="text-lg font-semibold mt-6">FAQ</Text>
        <Body className="mt-2">
          • How do I reset my password? Go to Settings → Forgot Password.
        </Body>
        <Body>• How do I contact support? See the section below.</Body>

        <Text className="text-lg font-semibold mt-6">Contact</Text>
        <Body className="mt-2">Email: support@getampara.app</Body>
        <Body>Hours: Mon–Fri, 9:00–17:00 (AEST)</Body>

        <Text className="text-lg font-semibold mt-6">Troubleshooting</Text>
        <Body className="mt-2">
          • Try logging out/in, check your internet, and update to the latest
          version.
        </Body>
      </ScrollView>
    </SafeAreaView>
  );
}
