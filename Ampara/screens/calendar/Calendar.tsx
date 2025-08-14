import React from "react";
import { View, Pressable, Text, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "tailwindcss/colors";

const CalendarScreen = () => {
  return (
    <SafeAreaView className="bg-background h-full">
      <Pressable className="bg-teal-500 self-end rounded p-2 m-2">
        <Text className="text-white">Add Event +</Text>
      </Pressable>
      <View className="border border-border rounded-lg">
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          onDayPress={(day) => {
            console.log("Selected day", day);
          }}
          markedDates={{
            "2025-07-28": {
              selected: true,
              marked: true,
              selectedColor: colors.blue[600],
            },
            "2025-07-30": { marked: true, dotColor: "red" },
          }}
          theme={{
            selectedDayBackgroundColor: colors.blue[600],
            todayTextColor: colors.emerald[500],
            arrowColor: colors.blue[600],
            textSectionTitleColor: colors.gray[600],
          }}
        />
      </View>
      <View className="flex flex-row items-center justify-between mt-6">
        <Text className="font-bold text-xl">Today's Schedule</Text>
        <View className="flex-row items-center ">
          <Feather name="calendar" size={18} color={colors.gray[400]} className="mr-1" />
          <Text className="text-subtitle">
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Today's Schedule Cards */}
      <View className="mt-4">
        {/* Card 1 - Users */}
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-blue-100 p-2 rounded-lg mr-3">
              <FontAwesome name="users" size={20} color={colors.blue[600]} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Group Meeting</Text>
              <Text className="text-subtitle text-sm">2:00 PM - 3:00 PM</Text>
            </View>
          </View>
          <Pressable className="bg-teal-500 px-4 py-2 rounded">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>

        {/* Card 2 - Coffee */}
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-orange-100 p-2 rounded-lg mr-3">
              <FontAwesome name="coffee" size={20} color={colors.orange[600]} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Morning Coffee</Text>
              <Text className="text-subtitle text-sm">4:30 PM - 5:30 PM</Text>
            </View>
          </View>
          <Pressable className="bg-teal-500 px-4 py-2 rounded">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>

        {/* Card 3 - Book */}
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3">
          <View className="flex-row items-center flex-1">
            <View className="bg-green-100 p-2 rounded-lg mr-3">
              <Feather name="book" size={20} color={colors.green[600]} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base">Study Session</Text>
              <Text className="text-subtitle text-sm">7:00 PM - 8:00 PM</Text>
            </View>
          </View>
          <Pressable className="bg-teal-500 px-4 py-2 rounded">
            <Text className="text-white font-medium">Join</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
