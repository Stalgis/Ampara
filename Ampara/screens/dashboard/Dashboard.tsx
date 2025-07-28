import React from "react";
import { useState } from "react";
import { View, Text, SafeAreaView, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

const Dashboard = () => {
  const [name, setName] = useState("Martha Johnson");
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="mx-4">
        <View className="flex flex-row items-center mx-auto border border-gray-300 py-4 pr-8 mt-8 rounded-lg">
          <Entypo
            name="heart-outlined"
            className="p-2 rounded-xl bg-[#d4fcf2] mx-4"
            size={24}
            color="#3b9487"
          />
          <View>
            <Text id="Carer Name" className="font-bold text-lg">
              {name}
            </Text>
            <Text>Last Check-in: Today, 9:30 AM</Text>
          </View>
        </View>

        {/* Emotional check-ins */}
        <View>
          <Text className="mt-8 font-bold text-xl">Emotional Check-ins</Text>
          <Pressable>
            <Text className="font-bold">View all </Text>
            <AntDesign name="arrowright" size={14} color="black" />
          </Pressable>
        </View>
        <View className="flex-row justify-evenly items-center border border-gray-300 rounded-xl py-4 px-2 mt-2 bg-white">
          <View className="items-center space-y-1">
            <Text className="text-sm">Mon</Text>
            <Entypo name="emoji-happy" size={24} color="green" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Tue</Text>
            <FontAwesome6 name="meh" size={24} color="orange" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Wed</Text>
            <Entypo name="emoji-happy" size={24} color="green" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Thu</Text>
            <Entypo name="emoji-sad" size={24} color="red" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Fri</Text>
            <Entypo name="emoji-happy" size={24} color="green" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Sat</Text>
            <Entypo name="emoji-happy" size={24} color="green" />
          </View>
          <View className="items-center space-y-1">
            <Text className="text-sm">Sun</Text>
            <FontAwesome6 name="meh" size={24} color="orange" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
