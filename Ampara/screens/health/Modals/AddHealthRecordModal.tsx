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

interface AddHealthRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onAddRecord: (record: {
    title: string;
    doctor: string;
    date: string;
    summary: string;
  }) => void;
  // ✅ tokens for consistent styling across the app
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({
  visible,
  onClose,
  onAddRecord,
  tokens,
}) => {
  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");

  const canSave =
    title.trim() && doctor.trim() && date.trim() && summary.trim();

  const handleAddRecord = () => {
    if (!canSave) return;
    onAddRecord({
      title: title.trim(),
      doctor: doctor.trim(),
      date: date.trim(),
      summary: summary.trim(),
    });
    setTitle("");
    setDoctor("");
    setDate("");
    setSummary("");
    onClose();
  };

  const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
  }: any) => (
    <View style={{ marginBottom: 12 }}>
      <Text className="text-sm mb-1" style={{ color: tokens.text }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.subtitle}
        multiline={multiline}
        className="rounded-xl px-3 py-2"
        style={{
          color: tokens.text,
          borderWidth: 1,
          borderColor: tokens.border,
          backgroundColor: tokens.background,
          minHeight: multiline ? 88 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
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
      {/* Whole screen moves with the keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Backdrop only hides keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        {/* Centered card */}
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
                Add New Health Record
              </Text>
              <Text className="text-xs mb-4" style={{ color: tokens.subtitle }}>
                Fill all fields to continue.
              </Text>

              <Field
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Annual Check-up"
              />
              <Field
                label="Doctor"
                value={doctor}
                onChangeText={setDoctor}
                placeholder="e.g., Dr. Smith"
              />
              <Field
                label="Date"
                value={date}
                onChangeText={setDate}
                placeholder="e.g., 2025-08-18"
              />
              <Field
                label="Summary"
                value={summary}
                onChangeText={setSummary}
                placeholder="Brief notes..."
                multiline
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
                  onPress={handleAddRecord}
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
                    Add Record
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

export default AddHealthRecordModal;
