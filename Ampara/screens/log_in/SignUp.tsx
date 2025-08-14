import { View, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heading, Subheading, Body } from "../../src/components/ui";

// import { AuthContext } from '../../context/AuthContext'
import apiFetch from "../../services/api";

const SignUp = () => {
  const navigation = useNavigation();
  // const { setIsAuthenticated } = useContext(AuthContext)
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
      // setIsAuthenticated(true)
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-6">
      <View className="w-full max-w-md bg-white/10 rounded-xl p-8 border border-border bg-white">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-32 h-32 mb-2"
            resizeMode="contain"
          />
          <Heading>Sign Up</Heading>
        </View>

        {error && (
          <Body className="text-red-500 text-center mb-4">{error}</Body>
        )}

        <View className="mb-6">
          <Subheading className="text-gray-700 text-base mb-2">
            Full Name
          </Subheading>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-gray-300 rounded-lg py-3 px-4 text-lg bg-white/70"
          />
        </View>

        <View className="mb-6">
          <Subheading className="text-gray-700 text-base mb-2">
            Email
          </Subheading>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg py-3 px-4 text-lg bg-white/70"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Subheading className="text-gray-700 text-base mb-2">
            Password
          </Subheading>
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

        <View className="mb-6">
          <Subheading className="text-gray-700 text-base mb-2">
            Connect to Elder (Name or ID)
          </Subheading>
          <TextInput
            value={elder}
            onChangeText={setElder}
            className="border border-gray-300 rounded-lg py-3 px-4 text-lg bg-white/70"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-primary rounded-xl py-4 shadow-md mb-4"
        >
          <Subheading className="text-white text-center">Sign Up</Subheading>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Body className="text-gray-600">Already have an account?</Body>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Subheading className="text-accent ml-1">Log In</Subheading>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
