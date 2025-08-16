import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export type EventPayload = {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:00 - 15:00"
  type: "Social" | "Health" | "Reminder";
  location?: string;
  notes?: string;
};

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: EventPayload) => void;
  defaultDate: string; // initial date preselected from calendar
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultDate,
  tokens,
}) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<EventPayload["type"]>("Social");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Date state (with picker)
  const [dateObj, setDateObj] = useState(() => new Date(defaultDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = useMemo(() => toYMD(dateObj), [dateObj]);

  const canSubmit = title.trim().length >= 3 && time.trim().length >= 3;

  const reset = () => {
    setTitle("");
    setTime("");
    setType("Social");
    setLocation("");
    setNotes("");
    setDateObj(new Date(defaultDate));
  };

  const onChangeDate = (e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (d) setDateObj(d);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      date: selectedDate,
      time: time.trim(),
      type,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    reset();
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
        {/* Backdrop: tap to dismiss keyboard (NOT the modal) */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        {/* Centered card above the backdrop */}
        <View
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          pointerEvents="box-none"
          className="items-center justify-center"
        >
          {/* Pressable to absorb taps so card doesn't close */}
          <Pressable
            onPress={() => {}}
            className="w-11/12 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: tokens.background,
              borderColor: tokens.border,
              borderWidth: 1,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 10,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20 }}
            >
              <Text
                className="text-lg font-bold mb-1"
                style={{ color: tokens.text }}
              >
                Add event
              </Text>
              <Text className="text-xs mb-4" style={{ color: tokens.subtitle }}>
                {selectedDate}
              </Text>

              {/* Type segmented */}
              <View className="flex-row mb-3">
                {(["Social", "Health", "Reminder"] as const).map((opt) => {
                  const selected = type === opt;
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => setType(opt)}
                      className="flex-1 py-2 mx-0.5 rounded-xl"
                      style={{
                        backgroundColor: selected
                          ? tokens.highlight
                          : tokens.background,
                        borderWidth: 1,
                        borderColor: tokens.border,
                      }}
                    >
                      <Text
                        className="text-center text-sm font-semibold"
                        style={{ color: selected ? "#fff" : tokens.text }}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Date picker launcher */}
              <View className="mb-3">
                <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                  Date
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="rounded-xl px-3 py-3"
                  style={{
                    borderWidth: 1,
                    borderColor: tokens.border,
                    backgroundColor: tokens.background,
                  }}
                >
                  <Text style={{ color: tokens.text }}>{selectedDate}</Text>
                </Pressable>
                {showDatePicker && (
                  <View className="mt-2">
                    <DateTimePicker
                      value={dateObj}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={onChangeDate}
                      minimumDate={new Date()}
                      textColor={tokens.text}
                    />
                    {Platform.OS === "ios" && (
                      <View className="flex-row justify-end mt-2">
                        <Pressable
                          onPress={() => setShowDatePicker(false)}
                          className="px-3 py-2 rounded"
                          style={{ backgroundColor: tokens.highlight }}
                        >
                          <Text className="text-white font-semibold">Done</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Title */}
              <View className="mb-3">
                <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                  Title
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Group Meeting"
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

              {/* Time */}
              <View className="mb-3">
                <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                  Time
                </Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="14:00 - 15:00"
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

              {/* Location */}
              <View className="mb-3">
                <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                  Location (optional)
                </Text>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Clinic Room B"
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

              {/* Notes */}
              <View className="mb-4">
                <Text className="text-sm mb-1" style={{ color: tokens.text }}>
                  Notes (optional)
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any details or instructions"
                  placeholderTextColor={tokens.subtitle}
                  multiline
                  numberOfLines={4}
                  className="rounded-xl px-3 py-2"
                  style={{
                    minHeight: 90,
                    textAlignVertical: "top",
                    color: tokens.text,
                    borderWidth: 1,
                    borderColor: tokens.border,
                    backgroundColor: tokens.background,
                  }}
                />
              </View>
            </ScrollView>

            {/* Footer actions (outside ScrollView) */}
            <View className="flex-row gap-3 px-5 pb-5">
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
                onPress={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 rounded-xl py-3"
                style={{
                  backgroundColor: canSubmit ? tokens.highlight : "#E5E7EB",
                }}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: canSubmit ? "#fff" : "#9CA3AF" }}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddEventModal;
