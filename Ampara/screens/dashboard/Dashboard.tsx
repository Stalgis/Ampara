import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, ScrollView, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "tailwindcss/colors";
import { designTokens } from "../../design-tokens";

const Dashboard = () => {
  const [name, setName] = useState("Martha Johnson");
  const [isMedicationDone, setIsMedicationDone] = useState(false);
  const [isAppointmentDone, setIsAppointmentDone] = useState(false);
  const navigation = useNavigation<any>();
  const scheme = useColorScheme() ?? "light";
  const tokens = designTokens[scheme];
  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="mx-4">
          <View className="flex flex-row w-full mt-8 rounded-lg overflow-hidden bg-background">
            {/* Left color strip */}
            <View className="w-1 bg-highlight" />

            {/* Main card */}
            <View className="flex flex-row items-center flex-1 border border-border py-4 pr-8 rounded-r-lg">
              <Entypo
                name="heart-outlined"
                style={{
                  padding: 12,
                  borderRadius: 9999,
                  backgroundColor: tokens.badge,
                  marginHorizontal: 16,
                }}
                size={26}
                color={tokens.highlight}
              />
              <View>
                <Subheading id="Carer Name" className="font-bold text-lg text-text">
                  {name}
                </Subheading>
                <Body className="text-subtitle">
                  Last Check-in: Today, 9:30 AM
                </Body>
              </View>
            </View>
          </View>

          {/* Emotional check-ins */}
          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">
              Emotional Check-ins
            </Text>
            <Pressable className="flex flex-row items-center">
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />
            </Pressable>
          </View>

          {/* Emotional weekdays list */}
          <View className="border border-border rounded-xl py-4 px-2 mt-4 bg-background">
            <View className="flex-row justify-evenly items-center ">
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Mon</Body>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Tue</Body>
                <FontAwesome6 name="meh" size={24} color="orange" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Wed</Body>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Thu</Body>
                <Entypo name="emoji-sad" size={24} color="red" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Fri</Body>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Sat</Body>
                <Entypo name="emoji-happy" size={24} color="green" />
              </View>
              <View className="items-center space-y-1">
                <Body className="text-sm mb-3">Sun</Body>
                <FontAwesome6 name="meh" size={24} color="orange" />
              </View>
            </View>
            <View className="border-b border-border my-4" />
            <View className="mx-1">
              <Subheading className="font-bold text-lg text-text">
                Weekly Summary:
              </Text>
              <Text className="text-sm text-subtitle mt-1">

                The patient showed mostly positive emotions this week, with some
                mild mood changes midweek. Continue to monitor for any
                significant changes.
              </Body>
              </View>
            </View>

          {/* Health alerts  */}
          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">Health Alerts</Text>

            <Pressable
              className="flex flex-row items-center"
              onPress={() => navigation.navigate("Health")}
            >
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />

            </Pressable>
          </View>
          <View className="mt-4">
            <View className="flex flex-row w-full mt-2 rounded-lg overflow-hidden bg-background">
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
                    <FontAwesome5 name="pills" size={20} color={colors.red[500]} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Medication</Text>
                    <Text className="text-subtitle text-sm">8:00 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isMedicationDone ? "bg-green-500" : "bg-calm"
                  } px-4 py-2 rounded`}
                  onPress={() => setIsMedicationDone(!isMedicationDone)}
                >
                  <Subheading className="text-white font-medium">
                    {isMedicationDone ? "Done" : "Due"}
                  </Subheading>
                </Pressable>
              </View>
            </View>
            <View className="flex flex-row w-full mt-2 rounded-lg overflow-hidden bg-background">
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
                    <Feather name="clock" size={20} color={colors.blue[500]} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base">Appointment</Text>
                    <Text className="text-subtitle text-sm">11:30 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`${
                    isAppointmentDone ? "bg-green-500" : "bg-calm"
                  } px-4 py-2 rounded`}
                  onPress={() => setIsAppointmentDone(!isAppointmentDone)}
                >
                  <Subheading className="text-white font-medium">
                    {isAppointmentDone ? "Done" : "Due"}
                  </Subheading>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-8 flex flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">Upcoming Activities</Text>
            <Pressable
              className="flex flex-row items-center"
              onPress={() => navigation.navigate("Calendar")}
            >
              <Text className="font-bold text-highlight">View all </Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />
            </Pressable>
          </View>
          <View className="mt-4">
            {/* Card 1 - Users */}
            <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-background">
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FontAwesome name="users" size={20} color={colors.blue[600]} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Group Meeting</Text>
                  <Text className="text-subtitle text-sm">
                    2:00 PM - 3:00 PM
                  </Body>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Subheading className="text-white font-medium">Join</Subheading>
              </Pressable>
            </View>

            {/* Card 2 - Coffee */}
            <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-background">
              <View className="flex-row items-center flex-1">
                <View className="bg-orange-100 p-2 rounded-lg mr-3">
                  <FontAwesome name="coffee" size={20} color={colors.orange[600]} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Morning Coffee</Text>
                  <Text className="text-subtitle text-sm">
                    4:30 PM - 5:30 PM
                  </Body>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Subheading className="text-white font-medium">Join</Subheading>
              </Pressable>
            </View>

            {/* Card 3 - Book */}
            <View className="flex-row items-center justify-between border border-border rounded-lg p-3 bg-background">
              <View className="flex-row items-center flex-1">
                <View className="bg-green-100 p-2 rounded-lg mr-3">
                  <Feather name="book" size={20} color={colors.green[600]} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base">Study Session</Text>
                  <Text className="text-subtitle text-sm">
                    7:00 PM - 8:00 PM
                  </Body>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded">
                <Subheading className="text-white font-medium">Join</Subheading>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
