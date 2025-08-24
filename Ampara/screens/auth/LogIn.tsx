import {
  View,
  Image,
  Text,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../controllers/AuthContext";
import Card from "../../src/components/ui/Card";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { Heading, Body } from "../../src/components/ui";

const LogIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
      await login();
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <Card className="w-full max-w-md bg-background rounded-xl p-8 border border-border">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <Heading className="text-text">Ampara</Heading>
          <Body className="text-subtitle text-center mt-2">
            Connect with your loved ones
          </Body>
        </View>

        {error && (
          <Body className="text-red-500 text-center mb-4">{error}</Body>
        )}

        <PrimaryButton
          title={loading ? "Signing in..." : "Sign in with Auth0"}
          onPress={handleLogin}
          disabled={loading}
          className="shadow-md"
        />

        <Body className="text-subtitle text-center mt-6 text-sm">
          Secure authentication powered by Auth0
        </Body>
      </Card>
    </SafeAreaView>
  );
};

export default LogIn;
