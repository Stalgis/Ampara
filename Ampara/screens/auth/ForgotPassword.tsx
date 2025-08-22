import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";

const ForgotPassword = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
          <Card className="w-full max-w-md p-8">
            <View className="items-center mb-8">
              <Image
                source={require("../../assets/Ampara_logo.png")}
                className="w-32 h-32 mb-2"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-text">Forgot Password</Text>
            </View>
            <FormInput
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <PrimaryButton title="Send Reset Link" className="mb-4 shadow-md" />

            <View className="flex-row justify-center mt-2">
              <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
                <Text className="text-accent">Back to Log In</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
