import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type VitalsPatch = {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  bloodGlucose?: number;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (v: VitalsPatch) => void;
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const RecordVitalsModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  tokens,
}) => {
  const insets = useSafeAreaInsets();

  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [temperature, setTemperature] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");

  const canSave =
    heartRate.trim() !== "" ||
    bloodPressure.trim() !== "" ||
    temperature.trim() !== "" ||
    bloodGlucose.trim() !== "";

  const handleSave = () => {
    const patch: VitalsPatch = {};
    if (heartRate.trim()) patch.heartRate = Number(heartRate);
    if (bloodPressure.trim()) patch.bloodPressure = bloodPressure.trim();
    if (temperature.trim()) patch.temperature = Number(temperature);
    if (bloodGlucose.trim()) patch.bloodGlucose = Number(bloodGlucose);
    onSave(patch);
    setHeartRate("");
    setBloodPressure("");
    setTemperature("");
    setBloodGlucose("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Make the whole screen keyboard-aware */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top + 16} // moves with keyboard
      >
        {/* Backdrop only dismisses keyboard (not the modal) */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        {/* Centered card above the backdrop */}
        <View
          style={{ position: "absolute", inset: 0 }}
          pointerEvents="box-none"
        >
          <View
            className="items-center justify-center"
            style={{ flex: 1, padding: 16 }}
            pointerEvents="box-none"
          >
            <Pressable
              onPress={() => {}}
              className="rounded-2xl w-11/12"
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                // subtle shadow
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
                // fixed padding/height — no ScrollView (as requested)
                padding: 20,
              }}
            >
              <Text
                className="text-lg font-bold mb-1"
                style={{ color: tokens.text }}
              >
                Record New Vitals
              </Text>
              <Text className="text-xs mb-4" style={{ color: tokens.subtitle }}>
                Enter only what changed; leave the rest blank.
              </Text>

              <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                Heart Rate (bpm)
              </Text>
              <TextInput
                value={heartRate}
                onChangeText={setHeartRate}
                placeholder="e.g. 76"
                keyboardType="numeric"
                placeholderTextColor={tokens.subtitle}
                className="rounded-xl px-3 py-2 mb-3"
                style={{
                  color: tokens.text,
                  borderWidth: 1,
                  borderColor: tokens.border,
                  backgroundColor: tokens.background,
                }}
              />

              <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                Blood Pressure (mmHg)
              </Text>
              <TextInput
                value={bloodPressure}
                onChangeText={setBloodPressure}
                placeholder="e.g. 120/80"
                placeholderTextColor={tokens.subtitle}
                className="rounded-xl px-3 py-2 mb-3"
                style={{
                  color: tokens.text,
                  borderWidth: 1,
                  borderColor: tokens.border,
                  backgroundColor: tokens.background,
                }}
              />

              <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                Temperature (°F)
              </Text>
              <TextInput
                value={temperature}
                onChangeText={setTemperature}
                placeholder="e.g. 98.6"
                keyboardType="numeric"
                placeholderTextColor={tokens.subtitle}
                className="rounded-xl px-3 py-2 mb-3"
                style={{
                  color: tokens.text,
                  borderWidth: 1,
                  borderColor: tokens.border,
                  backgroundColor: tokens.background,
                }}
              />

              <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                Blood Glucose (mg/dL)
              </Text>
              <TextInput
                value={bloodGlucose}
                onChangeText={setBloodGlucose}
                placeholder="e.g. 100"
                keyboardType="numeric"
                placeholderTextColor={tokens.subtitle}
                className="rounded-xl px-3 py-2 mb-5"
                style={{
                  color: tokens.text,
                  borderWidth: 1,
                  borderColor: tokens.border,
                  backgroundColor: tokens.background,
                }}
              />

              <View className="flex-row gap-3">
                <Pressable
                  onPress={onClose}
                  className="flex-1 rounded-xl py-3"
                  style={{ borderWidth: 1, borderColor: tokens.border }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: tokens.text }}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={!canSave}
                  className="flex-1 rounded-xl py-3"
                  style={{
                    backgroundColor: canSave ? tokens.highlight : "#E5E7EB",
                  }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: canSave ? "#fff" : "#9CA3AF" }}
                  >
                    Save
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RecordVitalsModal;
