import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const EmotionalCheckIns = () => {
  const route = useRoute();
  return (
    <SafeAreaView className="h-full bg-background dark:bg-background-dark">
      <ScrollView>
        <View className="flex-1 bg-background dark:bg-background-dark p-4">
          <Text className="text-xl font-bold text-text dark:text-text-dark mb-2">
            Emotional Check-ins
          </Text>
          <Text className="text-subtitle dark:text-subtitle-dark mb-4">
            Track moods over time and view insights
          </Text>

          {/* Graph placeholder */}
          <View className="h-48 border border-border dark:border-border-dark rounded-lg bg-background dark:bg-background-dark mb-6 items-center justify-center">
            <Text className="text-subtitle dark:text-subtitle-dark">[ Mood Graph Here ]</Text>
          </View>

          {/* Weekly Summary */}
          <View className="border border-border dark:border-border-dark rounded-lg p-4 mb-6 bg-background dark:bg-background-dark">
            <Text className="font-bold text-lg text-text dark:text-text-dark mb-2">
              Weekly Summary
            </Text>
            <Text className="text-sm text-subtitle dark:text-subtitle-dark">
              Mostly positive moods this week, with mild changes midweek. No
              major concerns.
            </Text>
          </View>

          {/* Mood Logs */}
          <Text className="font-bold text-lg text-text dark:text-text-dark mb-3">Mood Log</Text>
          <View className="space-y-3">
            <View className="border border-border dark:border-border-dark rounded-lg p-3 bg-background dark:bg-background-dark">
              <Text className="font-bold text-base">Mon, Aug 11</Text>
              <Text className="text-green-600">😊 Happy</Text>
              <Text className="text-subtitle dark:text-subtitle-dark text-sm mt-1">
                Had a nice call with family.
              </Text>
            </View>
            <View className="border border-border dark:border-border-dark rounded-lg p-3 bg-background dark:bg-background-dark">
              <Text className="font-bold text-base">Tue, Aug 12</Text>
              <Text className="text-orange-500">😐 Neutral</Text>
              <Text className="text-subtitle dark:text-subtitle-dark text-sm mt-1">Quiet day.</Text>
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
