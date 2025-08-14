import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="items-center mb-12">
        <Image
          source={require("../../assets/Ampara_logo.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-gray-800 font-mono">
          AMPARA
        </Text>
      </View>

      <View className="w-full max-w-sm">
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 mb-4 shadow-md"
          onPress={() => navigation.navigate("LogIn")}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-accent rounded-xl py-4 shadow-md"
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
