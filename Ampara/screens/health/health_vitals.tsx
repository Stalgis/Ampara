import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecordVitalsModal from "./Modals/RecordVitalsModal";

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
      <Text className="font-bold text-xl font-text text-text">
        Recent Vitals
      </Text>
      <View id="container-vitals-cards" className="mt-4 flex gap-4">
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-red-100 p-2 rounded-lg mr-3">
              <Ionicons name="heart-outline" size={24} color="red" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base text-text">Heart Rate</Text>
              <Text className="text-subtitle text-sm">
                Last updated: {heartRateTime}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-lg text-text">{heartRate} bpm</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-blue-100 p-2 rounded-lg mr-3">
              <Ionicons name="analytics-outline" size={24} color="blue" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base text-text">
                Blood Pressure
              </Text>
              <Text className="text-subtitle text-sm">
                Last updated: {bloodPressureTime}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-lg text-text">
              {bloodPressure} mmHg
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-green-100 p-2 rounded-lg mr-3">
              <Ionicons name="thermometer-outline" size={24} color="green" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base text-text">Temperature</Text>
              <Text className="text-subtitle text-sm">
                Last updated: {temperatureTime}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-lg text-text">
              {temperature} °F
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-[#ffffff]">
          <View className="flex-row items-center flex-1">
            <View className="bg-purple-100 p-2 rounded-lg mr-3">
              <Ionicons name="water-outline" size={24} color="purple" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base text-text">
                Blood Glucose
              </Text>
              <Text className="text-subtitle text-sm">
                Last updated: {bloodGlucoseTime}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-lg text-text">
              {bloodGlucose} mg/dL
            </Text>
          </View>
        </View>
        {/* <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-calm px-4 py-3 rounded"
        >
          <Text className="text-white font-medium mx-auto text-lg">
            Record New Vitals
          </Text>
        </Pressable>

        <RecordVitalsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={recordNewVitals}
        /> */}
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-calm px-4 py-3 rounded"
        >
          <Text className="text-white font-medium mx-auto text-lg">
            Record New Vitals
          </Text>
        </Pressable>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-background p-6 rounded-xl w-11/12">
              <Text className="text-xl font-bold text-text mb-4">
                Update Vitals
              </Text>

              <Text className="text-text mb-1">Heart Rate (bpm)</Text>
              <TextInput
                value={newHeartRate}
                onChangeText={setNewHeartRate}
                keyboardType="numeric"
                placeholder="e.g. 75"
                className="border border-border rounded p-2 mb-3"
              />

              <Text className="text-text mb-1">Blood Pressure (mmHg)</Text>
              <TextInput
                value={newBloodPressure}
                onChangeText={setNewBloodPressure}
                placeholder="e.g. 120/80"
                className="border border-border rounded p-2 mb-3"
              />

              <Text className="text-text mb-1">Temperature (°F)</Text>
              <TextInput
                value={newTemperature}
                onChangeText={setNewTemperature}
                keyboardType="numeric"
                placeholder="e.g. 98.6"
                className="border border-border rounded p-2 mb-3"
              />

              <Text className="text-text mb-1">Blood Glucose (mg/dL)</Text>
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
                  <Text className="text-text">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={recordNewVitals}
                  className="bg-primary px-4 py-2 rounded"
                >
                  <Text className="text-text font-bold">Save</Text>
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
