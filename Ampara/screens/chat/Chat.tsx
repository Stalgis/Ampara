import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable } from "react-native";

const Chat = () => {
  const [selectedSection, setSelectedSection] = useState("message");
  return (
    <SafeAreaView className="bg-white h-full">
      <View
        id="select-view"
        className="flex flex-row justify-center justify-evenly bg-gray-100 mx-6 rounded my-4 p-2"
      >
        <Pressable onPress={() => setSelectedSection("message")}>
          <Text
            className={`${selectedSection == "message" ? "bg-white font-bold" : ""} px-4 py-2 rounded`}
          >
            Message
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection("chatbot")}>
          <Text
            className={`${selectedSection == "chatbot" ? "bg-white font-bold" : ""} px-4 py-2 rounded`}
          >
            ChatBot
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection("advice")}>
          <Text
            className={`${selectedSection == "advice" ? "bg-white font-bold" : ""} px-4 py-2 rounded`}
          >
            Advice
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedSection("calls")}>
          <Text
            className={`${selectedSection == "calls" ? "bg-white font-bold" : ""} px-4 py-2 rounded`}
          >
            Calls
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
