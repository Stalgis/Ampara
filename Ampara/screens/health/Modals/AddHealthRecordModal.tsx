import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Heading, Subheading, Body } from "../../../src/components/ui";

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
              <View className="bg-white p-6 rounded-lg w-11/12">
                <Heading className="text-xl mb-4">
                  Add New Health Record
                </Heading>

                <Subheading className="font-medium text-text mb-1">
                  Title
                </Subheading>
                <TextInput
                  className="border border-border rounded p-3 mb-4"
                  placeholder="e.g., Annual Check-up"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                />
                <Subheading className="font-medium text-text mb-1">
                  Doctor
                </Subheading>
                <TextInput
                  className="border border-border rounded p-3 mb-4"
                  placeholder="e.g., Dr. Smith"
                  placeholderTextColor="#9CA3AF"
                  value={doctor}
                  onChangeText={setDoctor}
                />
                <Subheading className="font-medium text-text mb-1">Date</Subheading>
                <TextInput
                  className="border border-border rounded p-3 mb-4"
                  placeholder="e.g., 2023-10-27"
                  placeholderTextColor="#9CA3AF"
                  value={date}
                  onChangeText={setDate}
                />
                <Subheading className="font-medium text-text mb-1">
                  Summary
                </Subheading>
                <TextInput
                  className="border border-border rounded p-3 mb-4"
                  placeholder="e.g., Routine check-up, all clear."
                  placeholderTextColor="#9CA3AF"
                  value={summary}
                  onChangeText={setSummary}
                  multiline
                />
                <View className="flex-row justify-end items-center">
                  <Pressable className="mr-4" onPress={onClose}>
                    <Subheading className="text-calm">Cancel</Subheading>
                  </Pressable>
                  <Pressable
                    className="bg-calm py-2 px-4 rounded"
                    onPress={handleAddRecord}
                  >
                    <Subheading className="text-white font-bold">
                      Add Record
                    </Subheading>
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
