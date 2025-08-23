import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { SecondaryButton } from '../src/components/ui';
import { useAuth } from '../controllers/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert(
                'Logout Failed',
                'Unable to sign you out. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* User Info */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {user.name || 'User'}
        </Text>
        {user.email && (
          <Text className="text-sm text-gray-600">{user.email}</Text>
        )}
      </View>

      {/* User Avatar/Picture */}
      {user.picture && (
        <View className="mb-4 items-center">
          <TouchableOpacity className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {/* Note: You'll need to implement image loading for React Native */}
            <View className="w-full h-full bg-blue-500 justify-center items-center">
              <Text className="text-white font-semibold">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Logout Button */}
      <SecondaryButton
        title={isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        onPress={handleLogout}
        disabled={isLoggingOut || isLoading}
      />
    </View>
  );
};

export default UserProfile;