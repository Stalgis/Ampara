import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogMedModal({ visible, onClose, onSave }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    if (!name.trim() || !dosage.trim() || !time.trim()) {
      Alert.alert("All fields are required");
      return;
    }
    onSave({ name: name.trim(), dosage: dosage.trim(), time: time.trim() });
    setName("");
    setDosage("");
    setTime("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-11/12"
        >
          {/* SafeAreaView only for insets; no heavy styling here */}
          <SafeAreaView edges={["bottom", "top"]} className="w-full">
            {/* Put padding/rounded/bg on a normal View */}
            <View className="bg-background dark:bg-background-dark rounded-2xl p-4 overflow-hidden">
              <Text className="text-xl font-bold mb-3 text-text dark:text-text-dark">
                Log Medication
              </Text>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Medication Name *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Metformin"
                  className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                />
              </View>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Dosage *
                </Text>
                <TextInput
                  value={dosage}
                  onChangeText={setDosage}
                  placeholder="e.g. 500 mg"
                  className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                />
              </View>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Time *
                </Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 08:00"
                  className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                />
              </View>

              <View className="flex-row mt-4">
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-amber-500 rounded-2xl py-3 mr-2 items-center"
                >
                  <Text className="text-white font-semibold">Save</Text>
                </Pressable>
                <Pressable
                  onPress={onClose}
                  className="flex-1 border border-border dark:border-border-dark rounded-2xl py-3 items-center"
                >
                  <Text className="text-text dark:text-text-dark">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
