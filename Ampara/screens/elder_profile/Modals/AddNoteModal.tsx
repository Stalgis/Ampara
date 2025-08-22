import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export default function AddNoteModal({
  visible,
  onClose,
  onSave,
}: AddNoteModalProps) {
  const [noteText, setNoteText] = useState("");

  const handleSave = () => {
    if (!noteText.trim()) {
      Alert.alert("Note is empty");
      return;
    }
    onSave(noteText.trim());
    setNoteText("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-11/12"
        >
          {/* Safe area for modal; styling goes on inner View */}
          <SafeAreaView edges={["top", "bottom"]} className="w-full">
            <View className="bg-background dark:bg-background-dark rounded-2xl p-4 overflow-hidden">
              <Text className="text-xl font-bold mb-3 text-text dark:text-text-dark">
                Add Staff Note
              </Text>

              <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Type your note…"
                multiline
                className="min-h-[120px] border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                // Android: ensure text starts at the top of the multiline box
                style={{ textAlignVertical: "top" }}
              />

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
