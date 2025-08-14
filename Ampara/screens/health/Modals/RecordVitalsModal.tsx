import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";
import colors from "tailwindcss/colors";

type Vitals = {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  bloodGlucose?: number;
};

type RecordVitalsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (newVitals: Vitals) => void;
};

const RecordVitalsModal = ({
  visible,
  onClose,
  onSave,
}: RecordVitalsModalProps) => {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [temperature, setTemperature] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");

  const handleSave = () => {
    const newVitals: Vitals = {};
    if (heartRate) newVitals.heartRate = Number(heartRate);
    if (bloodPressure) newVitals.bloodPressure = bloodPressure;
    if (temperature) newVitals.temperature = Number(temperature);
    if (bloodGlucose) newVitals.bloodGlucose = Number(bloodGlucose);
    onSave(newVitals);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-background p-5 rounded-lg w-4/5">
          <Text className="text-lg font-bold mb-2 text-text">Record New Vitals</Text>
          <TextInput
            className="border border-border rounded p-2 mb-2"
            placeholder="Heart Rate (bpm)"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
            placeholderTextColor={colors.gray[400]}
          />
          <TextInput
            className="border border-border rounded p-2 mb-2"
            placeholder="Blood Pressure (e.g., 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
            placeholderTextColor={colors.gray[400]}
          />
          <TextInput
            className="border border-border rounded p-2 mb-2"
            placeholder="Temperature (°F)"
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
            placeholderTextColor={colors.gray[400]}
          />
          <TextInput
            className="border border-border rounded p-2 mb-4"
            placeholder="Blood Glucose (mg/dL)"
            keyboardType="numeric"
            value={bloodGlucose}
            onChangeText={setBloodGlucose}
            placeholderTextColor={colors.gray[400]}
          />
          <View className="flex-row justify-end">
            <Pressable onPress={onClose} className="px-4 py-2 rounded mr-2">
              <Text className="text-blue-500 font-bold">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} className="bg-blue-500 px-4 py-2 rounded">
              <Text className="text-white font-bold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecordVitalsModal;
