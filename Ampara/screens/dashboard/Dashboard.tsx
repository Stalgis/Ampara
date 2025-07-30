import React from "react";
import { useState } from "react";
import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Dashboard = () => {
  const [name, setName] = useState("Martha Johnson");
  const [isMedicationDone, setIsMedicationDone] = useState(false);
  const [isAppointmentDone, setIsAppointmentDone] = useState(false);
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="mx-4">
          <View className="flex flex-row w-full mt-8 rounded-lg overflow-hidden bg-[#ffffff]">
            {/* Left color strip */}
            <View className="w-1 bg-highlight" />

            {/* Main card */}
            <View className="flex flex-row items-center flex-1 border border-border py-4 pr-8 rounded-r-lg">
              <Entypo
                name="heart-outlined"
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  backgroundColor: "#FEF9C3",
                  marginHorizontal: 16,
                }}
                size={26}
                color="#F59E0B"
              />
              <View>
                <Text id="Carer Name" className="font-bold text-lg text-text">
                  {name}
                </Text>
                <Text className="text-subtitle">
                  Last Check-in: Today, 9:30 AM
                </Text>
              </View>
            </View>
          </View>

          {/* Emotional check-ins */}
          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className=" font-bold text-xl text-text">
              Emotional Check-ins
            </Text>
            <Pressable className="flex flex-row items-center">
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color="#F59E0B" />
            </Pressable>
          </View>

          {/* Emotional weekdays list */}
          <View className="border border-border rounded-xl py-4 px-2 mt-4 bg-[#ffffff]">
            <View className="flex-row justify-evenly items-center ">
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Mon</Text>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Tue</Text>
                <FontAwesome6 name="meh" size={24} color="orange" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Wed</Text>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Thu</Text>
                <Entypo name="emoji-sad" size={24} color="red" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Fri</Text>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Sat</Text>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Sun</Text>
                <FontAwesome6 name="meh" size={24} color="orange" />
              </View>
            </View>
            <View className="border-b border-gray-200 my-4" />
            <View className="mx-1">
              <Text className="font-bold text-lg text-text">
                Weekly Summary:
              </Text>
              <Text className="text-sm text-gray-700 mt-1 text-subtitle">
                The patient showed mostly positive emotions this week, with some
                mild mood changes midweek. Continue to monitor for any
                significant changes.
              </Text>
            </View>
          </View>

          {/* Health alerts  */}
          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className=" font-bold text-xl">Health Alerts</Text>
            <Pressable
              className="flex flex-row items-center"
              onPress={() => navigation.navigate("Health")}
            >
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color="#F59E0B" />
            </Pressable>
          </View>
          <View className="mt-4">
            <View className="flex flex-row w-full mt-2 rounded-lg overflow-hidden bg-[#ffffff]">
              {!isMedicationDone && new Date().getHours() > 8 && (
                <View className="w-1 bg-red-500" />
              )}
              <View
                className={`flex-row items-center justify-between flex-1 border border-border p-3 ${
                  !isMedicationDone && new Date().getHours() > 8
                    ? "rounded-r-lg"
                    : "rounded-lg"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-100 p-2 rounded-lg mr-3">
                    <FontAwesome5 name="pills" size={20} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Medication</Text>
                    <Text className="text-gray-400 text-sm">8:00 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isMedicationDone ? "bg-green-500" : "bg-calm"
                  } px-4 py-2 rounded`}
                  onPress={() => setIsMedicationDone(!isMedicationDone)}
                >
                  <Text className="text-white font-medium">
                    {isMedicationDone ? "Done" : "Due"}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="flex flex-row w-full mt-2 rounded-lg overflow-hidden bg-[#ffffff]">
              {!isAppointmentDone && new Date().getHours() > 11 && (
                <View className="w-1 bg-red-500" />
              )}
              <View
                className={`flex-row items-center justify-between flex-1 border border-border p-3 ${
                  !isAppointmentDone && new Date().getHours() > 11
                    ? "rounded-r-lg"
                    : "rounded-lg"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Feather name="clock" size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Appointment</Text>
                    <Text className="text-gray-400 text-sm">11:30 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isAppointmentDone ? "bg-green-500" : "bg-calm"
                  } px-4 py-2 rounded`}
                  onPress={() => setIsAppointmentDone(!isAppointmentDone)}
                >
                  <Text className="text-white font-medium">
                    {isAppointmentDone ? "Done" : "Due"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className=" font-bold text-xl">Upcoming Activities</Text>
            <Pressable
              className="flex flex-row items-center"
              onPress={() => navigation.navigate("Calendar")}
            >
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color="#F59E0B" />
            </Pressable>
          </View>
          <View className="mt-4">
            {/* Card 1 - Users */}
            <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FontAwesome name="users" size={20} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Group Meeting</Text>
                  <Text className="text-gray-400 text-sm">
                    2:00 PM - 3:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Text className="text-white font-medium">Join</Text>
              </Pressable>
            </View>

            {/* Card 2 - Coffee */}
            <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-orange-100 p-2 rounded-lg mr-3">
                  <FontAwesome name="coffee" size={20} color="#ea580c" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Morning Coffee</Text>
                  <Text className="text-gray-400 text-sm">
                    4:30 PM - 5:30 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Text className="text-white font-medium">Join</Text>
              </Pressable>
            </View>

            {/* Card 3 - Book */}
            <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-green-100 p-2 rounded-lg mr-3">
                  <Feather name="book" size={20} color="#16a34a" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Study Session</Text>
                  <Text className="text-gray-400 text-sm">
                    7:00 PM - 8:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Text className="text-white font-medium">Join</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
