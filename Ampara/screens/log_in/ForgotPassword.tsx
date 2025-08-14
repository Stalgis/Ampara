import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";

const ForgotPassword = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <Card className="w-full max-w-md p-8">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-32 h-32 mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-800">
            Forgot Password
          </Text>
        </View>

        <FormInput
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PrimaryButton
          title="Send Reset Link"
          className="mb-4 shadow-md"
        />

        <View className="flex-row justify-center mt-2">
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text className="text-accent font-semibold">Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default ForgotPassword;
