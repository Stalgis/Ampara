import {
  View,
  TouchableOpacity,
  Alert,
  Image,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TextInput,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../controllers/AuthContext";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { Heading, Body } from "../../src/components/ui";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiFetch from "../../services/api";

type AuthNav = NativeStackNavigationProp<AuthStackParamList>;

const LogIn = () => {
  const navigation = useNavigation<AuthNav>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  // const handleLogin = async () => {
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const response = await apiFetch("/auth/login", {
  //       method: "POST",
  //       body: JSON.stringify({ email, password }),
  //     });
  //     if (!response.ok) {
  //       const message = await response.text();
  //       setError(message || "Login failed");
  //       return;
  //     }
  //     const { access_token } = await response.json();
  //     await AsyncStorage.setItem("access_token", access_token);
  //     setIsAuthenticated(true);
  //     try {
  //       const userRes = await apiFetch("/user/me");
  //       if (userRes.ok) {
  //         const userData = await userRes.json();
  //         setUser(userData);
  //       }
  //     } catch (err) {
  //       Alert.alert(
  //         "Server Unavailable",
  //         "Could not fetch user information. Please check the server URL or try again later."
  //       );
  //     }
  //   } catch (e) {
  //     setError("Server unavailable. Please check the server URL or try again.");
  //     Alert.alert(
  //       "Server Unavailable",
  //       "Unable to reach the server. Please check the server URL or your connection.",
  //       [{ text: "Retry", onPress: handleLogin }, { text: "OK" }]
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // 🧪 Mock: validación mínima en el cliente
      const trimmedEmail = email.trim();
      const trimmedPass = password.trim();

      if (!trimmedEmail || !trimmedPass) {
        setError("Please enter email and password");
        return;
      }

      // 💤 Simulá latencia de red (opcional)
      await new Promise((r) => setTimeout(r, 400));

      // 🎟️ Token fake y usuario fake
      const fakeToken = "dev.mock.token";
      await AsyncStorage.setItem("access_token", fakeToken);

      // Podés adaptar las keys según tu tipo User
      setUser({
        _id: "dev-user-id",
        name: "Developer",
        email: trimmedEmail,
        role: "FAMILIAR", // o el rol que uses por defecto
      } as any);

      setIsAuthenticated(true);
      // Si necesitás navegar explícitamente, hacelo acá
      // navigation.replace("MainTabs"); // ej.
    } catch (e) {
      setError("Mock login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <FormInput
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
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

            <PrimaryButton
              title={loading ? "Loading..." : "Log In"}
              onPress={handleLogin}
              disabled={loading}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LogIn;
