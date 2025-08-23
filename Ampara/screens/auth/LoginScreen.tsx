import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { PrimaryButton } from '../../src/components/ui';
import { LogoTitle } from '../../src/components/ui';
import { useAuth } from '../../controllers/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed',
        'Unable to log you in. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="w-full max-w-sm">
        {/* Logo */}
        <View className="items-center mb-12">
          <LogoTitle />
          <Text className="text-lg text-gray-600 mt-4 text-center">
            Your AI companion for elderly care
          </Text>
        </View>

        {/* Welcome Message */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome to Ampara
          </Text>
          <Text className="text-gray-600 text-center">
            Sign in to continue to your account
          </Text>
        </View>

        {/* Login Button */}
        <PrimaryButton
          title={isLoggingIn ? 'Signing In...' : 'Sign In'}
          onPress={handleLogin}
          disabled={isLoggingIn}
          className="mb-6"
        />

        {/* Loading Indicator */}
        {isLoggingIn && (
          <View className="items-center">
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        )}

        {/* Info Text */}
        <Text className="text-sm text-gray-500 text-center mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;