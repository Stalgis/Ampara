import React, { useState } from "react";
import { View, TextInput, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecordVitalsModal from "./Modals/RecordVitalsModal";
import { Heading, Subheading, Body } from "../../src/components/ui";

const Vitals = () => {
  const [heartRateTime, setHeartRateTime] = useState("Today, 8:00 AM");
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressureTime, setBloodPressureTime] = useState("Today, 8:00 AM");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [temperatureTime, setTemperatureTime] = useState("Today, 8:00 AM");
  const [temperature, setTemperature] = useState(98.6);
  const [bloodGlucoseTime, setBloodGlucoseTime] = useState("Today, 8:00 AM");
  const [bloodGlucose, setBloodGlucose] = useState(90);

  const [modalVisible, setModalVisible] = useState(false);
  const [newHeartRate, setNewHeartRate] = useState("");
  const [newBloodPressure, setNewBloodPressure] = useState("");
  const [newTemperature, setNewTemperature] = useState("");
  const [newBloodGlucose, setNewBloodGlucose] = useState("");

  const getDateTimeString = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${dateString}, ${timeString}`;
  };

  const recordNewVitals = () => {
    const dateTimeString = getDateTimeString();
    if (newHeartRate) {
      setHeartRate(Number(newHeartRate));
      setHeartRateTime(dateTimeString);
    }
    if (newBloodPressure) {
      setBloodPressure(newBloodPressure);
      setBloodPressureTime(dateTimeString);
    }
    if (newTemperature) {
      setTemperature(Number(newTemperature));
      setTemperatureTime(dateTimeString);
    }
    if (newBloodGlucose) {
      setBloodGlucose(Number(newBloodGlucose));
      setBloodGlucoseTime(dateTimeString);
    }
    // Clear form and close modal
    setNewHeartRate("");
    setNewBloodPressure("");
    setNewTemperature("");
    setNewBloodGlucose("");
    setModalVisible(false);
  };

  return (
    <View className="p-4">
      <Heading className="text-xl text-text">Recent Vitals</Heading>
      <View id="container-vitals-cards" className="mt-4 flex gap-4">
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-red-100 p-2 rounded-lg mr-3">
              <Ionicons name="heart-outline" size={24} color="red" />
            </View>
            <View className="flex-1">
              <Subheading className="font-bold text-base text-text">
                Heart Rate
              </Subheading>
              <Body className="text-subtitle text-sm">
                Last updated: {heartRateTime}
              </Body>
            </View>
          </View>
          <View>
            <Subheading className="font-bold text-lg text-text">
              {heartRate} bpm
            </Subheading>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-blue-100 p-2 rounded-lg mr-3">
              <Ionicons name="analytics-outline" size={24} color="blue" />
            </View>
            <View className="flex-1">
              <Subheading className="font-bold text-base text-text">
                Blood Pressure
              </Subheading>
              <Body className="text-subtitle text-sm">
                Last updated: {bloodPressureTime}
              </Body>
            </View>
          </View>
          <View>
            <Subheading className="font-bold text-lg text-text">
              {bloodPressure} mmHg
            </Subheading>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-green-100 p-2 rounded-lg mr-3">
              <Ionicons name="thermometer-outline" size={24} color="green" />
            </View>
            <View className="flex-1">
              <Subheading className="font-bold text-base text-text">
                Temperature
              </Subheading>
              <Body className="text-subtitle text-sm">
                Last updated: {temperatureTime}
              </Body>
            </View>
          </View>
          <View>
            <Subheading className="font-bold text-lg text-text">
              {temperature} °F
            </Subheading>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-purple-100 p-2 rounded-lg mr-3">
              <Ionicons name="water-outline" size={24} color="purple" />
            </View>
            <View className="flex-1">
              <Subheading className="font-bold text-base text-text">
                Blood Glucose
              </Subheading>
              <Body className="text-subtitle text-sm">
                Last updated: {bloodGlucoseTime}
              </Body>
            </View>
          </View>
          <View>
            <Subheading className="font-bold text-lg text-text">
              {bloodGlucose} mg/dL
            </Subheading>
          </View>
        </View>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-calm px-4 py-3 rounded"
        >
          <Subheading className="text-white font-medium mx-auto text-lg">
            Record New Vitals
          </Subheading>
        </Pressable>

        <RecordVitalsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={recordNewVitals}
        />
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-calm px-4 py-3 rounded"
        >
          <Subheading className="text-white font-medium mx-auto text-lg">
            Record New Vitals
          </Subheading>
        </Pressable>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-background p-6 rounded-xl w-11/12">
              <Heading className="text-xl mb-4 text-text">
                Update Vitals
              </Heading>

              <Subheading className="text-text mb-1">
                Heart Rate (bpm)
              </Subheading>
              <TextInput
                value={newHeartRate}
                onChangeText={setNewHeartRate}
                keyboardType="numeric"
                placeholder="e.g. 75"
                className="border border-border rounded p-2 mb-3"
              />

              <Subheading className="text-text mb-1">
                Blood Pressure (mmHg)
              </Subheading>
              <TextInput
                value={newBloodPressure}
                onChangeText={setNewBloodPressure}
                placeholder="e.g. 120/80"
                className="border border-border rounded p-2 mb-3"
              />

              <Subheading className="text-text mb-1">
                Temperature (°F)
              </Subheading>
              <TextInput
                value={newTemperature}
                onChangeText={setNewTemperature}
                keyboardType="numeric"
                placeholder="e.g. 98.6"
                className="border border-border rounded p-2 mb-3"
              />

              <Subheading className="text-text mb-1">
                Blood Glucose (mg/dL)
              </Subheading>
              <TextInput
                value={newBloodGlucose}
                onChangeText={setNewBloodGlucose}
                keyboardType="numeric"
                placeholder="e.g. 100"
                className="border border-border rounded p-2 mb-4"
              />

              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="bg-border px-4 py-2 rounded"
                >
                  <Body className="text-text">Cancel</Body>
                </Pressable>
                <Pressable
                  onPress={recordNewVitals}
                  className="bg-primary px-4 py-2 rounded"
                >
                  <Subheading className="text-text font-bold">Save</Subheading>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Vitals;
