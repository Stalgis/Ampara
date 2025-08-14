import React, { useState } from "react";
import { View, Pressable, SafeAreaView, Text } from "react-native";
import Vitals from "./health_vitals";
import Medications from "./health_medications";
import HealthRecords from "./health_records";

const Health = () => {
  const [selectedSection, setSelectedSection] = useState("vitals");
  const renderSection = () => {
    switch (selectedSection) {
      case "vitals":
        return <Vitals />;
      case "medications":
        return <Medications />;
      case "records":
        return <HealthRecords />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mx-4">
        <View
          id="select-view"
          className="flex flex-row justify-center justify-evenly bg-gray-100 rounded my-4 p-2"
        >
          <Pressable onPress={() => setSelectedSection("vitals")}>
            <Text
              className={`${
                selectedSection == "vitals" ? "bg-background font-bold" : ""
              } px-6 py-2 rounded`}
            >
              Vitals
            </Text>
          </Pressable>
          <Pressable onPress={() => setSelectedSection("medications")}>
            <Text
              className={`${
                selectedSection == "medications"
                  ? "bg-background font-bold"
                  : ""
              } px-4 py-2 rounded`}
            >
              Medications
            </Text>
          </Pressable>
          <Pressable onPress={() => setSelectedSection("records")}>
            <Text
              className={`${
                selectedSection == "records" ? "bg-background font-bold" : ""
              } px-4 py-2 rounded`}
            >
              Records
            </Text>
          </Pressable>
        </View>
        <View className="border border-border rounded w-full bg-background">
          {renderSection()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Health;
