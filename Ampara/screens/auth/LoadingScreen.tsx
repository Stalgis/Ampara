import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { LogoTitle } from '../../src/components/ui';

export const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <LogoTitle />
      <ActivityIndicator size="large" color="#3B82F6" className="mt-8" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
};

export default LoadingScreen;