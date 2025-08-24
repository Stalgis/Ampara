import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../controllers/AuthContext";
import { Body, Heading } from "../../src/components/ui";
import Card from "../../src/components/ui/Card";
import PrimaryButton from "../../src/components/ui/PrimaryButton";

const SignUp = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      // Auth0 handles both login and signup in their universal login flow
      await login();
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");
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
          <Heading className="text-text">Join Ampara</Heading>
          <Body className="text-subtitle text-center mt-2">
            Create your account to start caring
          </Body>
        </View>

        {error && (
          <Body className="text-red-500 text-center mb-4">{error}</Body>
        )}

        <PrimaryButton
          title={loading ? "Creating account..." : "Sign up with Auth0"}
          onPress={handleSignUp}
          disabled={loading}
          className="shadow-md mb-4"
        />

        <Body className="text-subtitle text-center mt-4 text-sm">
          Secure account creation powered by Auth0
        </Body>

        {/* Footer link */}
        <View className="flex-row justify-center mt-6">
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