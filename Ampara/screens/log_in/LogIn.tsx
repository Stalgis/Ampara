import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../controllers/AuthContext";

// import AsyncStorage from "@react-native-async-storage/async-storage"; // Commented out as per new requirements

// import { AuthContext } from "../../context/AuthContext"; // Corrected import path
// import apiFetch from "../../services/api"; // Commented out as per new requirements

const LogIn = () => {
  const navigation = useNavigation();
  //   const { setIsAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    setError(null);
    // Commented out actual login functionality as per new requirements
    // try {
    //   const response = await apiFetch("/auth/login", {
    //     method: "POST",
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!response.ok) {
    //     const message = await response.text();
    //     setError(message || "Login failed");
    //     return;
    //   }

    //   const { access_token, user } = await response.json();
    //   await AsyncStorage.setItem("access_token", access_token);
    //   await AsyncStorage.setItem("user", JSON.stringify(user));
    //   setIsAuthenticated(true);
    // } catch (e) {
    //   setError("Login failed");
    // }
    // setIsAuthenticated(true); // Temporarily navigate to dashboard
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="w-full max-w-md bg-white/10 rounded-xl p-8 border border-border bg-white">
        <View className="items-center mb-4">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-text">Ampara</Text>
        </View>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-2 pl-3">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg py-3 px-4 text-lg bg-white/70"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-2 pl-3">
            Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg bg-white/70">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 py-3 px-4 text-lg"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
              hitSlop={8}
              className="p-3"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 shadow-md mb-4"
          onPress={() => setIsAuthenticated(true)}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Log In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mt-2"
        >
          <Text className="text-center text-accent font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-accent font-semibold ml-1">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogIn;
