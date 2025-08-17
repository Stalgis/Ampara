// components/Medications/Modals/AddMedicationModal.tsx
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

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddMedication: (m: {
    name: string;
    dosage: string;
    frequency: string;
  }) => void;
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const AddMedicationModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddMedication,
  tokens,
}) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const canSave =
    name.trim().length > 0 &&
    dosage.trim().length > 0 &&
    frequency.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onAddMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
    });
    setName("");
    setDosage("");
    setFrequency("");
    onClose();
  };

  const Field = ({ label, value, onChangeText, placeholder }: any) => (
    <View style={{ marginBottom: 12 }}>
      <Text className="text-sm mb-1" style={{ color: tokens.text }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.subtitle}
        className="rounded-xl px-3 py-2"
        style={{
          color: tokens.text,
          borderWidth: 1,
          borderColor: tokens.border,
          backgroundColor: tokens.background,
        }}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        <View
          style={{ position: "absolute", inset: 0 }}
          pointerEvents="box-none"
        >
          <View
            className="items-center justify-center"
            style={{ flex: 1, padding: 16 }}
            pointerEvents="box-none"
          >
            <View
              className="rounded-2xl w-11/12"
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
                padding: 20,
              }}
            >
              <Text
                className="text-lg font-bold mb-1"
                style={{ color: tokens.text }}
              >
                Add Medication
              </Text>
              <Text className="text-xs mb-4" style={{ color: tokens.subtitle }}>
                Fill all fields to continue.
              </Text>

              <Field
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Metformin"
              />
              <Field
                label="Dosage"
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g. 500mg"
              />
              <Field
                label="Frequency"
                value={frequency}
                onChangeText={setFrequency}
                placeholder="e.g. Twice daily"
              />

              <View className="flex-row gap-3 mt-2">
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
                  onPress={save}
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
                    Add
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMedicationModal;
