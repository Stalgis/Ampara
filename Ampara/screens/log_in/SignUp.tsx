import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Text,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Body } from "../../src/components/ui";

import apiFetch from "../../services/api";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";

const SignUp = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [elder, setElder] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-6">
      <Card className="w-full max-w-md p-8">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-32 h-32 mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-text">Sign Up</Text>
          <Text className="text-3xl font-bold text-text">Sign Up</Text>
        </View>

        {error && (
          <Body className="text-red-500 text-center mb-4">{error}</Body>
        )}

        <FormInput label="Full Name" value={name} onChangeText={setName} />

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={
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
                color="#6B7280"
              />
            </TouchableOpacity>
          }
        />
        <FormInput
          label="Connect to Elder (Name or ID)"
          value={elder}
          onChangeText={setElder}
        />

        <PrimaryButton
          title="Sign Up"
          onPress={handleSignUp}
          className="mb-4 shadow-md"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-subtitle">Already have an account?</Text>
          <Text className="text-subtitle">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text className="text-accent font-semibold ml-1">Log In</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default SignUp;
