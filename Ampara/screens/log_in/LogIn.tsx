import { View, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../controllers/AuthContext";
import { Heading, Subheading, Body } from "../../src/components/ui";

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
      <View className="w-full max-w-md bg-background rounded-xl p-8 border border-border">
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

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2 pl-3">
            Email
          </Subheading>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border border-border rounded-lg py-3 px-4 text-lg bg-background/70"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Text className="text-subtitle text-base font-semibold mb-2 pl-3">
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

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 shadow-md mb-4"
          onPress={() => setIsAuthenticated(true)}
        >
          <Subheading className="text-white text-center">Log In</Subheading>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mt-2"
        >
          <Subheading className="text-center text-accent">Forgot Password?</Subheading>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-subtitle">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}> 
            <Text className="text-accent font-semibold ml-1">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogIn;
