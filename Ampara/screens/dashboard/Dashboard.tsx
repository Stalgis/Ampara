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
          <View className="flex flex-row w-full mt-8 rounded-2xl overflow-hidden bg-[#ffffff]">
            {/* Left color strip */}
            <View className="w-1 bg-highlight" />

            {/* Main card */}
            <View className="flex flex-row items-center flex-1 border border-border py-4 pr-8 rounded-r-2xl">
              <Entypo
                name="heart-outlined"
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  backgroundColor: "#FEF9C3",
                  marginHorizontal: 16,
                }}
                size={24}
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
          <View className="border border-border rounded-2xl py-4 px-2 mt-4 bg-[#ffffff]">
            <View className="flex-row justify-evenly items-center ">
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Mon</Text>
                <Entypo name="emoji-happy" size={24} color="#A78BFA" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Tue</Text>
                <FontAwesome6 name="meh" size={24} color="#F59E0B" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Wed</Text>
                <Entypo name="emoji-happy" size={24} color="#A78BFA" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Thu</Text>
                <Entypo name="emoji-sad" size={24} color="#F59E0B" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Fri</Text>
                <Entypo name="emoji-happy" size={24} color="#A78BFA" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Sat</Text>
                <Entypo name="emoji-happy" size={24} color="#A78BFA" />
              </View>
              <View className="items-center space-y-1">
                <Text className="text-sm mb-3">Sun</Text>
                <FontAwesome6 name="meh" size={24} color="#F59E0B" />
              </View>
            </View>
            <View className="border-b border-border my-4" />
            <View className="mx-1">
              <Text className="font-bold text-lg text-text">Weekly Summary:</Text>
              <Text className="text-sm text-subtitle mt-1">
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
            <View className="flex flex-row w-full mt-2 rounded-2xl overflow-hidden bg-[#ffffff]">
              {!isMedicationDone && new Date().getHours() > 8 && (
                <View className="w-1 bg-highlight" />
              )}
              <View
                className={`flex-row items-center justify-between flex-1 border border-border p-3 ${
                  !isMedicationDone && new Date().getHours() > 8
                    ? "rounded-r-2xl"
                    : "rounded-2xl"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-badge p-2 rounded-2xl mr-3">
                    <FontAwesome5 name="pills" size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Medication</Text>
                    <Text className="text-subtitle text-sm">8:00 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isMedicationDone ? "bg-primary" : "bg-calm"
                  } px-4 py-2 rounded-2xl`}
                  onPress={() => setIsMedicationDone(!isMedicationDone)}
                >
                  <Text className="text-white font-medium">
                    {isMedicationDone ? "Done" : "Due"}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="flex flex-row w-full mt-2 rounded-2xl overflow-hidden bg-[#ffffff]">
              {!isAppointmentDone && new Date().getHours() > 11 && (
                <View className="w-1 bg-highlight" />
              )}
              <View
                className={`flex-row items-center justify-between flex-1 border border-border p-3 ${
                  !isAppointmentDone && new Date().getHours() > 11
                    ? "rounded-r-2xl"
                    : "rounded-2xl"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-badge p-2 rounded-2xl mr-3">
                    <Feather name="clock" size={24} color="#A78BFA" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Appointment</Text>
                    <Text className="text-subtitle text-sm">11:30 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isAppointmentDone ? "bg-primary" : "bg-calm"
                  } px-4 py-2 rounded-2xl`}
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
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-badge p-2 rounded-2xl mr-3">
                  <FontAwesome name="users" size={24} color="#A78BFA" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Group Meeting</Text>
                  <Text className="text-subtitle text-sm">
                    2:00 PM - 3:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-2xl">
                <Text className="text-white font-medium">Join</Text>
              </Pressable>
            </View>

            {/* Card 2 - Coffee */}
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-badge p-2 rounded-2xl mr-3">
                  <FontAwesome name="coffee" size={24} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Morning Coffee</Text>
                  <Text className="text-subtitle text-sm">
                    4:30 PM - 5:30 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-2xl">
                <Text className="text-white font-medium">Join</Text>
              </Pressable>
            </View>

            {/* Card 3 - Book */}
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 bg-[#ffffff]">
              <View className="flex-row items-center flex-1">
                <View className="bg-badge p-2 rounded-2xl mr-3">
                  <Feather name="book" size={24} color="#A78BFA" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Study Session</Text>
                  <Text className="text-subtitle text-sm">
                    7:00 PM - 8:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-2xl">
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
