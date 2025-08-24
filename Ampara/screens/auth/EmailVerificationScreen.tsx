import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../controllers/AuthContext";
import { Body, Heading } from "../../src/components/ui";
import Card from "../../src/components/ui/Card";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { designTokens } from "../../design-tokens";
import { useTheme } from "../../controllers/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EmailVerificationScreenProps {
  userEmail?: string;
  accessToken?: string;
  onVerificationComplete: () => void;
  onRetryAuth: () => void;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ 
  userEmail,
  accessToken,
  onVerificationComplete,
  onRetryAuth
}) => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkVerificationStatus = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      // Instead of checking verification status, we'll trigger a new login
      // This will get fresh user info from Auth0 including updated email_verified status
      onRetryAuth();
    } catch (error: any) {
      setError("Failed to check verification status. Please try again.");
      setIsChecking(false);
    }
  };

  // Auto-check every 30 seconds (less frequent to avoid spam)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isChecking) {
        checkVerificationStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isChecking]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <Card className="w-full max-w-md bg-background rounded-xl p-8 border border-border">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-highlight rounded-full items-center justify-center mb-4">
            <Ionicons name="mail" size={40} color="white" />
          </View>
          <Heading className="text-text text-center">Check Your Email</Heading>
          <Body className="text-subtitle text-center mt-2">
            We sent a verification link to
          </Body>
          <Body className="text-highlight text-center font-semibold">
            {userEmail || "your email address"}
          </Body>
        </View>

        <View className="mb-6">
          <Body className="text-text text-center mb-4">
            Click the link in your email to verify your account, then return to the app.
          </Body>
          
          {isChecking && (
            <View className="flex-row items-center justify-center mb-4">
              <ActivityIndicator size="small" color={tokens.highlight} />
              <Text className="text-subtitle ml-2">Checking verification...</Text>
            </View>
          )}

          {error && (
            <Body className="text-red-500 text-center mb-4">{error}</Body>
          )}
        </View>

        <PrimaryButton
          title={isChecking ? "Checking..." : "I've Verified My Email"}
          onPress={checkVerificationStatus}
          disabled={isChecking}
          className="shadow-md"
        />

        <Body className="text-subtitle text-center mt-4 text-sm">
          Didn't receive an email? Check your spam folder or wait a few minutes.
        </Body>
      </Card>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;