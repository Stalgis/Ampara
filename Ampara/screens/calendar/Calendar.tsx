import React from "react";
import { View, Pressable, Text, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CalendarScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <Pressable className="bg-primary self-end rounded-2xl p-2 m-2">
        <Text className="text-white">Add Event +</Text>
      </Pressable>
      <View className="border border-border rounded-2xl">
        <Calendar
          // Initial visible month
          current={new Date().toISOString().split("T")[0]}
          // Handler which gets executed on day press
          onDayPress={(day) => {
            console.log("Selected day", day);
          }}
          // Marking example
          markedDates={{
            "2025-07-28": {
              selected: true,
              marked: true,
              selectedColor: "#A78BFA",
            },
            "2025-07-30": { marked: true, dotColor: "#F59E0B" },
          }}
          theme={{
            selectedDayBackgroundColor: "#A78BFA",
            todayTextColor: "#F59E0B",
            arrowColor: "#A78BFA",
            textSectionTitleColor: "#6B7280",
          }}
        />
      </View>
      <View className="flex flex-row items-center justify-between mt-6">
        <Text className="font-bold text-xl">Today's Schedule</Text>
        <View className="flex-row items-center">
          <Feather name="calendar" size={24} color="#6B7280" className="mr-1" />
          <Text className="text-subtitle">
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Today's Schedule Cards */}
      <View className="mt-4">
        {/* Card 1 - Users */}
        <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-badge p-2 rounded-2xl mr-3">
              <FontAwesome name="users" size={24} color="#A78BFA" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Group Meeting</Text>
              <Text className="text-subtitle text-sm">2:00 PM - 3:00 PM</Text>
            </View>
          </View>
          <Pressable className="bg-primary px-4 py-2 rounded-2xl">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>

        {/* Card 2 - Coffee */}
        <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-badge p-2 rounded-2xl mr-3">
              <FontAwesome name="coffee" size={24} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Morning Coffee</Text>
              <Text className="text-subtitle text-sm">4:30 PM - 5:30 PM</Text>
            </View>
          </View>
          <Pressable className="bg-primary px-4 py-2 rounded-2xl">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>

        {/* Card 3 - Book */}
        <View className="flex-row items-center justify-between border border-border rounded-2xl p-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-badge p-2 rounded-2xl mr-3">
              <Feather name="book" size={24} color="#A78BFA" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Study Session</Text>
              <Text className="text-subtitle text-sm">7:00 PM - 8:00 PM</Text>
            </View>
          </View>
          <Pressable className="bg-primary px-4 py-2 rounded-2xl">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
