import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import apiFetch from "../../services/api";

const SignUp = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [elder, setElder] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setError(null);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, elderConnection: elder }),
      });

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Registration failed");
        return;
      }

      const { access_token, user } = await response.json();
      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="w-full max-w-md bg-background rounded-xl p-8 border border-border">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-32 h-32 mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-text">Sign Up</Text>
        </View>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2">
            Full Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-border rounded-lg py-3 px-4 text-lg bg-background/70"
          />
        </View>

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border border-border rounded-lg py-3 px-4 text-lg bg-background/70"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2">
            Password
          </Text>
          <View className="flex-row items-center border border-border rounded-lg bg-background/70">
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

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2">
            Connect to Elder (Name or ID)
          </Text>
          <TextInput
            value={elder}
            onChangeText={setElder}
            className="border border-border rounded-lg py-3 px-4 text-lg bg-background/70"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-primary rounded-xl py-4 shadow-md mb-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-subtitle">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}> 
            <Text className="text-accent font-semibold ml-1">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
