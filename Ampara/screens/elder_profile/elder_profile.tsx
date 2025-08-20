import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";

const ElderUserProfile = () => {
  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="mx-4 mb-4">
          <Text>ElderUserProfile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ElderUserProfile;
