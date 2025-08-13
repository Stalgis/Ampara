import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../App";
import apiFetch from "../../services/api";

const LogIn = () => {
  const navigation = useNavigation();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Login failed");
        return;
      }

      const { access_token, user } = await response.json();
      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } catch (e) {
      setError("Login failed");
    }
  };

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
          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          )}
          <View className="mb-6">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="border-b border-gray-300 py-2 px-1"
              autoCapitalize="none"
            />
          </View>
          <View className="mb-6">
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
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
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3"
            onPress={handleLogin}
          >
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
