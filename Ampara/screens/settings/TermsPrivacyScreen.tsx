import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading, Body } from "../../src/components/ui";

export default function TermsPrivacyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Heading>Terms & Privacy</Heading>

        <Text className="text-lg font-semibold mt-6">Terms of Service</Text>
        <Body className="mt-2">
          By using Ampara, you agree to our terms, including acceptable use,
          account responsibilities, and limitations of liability. This is a
          placeholder for your legal copy.
        </Body>

        <Text className="text-lg font-semibold mt-6">Privacy Policy</Text>
        <Body className="mt-2">
          We collect only the data necessary to provide our services. We never
          sell personal data. You can request export or deletion of your data at
          any time: privacy@getampara.app
        </Body>

        <Text className="text-lg font-semibold mt-6">Data Retention</Text>
        <Body className="mt-2">
          Retention periods are documented and reviewed periodically.
        </Body>
      </ScrollView>
    </SafeAreaView>
  );
}
