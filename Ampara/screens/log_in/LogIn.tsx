import { View, TouchableOpacity, TextInput, Image, Text } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../controllers/AuthContext";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { Heading, Body } from "../../src/components/ui";

// import AsyncStorage from "@react-native-async-storage/async-storage"; // Commented out as per new requirements

// import { AuthContext } from "../../context/AuthContext"; // Corrected import path
// import apiFetch from "../../services/api"; // Commented out as per new requirements

const LogIn = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    setError(null);
    // authentication logic omitted
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <Card className="w-full max-w-md bg-background rounded-xl p-8 border border-border">
        <View className="items-center mb-4">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <Heading className="text-text">Ampara</Heading>
        </View>

        {error && (
          <Body className="text-red-500 text-center mb-4">{error}</Body>
        )}

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
                color="gray"
              />
            </TouchableOpacity>
          }
        />

        <PrimaryButton
          title="Log In"
          onPress={() => setIsAuthenticated(true)}
          className="mb-4 shadow-md"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mt-2"
        >
          <Text className="text-center text-accent">Forgot Password?</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-subtitle">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-accent font-semibold ml-1">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default LogIn;
