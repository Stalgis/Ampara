import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const EmotionalCheckIns = () => {
  const route = useRoute();
  const { name = "Unknown" } = (route.params as { name?: string }) || {};
  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="flex-1 bg-background p-4">
          <Text className="text-xl font-bold text-text mb-2">
            Emotional Check-ins
          </Text>
          <Text className="text-subtitle mb-4">
            Track moods over time and view insights
          </Text>

          {/* Graph placeholder */}
          <View className="h-48 border border-border rounded-lg bg-white mb-6 items-center justify-center">
            <Text className="text-subtitle">[ Mood Graph Here ]</Text>
          </View>

          {/* Weekly Summary */}
          <View className="border border-border rounded-lg p-4 mb-6 bg-background">
            <Text className="font-bold text-lg text-text mb-2">
              Weekly Summary
            </Text>
            <Text className="text-sm text-subtitle">
              Mostly positive moods this week, with mild changes midweek. No
              major concerns.
            </Text>
          </View>

          {/* Mood Logs */}
          <Text className="font-bold text-lg text-text mb-3">Mood Log</Text>
          <View className="space-y-3">
            <View className="border border-border rounded-lg p-3 bg-background">
              <Text className="font-bold text-base">Mon, Aug 11</Text>
              <Text className="text-green-600">😊 Happy</Text>
              <Text className="text-subtitle text-sm mt-1">
                Had a nice call with family.
              </Text>
            </View>
            <View className="border border-border rounded-lg p-3 bg-background">
              <Text className="font-bold text-base">Tue, Aug 12</Text>
              <Text className="text-orange-500">😐 Neutral</Text>
              <Text className="text-subtitle text-sm mt-1">Quiet day.</Text>
            </View>
          </View>

          {/* Add note button */}
          <Pressable className="bg-calm py-3 rounded mt-6">
            <Text className="text-white text-center font-medium">Add Note</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmotionalCheckIns;
