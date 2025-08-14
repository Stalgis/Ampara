import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, Image, useColorScheme } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import CallDetailsModal from "./Modals/CallDetailsModal";
import { designTokens } from "../../design-tokens";

const Chat = () => {
  const [selectedSection, setSelectedSection] = useState("message");
  const [modalVisible, setModalVisible] = useState(false);
  const [callFilter, setCallFilter] = useState("Last 7 days");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const scheme = useColorScheme() ?? "light";
  const tokens = designTokens[scheme];

  const calls = [
    { date: "08/08/2025, 9:00AM" },
    { date: "07/15/2025, 11:30AM" },
    { date: "06/20/2025, 3:00PM" },
  ];

  const filteredCalls = calls.filter((call) => {
    const callDate = new Date(call.date.split(",")[0]);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - callDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (callFilter === "Last 7 days") {
      return diffDays <= 7;
    }
    if (callFilter === "Last 30 days") {
      return diffDays <= 30;
    }
    return true;
  });
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mx-4">
        <View className="bg-badge border border-highlight rounded-xl mt-4 p-3 flex flex-row items-center">
          {/* Logo */}
          <Image
            source={require("../../assets/Ampara_logo.png")}
            className="w-20 h-20 mr-3"
            resizeMode="contain"
          />

          {/* Texto + Botón */}
          <View className="flex-1">
            <Text className="text-text font-semibold text-base mb-1">
              Ampara suggestions
            </Text>
            <Text className="text-subtitle text-sm mb-2">
              Today I can mention her friend Mery's birthday, would you like
              that?
            </Text>
            <Pressable className="bg-highlight rounded-lg px-3 py-1 self-start">
              <Text className="text-white text-sm font-medium">
                Send Suggestion
              </Text>
            </Pressable>
          </View>
        </View>
        <View id="call-history" className="mt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-text font-bold font-lg">Calls history</Text>
            <Pressable
              onPress={() => setShowFilterOptions(!showFilterOptions)}
              className="flex-row items-center"
            >
              <Text className="text-primary font-bold mr-1">{callFilter}</Text>
              <Feather
                name={showFilterOptions ? "chevron-up" : "chevron-down"}
                size={20}
                color={tokens.highlight}
              />
            </Pressable>
          </View>
          {showFilterOptions && (
            <View className="absolute right-0 top-8 bg-background border border-border rounded-lg mt-2 z-10 w-36">
              <Pressable
                onPress={() => {
                  setCallFilter("Last 7 days");
                  setShowFilterOptions(false);
                }}
                className="p-3"
              >
                <Text>Last 7 days</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCallFilter("Last 30 days");
                  setShowFilterOptions(false);
                }}
                className="p-3"
              >
                <Text>Last 30 days</Text>
              </Pressable>
            </View>
          )}
          {filteredCalls.map((call, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-background mt-2"
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-primary p-2 rounded-lg mr-3">
                  <Feather name="phone" size={24} color={tokens.text} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-text">Call</Text>
                  <Text className="text-subtitle text-sm">{call.date}</Text>
                </View>
              </View>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text className="text-md text-text">{call.date}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View id=""></View>
      </View>
      <CallDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Chat;
