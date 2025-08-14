import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="w-full max-w-md bg-white/10 rounded-2xl p-8 border border-border">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-32 h-32 mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-text">
            Forgot Password
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-text text-base font-semibold mb-2">
            Email
          </Text>
          <TextInput
            className="border border-border rounded-2xl py-3 px-4 text-lg bg-white/70"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity className="bg-primary rounded-2xl py-4 shadow-md mb-4">
          <Text className="text-white text-center text-lg font-semibold">
            Send Reset Link
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-2">
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text className="text-accent font-semibold">Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
