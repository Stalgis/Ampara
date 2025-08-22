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

interface AddAllergyModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (allergy: {
    allergen: string;
    reaction?: string;
    severity?: "mild" | "moderate" | "severe";
  }) => void;
}

export default function AddAllergyModal({
  visible,
  onClose,
  onSave,
}: AddAllergyModalProps) {
  const [allergen, setAllergen] = useState("");
  const [reaction, setReaction] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "">(
    ""
  );

  const handleSave = () => {
    if (!allergen.trim()) {
      Alert.alert("Allergen required");
      return;
    }
    onSave({
      allergen: allergen.trim(),
      reaction: reaction.trim() || undefined,
      severity: (severity || undefined) as any,
    });
    setAllergen("");
    setReaction("");
    setSeverity("");
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
          {/* Safe area just for insets */}
          <SafeAreaView edges={["top", "bottom"]} className="w-full">
            {/* Put padding/rounded/bg on a regular View */}
            <View className="bg-background dark:bg-background-dark rounded-2xl p-4 overflow-hidden">
              <Text className="text-xl font-bold mb-3 text-text dark:text-text-dark">
                Add Allergy
              </Text>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Allergen *
                </Text>
                <TextInput
                  value={allergen}
                  onChangeText={setAllergen}
                  placeholder="e.g. Penicillin"
                  className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                />
              </View>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Reaction
                </Text>
                <TextInput
                  value={reaction}
                  onChangeText={setReaction}
                  placeholder="e.g. Rash"
                  className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text dark:text-text-dark"
                />
              </View>

              <View className="mb-3">
                <Text className="mb-1 text-text dark:text-text-dark">
                  Severity
                </Text>
                <View className="flex-row">
                  {(["mild", "moderate", "severe"] as const).map((s) => {
                    const selected = severity === s;
                    return (
                      <Pressable
                        key={s}
                        onPress={() => setSeverity(s)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        className={`px-3 py-2 rounded-full border mr-2 ${
                          selected
                            ? "bg-amber-100 border-amber-300"
                            : "border-border dark:border-border-dark"
                        }`}
                      >
                        <Text className="capitalize text-text dark:text-text-dark">
                          {s}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
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
