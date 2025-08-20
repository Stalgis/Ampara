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
  ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const formatDateInput = (t: string) => {
  const d = t.replace(/\D/g, "").slice(0, 8); // keep digits only, yyyymmdd
  const parts = [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].filter(Boolean);
  return parts.join("-");
};

export const isValidISODate = (s: string) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(s)) return false;
  const dt = new Date(s);
  // ensure JS didn't auto-correct (e.g., 2025-02-30 → Mar 2)
  return !isNaN(dt.getTime()) && dt.toISOString().slice(0, 10) === s;
};

const Field = React.memo(function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  maxLength,
  editable = true,
  tokens,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: any;
  maxLength?: number;
  editable?: boolean;
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}) {
  return (
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
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
        className="rounded-xl px-3 py-2"
        style={{
          color: tokens.text,
          borderWidth: 1,
          borderColor: tokens.border,
          backgroundColor: tokens.background,
          minHeight: multiline ? 88 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
        }}
        blurOnSubmit={false}
        autoCorrect={false}
      />
    </View>
  );
});

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
  const [showPicker, setShowPicker] = useState(false);

  const onPick = (_: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      const iso = selected.toISOString().slice(0, 10); // YYYY-MM-DD
      setDate(iso);
    }
  };

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
            className="items-center justify-center p-4 my-auto"
            // style={{ flex: 1, padding: 16 }}
            pointerEvents="box-none"
          >
            
            <ScrollView
              className="rounded-2xl w-11/12 h-fit"
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
                tokens={tokens}
              />

              <Field
                label="Doctor"
                value={doctor}
                onChangeText={setDoctor}
                placeholder="e.g., Dr. Smith"
                tokens={tokens}
              />

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => setShowPicker(true), 0);
                }}
                android_ripple={{ color: "#00000022", borderless: false }}
              >
                <View pointerEvents="none">
                  <Field
                    label="Date"
                    value={date}
                    onChangeText={() => {}}
                    placeholder="YYYY-MM-DD"
                    editable={false}
                    tokens={tokens}
                  />
                </View>
              </Pressable>

              {/* 👇 put the picker RIGHT AFTER the date field, before Summary */}
              {showPicker && (
                <View style={{ zIndex: 50 }}>
                  <DateTimePicker
                    mode="date"
                    value={date ? new Date(date) : new Date()}
                    onChange={onPick}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    themeVariant="light" // keeps text visible in dark mode
                  />
                </View>
              )}

              <Field
                label="Summary"
                value={summary}
                onChangeText={setSummary}
                placeholder="Brief notes..."
                multiline
                tokens={tokens}
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
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddHealthRecordModal;
