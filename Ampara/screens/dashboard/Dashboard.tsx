import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  DashboardInnerStackParamList,
} from "../../navigation/types";
import { designTokens } from "../../design-tokens";
import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import { useTheme } from "../../controllers/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import colors from "tailwindcss/colors";

const Dashboard = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardInnerStackParamList, "DashboardHome">
    >();
  const [name] = useState("Martha Johnson");
  const [isMedicationDone, setIsMedicationDone] = useState(false);
  const [isAppointmentDone, setIsAppointmentDone] = useState(false);

  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="mx-4 mb-4">
          {/* Header Card */}
          <Pressable
            onPress={() =>
              navigation.navigate("ElderUserProfile", {
                elderName: name,
                dob: "1941-05-12",
                tags: ["Diabetes", "Fall Risk"],
                avatarUrl: "https://…",
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Open elder profile"
            accessibilityHint="Navigates to Martha Johnson’s profile"
            android_ripple={{
              color: tokens.highlight + "22",
              borderless: false,
            }}
            hitSlop={8}
            className="relative mt-8 rounded-2xl overflow-hidden bg-background border border-border py-2"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
          >
            {/* decorative left bar */}
            <View className="absolute left-0 top-0 bottom-0 w-1 bg-highlight" />

            <View className="flex-row items-center p-4">
              <View className="p-3 rounded-full bg-badge mr-3">
                <Entypo
                  name="heart-outlined"
                  size={22}
                  color={tokens.highlight}
                />
              </View>

              <View className="flex-1">
                <Text className="font-bold text-lg text-text">{name}</Text>
                <Text className="text-subtitle">
                  Last Check-in: Today, 9:30 AM
                </Text>
              </View>

              {/* explicit CTA makes affordance obvious */}
              <View className="flex-row items-center">
                <Text className="text-highlight font-semibold mr-1">
                  View profile
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={tokens.highlight}
                />
              </View>
            </View>
          </Pressable>

          {/* Emotional check-ins */}
          <View className="mt-8 flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">
              Emotional Check-ins
            </Text>
            <Pressable
              className="flex-row items-center"
              onPress={() => navigation.navigate("EmotionalCheckIns")}
            >
              <Text className="font-bold text-highlight mr-1">View all</Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />
            </Pressable>
          </View>

          {/* Emotional weekdays list */}
          <View className="border border-border rounded-2xl py-4 px-3 mt-4 bg-background shadow-sm">
            <View className="flex-row justify-between px-1">
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Mon</Text>
                <Entypo
                  name="emoji-happy"
                  size={22}
                  color={colors.green[600]}
                />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Tue</Text>
                <FontAwesome6 name="meh" size={20} color={colors.orange[500]} />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Wed</Text>
                <Entypo
                  name="emoji-happy"
                  size={22}
                  color={colors.green[600]}
                />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Thu</Text>
                <Entypo name="emoji-sad" size={22} color={colors.red[500]} />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Fri</Text>
                <Entypo
                  name="emoji-happy"
                  size={22}
                  color={colors.green[600]}
                />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Sat</Text>
                <Entypo
                  name="emoji-happy"
                  size={22}
                  color={colors.green[600]}
                />
              </View>
              <View className="items-center">
                <Text className="text-sm mb-2 text-text">Sun</Text>
                <FontAwesome6 name="meh" size={20} color={colors.orange[500]} />
              </View>
            </View>

            <View className="border-b border-border my-4" />
            <View className="px-1">
              <Text className="font-bold text-lg text-text">
                Weekly Summary:
              </Text>
              <Text className="text-sm text-subtitle mt-1">
                The patient showed mostly positive emotions this week, with some
                mild mood changes midweek. Continue to monitor for any
                significant changes.
              </Text>
            </View>
          </View>

          {/* Health alerts */}
          <View className="mt-8 flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">Health Alerts</Text>
            <Pressable
              className="flex-row items-center"
              onPress={() =>
                navigation
                  .getParent<BottomTabNavigationProp<MainTabParamList>>()
                  ?.navigate("Health")
              }
            >
              <Text className="font-bold text-highlight mr-1">View all</Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />
            </Pressable>
          </View>

          <View className="mt-4">
            {/* Medication */}
            <View className="flex-row w-full mt-2 rounded-2xl overflow-hidden bg-background shadow-sm border border-border">
              {!isMedicationDone && new Date().getHours() > 8 && (
                <View className="w-1 bg-highlight" />
              )}
              <View className="flex-row items-center justify-between flex-1 p-3">
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-100 p-2 rounded-xl mr-3">
                    <FontAwesome6
                      name="pills"
                      size={18}
                      color={colors.red[500]}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base text-text">
                      Medication
                    </Text>
                    <Text className="text-subtitle text-sm">8:00 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`px-4 py-2 rounded-xl ${
                    isMedicationDone ? "bg-green-500" : "bg-calm"
                  }`}
                  onPress={() => setIsMedicationDone(!isMedicationDone)}
                >
                  <Text className="text-white font-semibold">
                    {isMedicationDone ? "Done" : "Due"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Appointment */}
            <View className="flex-row w-full mt-2 rounded-2xl overflow-hidden bg-background shadow-sm border border-border">
              {!isAppointmentDone && new Date().getHours() > 11 && (
                <View className="w-1 bg-highlight" />
              )}
              <View className="flex-row items-center justify-between flex-1 p-3">
                <View className="flex-row items-center flex-1">
                  <View className="bg-blue-100 p-2 rounded-xl mr-3">
                    <Feather name="clock" size={18} color={colors.blue[600]} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base text-text">
                      Appointment
                    </Text>
                    <Text className="text-subtitle text-sm">11:30 AM</Text>
                  </View>
                </View>
                <Pressable
                  className={`px-4 py-2 rounded-xl ${
                    isAppointmentDone ? "bg-green-500" : "bg-calm"
                  }`}
                  onPress={() => setIsAppointmentDone(!isAppointmentDone)}
                >
                  <Text className="text-white font-semibold">
                    {isAppointmentDone ? "Done" : "Due"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Upcoming Activities */}
          <View className="mt-8 flex-row justify-between items-center">
            <Text className="font-bold text-xl text-text">
              Upcoming Activities
            </Text>
            <Pressable
              className="flex-row items-center"
              onPress={() =>
                navigation
                  .getParent<BottomTabNavigationProp<MainTabParamList>>()
                  ?.navigate("Calendar")
              }
            >
              <Text className="font-bold text-highlight mr-1">View all</Text>
              <AntDesign name="arrowright" size={14} color={tokens.highlight} />
            </Pressable>
          </View>

          <View className="mt-4">
            {/* Card 1 - Users */}
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3 bg-background shadow-sm">
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 p-2 rounded-xl mr-3">
                  <FontAwesome
                    name="users"
                    size={18}
                    color={colors.blue[600]}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-text">
                    Group Meeting
                  </Text>
                  <Text className="text-subtitle text-sm">
                    2:00 PM - 3:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-xl">
                <Text className="text-white font-semibold">Join</Text>
              </Pressable>
            </View>

            {/* Card 2 - Coffee */}
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 mb-3 bg-background shadow-sm">
              <View className="flex-row items-center flex-1">
                <View className="bg-orange-100 p-2 rounded-xl mr-3">
                  <FontAwesome
                    name="coffee"
                    size={18}
                    color={colors.orange[600]}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-text">
                    Morning Coffee
                  </Text>
                  <Text className="text-subtitle text-sm">
                    4:30 PM - 5:30 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-xl">
                <Text className="text-white font-semibold">Join</Text>
              </Pressable>
            </View>

            {/* Card 3 - Book */}
            <View className="flex-row items-center justify-between border border-border rounded-2xl p-3 bg-background shadow-sm">
              <View className="flex-row items-center flex-1">
                <View className="bg-green-100 p-2 rounded-xl mr-3">
                  <Feather name="book" size={18} color={colors.green[600]} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-text">
                    Study Session
                  </Text>
                  <Text className="text-subtitle text-sm">
                    7:00 PM - 8:00 PM
                  </Text>
                </View>
              </View>
              <Pressable className="bg-calm px-4 py-2 rounded-xl">
                <Text className="text-white font-semibold">Join</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
