import React from "react";
import { View, Pressable, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Heading, Subheading, Body } from "../../src/components/ui";

const CalendarScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full">

      <View className="mx-4">
        <Pressable className="bg-[#46a697] self-end rounded px-4 py-2 mt-4">
          <Text className="text-white">Add Event +</Text>
        </Pressable>
        <View className="border border-gray-200 rounded-lg mt-4">
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
              selectedColor: "#2563eb",
            },
            "2025-07-30": { marked: true, dotColor: "red" },
          }}
          theme={{
            selectedDayBackgroundColor: "#2563eb",
            todayTextColor: "#10b981",
            arrowColor: "#2563eb",
            textSectionTitleColor: "#4b5563",
          }}
        />

        </View>
        <View className="flex flex-row items-center justify-between mt-6">
          <Text className="font-bold text-xl">Today's Schedule</Text>
          <View className="flex-row items-center">
            <Feather name="calendar" size={18} color="#9ca3af" className="mr-1" />
            <Text className="text-gray-400">
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Today's Schedule Cards */}
        <View className="mt-4 flex gap-4">
          {/* Card 1 - Users */}
          <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-white">
            <View className="flex-row items-center flex-1">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <FontAwesome name="users" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base">Group Meeting</Text>
                <Text className="text-gray-400 text-sm">2:00 PM - 3:00 PM</Text>

            </View>
            <Pressable className="bg-[#46a697] px-4 py-2 rounded">
              <Text className="text-white font-medium">Join</Text>
            </Pressable>
          </View>


          {/* Card 2 - Coffee */}
          <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-white">
            <View className="flex-row items-center flex-1">
              <View className="bg-orange-100 p-2 rounded-lg mr-3">
                <FontAwesome name="coffee" size={20} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base">Morning Coffee</Text>
                <Text className="text-gray-400 text-sm">4:30 PM - 5:30 PM</Text>
              </View>
            </View>

            <Pressable className="bg-[#46a697] px-4 py-2 rounded">
              <Text className="text-white font-medium">Join</Text>
            </Pressable>
          </View>

          {/* Card 3 - Book */}
          <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-white">
            <View className="flex-row items-center flex-1">
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <Feather name="book" size={20} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base">Study Session</Text>
                <Text className="text-gray-400 text-sm">7:00 PM - 8:00 PM</Text>
              </View>

            </View>
            <Pressable className="bg-[#46a697] px-4 py-2 rounded">
              <Text className="text-white font-medium">Join</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
