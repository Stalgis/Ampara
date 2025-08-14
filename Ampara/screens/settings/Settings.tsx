import React from "react";
import { SafeAreaView, View, Text } from "react-native";

const Settings = () => {
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="flex-1 mx-4 items-center justify-center">
        <Text className="text-2xl text-text">Settings Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
