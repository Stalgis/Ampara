import React from "react";
import { Modal, View, Text, Pressable, Platform } from "react-native";

export type CallItem = {
  date: string; // "08/08/2025, 9:00AM"
  topic: string; // short subtitle for the card
  description: string; // long text shown inside the modal
};

interface CallDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  call?: CallItem | null;
  // Optional: design tokens for theming (pass from parent)
  tokens?: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const CallDetailsModal: React.FC<CallDetailsModalProps> = ({
  visible,
  onClose,
  call,
  tokens,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        accessibilityRole="button"
        accessibilityLabel="Close call details"
      >
        {/* Card */}
        <View
          className="w-11/12 rounded-2xl p-5"
          style={{
            backgroundColor: tokens?.background ?? "#fff",
            borderColor: tokens?.border ?? "#E5E7EB",
            borderWidth: 1,
            // soft shadow
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          }}
        >
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: tokens?.text ?? "#111827" }}
          >
            Call details
          </Text>
          <Text
            className="text-xs mb-3"
            style={{ color: tokens?.subtitle ?? "#6B7280" }}
          >
            {call?.date}
          </Text>

          <View className="mb-3">
            <Text
              className="text-base font-semibold mb-1"
              style={{ color: tokens?.text ?? "#111827" }}
            >
              Topic
            </Text>
            <Text style={{ color: tokens?.text ?? "#111827" }}>
              {call?.topic}
            </Text>
          </View>

          <View className="mb-5">
            <Text
              className="text-base font-semibold mb-1"
              style={{ color: tokens?.text ?? "#111827" }}
            >
              Description
            </Text>
            <Text style={{ color: tokens?.text ?? "#111827" }}>
              {call?.description}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="rounded-xl py-3"
            style={{ backgroundColor: tokens?.highlight ?? "#F59E0B" }}
          >
            <Text
              className="text-center font-semibold"
              style={{ color: "#fff" }}
            >
              Close
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CallDetailsModal;
