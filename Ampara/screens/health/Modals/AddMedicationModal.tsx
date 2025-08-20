// components/Medications/Modals/AddMedicationModal.tsx
import React, { useState, memo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";

type Tokens = {
  background: string;
  text: string;
  subtitle: string;
  border: string;
  highlight: string;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddMedication: (m: {
    name: string;
    dosage: string;
    frequency: string;
  }) => void;
  tokens: Tokens;
}

/** Memoized Field – keeps focus stable and preserves NativeWind classes */
const Field = memo(function Field({
  label,
  value,
  onChangeText,
  placeholder,
  tokens,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  tokens: Tokens;
}) {
  return (
    <View className="mb-3">
      <Text className="text-sm mb-1" style={{ color: tokens.text }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.subtitle}
        className="rounded-2xl px-3 py-2 border"
        style={{
          borderColor: tokens.border,
          backgroundColor: tokens.background,
          color: tokens.text,
        }}
        blurOnSubmit={false}
        autoCorrect={false}
        returnKeyType="done"
      />
    </View>
  );
});

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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Backdrop */}
        <View className="flex-1 bg-black/40">
          {/* Tap outside only dismisses keyboard (not the modal) */}
          <Pressable onPress={Keyboard.dismiss} className="absolute inset-0" />

          {/* Centered content (restores original look) */}
          <View className="justify-center items-center px-4 flex-1 ">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                className="my-auto w-80 max-w-md self-center rounded-3xl border p-6 bg-background"
                style={{
                  borderColor: tokens.border,
                  // iOS shadow
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 8 },
                  // Android shadow
                  elevation: 10,
                }}
              >
                <Text
                  className="text-lg font-bold mb-1"
                  style={{ color: tokens.text }}
                >
                  Add Medication
                </Text>
                <Text
                  className="text-xs mb-4"
                  style={{ color: tokens.subtitle }}
                >
                  Fill all fields to continue.
                </Text>

                <Field
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Metformin"
                  tokens={tokens}
                />
                <Field
                  label="Dosage"
                  value={dosage}
                  onChangeText={setDosage}
                  placeholder="e.g. 500mg"
                  tokens={tokens}
                />
                <Field
                  label="Frequency"
                  value={frequency}
                  onChangeText={setFrequency}
                  placeholder="e.g. Twice daily"
                  tokens={tokens}
                />

                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    onPress={onClose}
                    className="flex-1 rounded-xl py-3 border"
                    style={{ borderColor: tokens.border }}
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
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMedicationModal;
