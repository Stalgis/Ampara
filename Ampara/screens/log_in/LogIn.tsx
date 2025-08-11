import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const LogIn = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-6">
        <View className="flex-1 justify-center">
          <View className="items-center mb-10">
            <Image
              source={require("../../assets/Ampara_logo.png")}
              className="w-48 h-48"
            />
          </View>
          <View className="mb-6">
            <TextInput
              placeholder="Email"
              className="border-b border-gray-300 py-2 px-1"
            />
          </View>
          <View className="mb-6">
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="flex-1 py-2 px-1"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                hitSlop={8}
                style={{ position: "absolute", right: 8 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className="bg-blue-500 rounded-lg py-3">
            <Text className="text-white text-center font-bold">Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="mt-4"
          >
            <Text className="text-center text-gray-500">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Text className="text-gray-500">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-blue-500 font-bold ml-1">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogIn;
