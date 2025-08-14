import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
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
}

const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({
  visible,
  onClose,
  onAddRecord,
}) => {
  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");

  const handleAddRecord = () => {
    if (title && doctor && date && summary) {
      onAddRecord({ title, doctor, date, summary });
      setTitle("");
      setDoctor("");
      setDate("");
      setSummary("");
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/30">
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              className="w-full"
            >
              <View className="bg-background p-6 rounded-2xl w-11/12">
                <Text className="font-bold text-xl mb-4">
                  Add New Health Record
                </Text>

                <Text className="font-medium text-text mb-1">Title</Text>
                <TextInput
                  className="border border-border rounded-2xl p-3 mb-4"
                  placeholder="e.g., Annual Check-up"
                  placeholderTextColor="#6B7280"
                  value={title}
                  onChangeText={setTitle}
                />
                <Text className="font-medium text-text mb-1">Doctor</Text>
                <TextInput
                  className="border border-border rounded-2xl p-3 mb-4"
                  placeholder="e.g., Dr. Smith"
                  placeholderTextColor="#6B7280"
                  value={doctor}
                  onChangeText={setDoctor}
                />
                <Text className="font-medium text-text mb-1">Date</Text>
                <TextInput
                  className="border border-border rounded-2xl p-3 mb-4"
                  placeholder="e.g., 2023-10-27"
                  placeholderTextColor="#6B7280"
                  value={date}
                  onChangeText={setDate}
                />
                <Text className="font-medium text-text mb-1">Summary</Text>
                <TextInput
                  className="border border-border rounded-2xl p-3 mb-4"
                  placeholder="e.g., Routine check-up, all clear."
                  placeholderTextColor="#6B7280"
                  value={summary}
                  onChangeText={setSummary}
                  multiline
                />

                <View className="flex-row justify-end items-center">
                  <Pressable className="mr-4" onPress={onClose}>
                    <Text className="text-calm">Cancel</Text>
                  </Pressable>
                  <Pressable
                    className="bg-calm py-2 px-4 rounded-2xl"
                    onPress={handleAddRecord}
                  >
                    <Text className="text-white font-bold">Add Record</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddHealthRecordModal;
