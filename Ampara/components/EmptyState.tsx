import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <View className="items-center justify-center py-10">
    <Text className="text-subtitle dark:text-subtitle-dark">{message}</Text>
  </View>
);

export default EmptyState;
