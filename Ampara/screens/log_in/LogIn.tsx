import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const LogIn = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/classProject/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }
      setSuccess("Logged in successfully");
      navigation.navigate("Dashboard" as never);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
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
          <View className="mb-6">
            <TextInput
              placeholder="Email"
              className="border-b border-gray-300 py-2 px-1"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View className="mb-6">
            <View className="flex-row items-center border-b border-gray-300">
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="flex-1 py-2 px-1"
                value={password}
                onChangeText={setPassword}
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
          {error ? (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}
          {success ? (
            <Text className="text-green-500 text-center mb-4">{success}</Text>
          ) : null}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold">Log In</Text>
            )}
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
