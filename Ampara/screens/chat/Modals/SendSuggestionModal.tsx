import React, { useState } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";

export type SuggestionPayload = {
  intent: "Call" | "Message" | "Reminder";
  topic: string;
  details: string;
};

interface SendSuggestionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: SuggestionPayload) => void;
  tokens?: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const intents: Array<SuggestionPayload["intent"]> = [
  "Call",
  "Message",
  "Reminder",
];

const SendSuggestionModal: React.FC<SendSuggestionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  tokens,
}) => {
  const [intent, setIntent] = useState<SuggestionPayload["intent"]>("Call");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");

  const canSubmit = topic.trim().length >= 3 && details.trim().length >= 5;

  const reset = () => {
    setIntent("Call");
    setTopic("");
    setDetails("");
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ intent, topic: topic.trim(), details: details.trim() });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        <View
          className="w-11/12 rounded-2xl p-5"
          style={{
            backgroundColor: tokens?.background ?? "#fff",
            borderColor: tokens?.border ?? "#E5E7EB",
            borderWidth: 1,
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
            Send suggestion
          </Text>
          <Text
            className="text-xs mb-4"
            style={{ color: tokens?.subtitle ?? "#6B7280" }}
          >
            Personalize what Ampara should say or remind.
          </Text>

          {/* Intent selector (simple segmented) */}
          <View className="flex-row mb-3 bg-transparent">
            {intents.map((opt) => {
              const selected = intent === opt;
              return (
                <Pressable
                  key={opt}
                  onPress={() => setIntent(opt)}
                  className={`flex-1 py-2 mx-0.5 rounded-xl ${selected ? "" : ""}`}
                  style={{
                    backgroundColor: selected
                      ? (tokens?.highlight ?? "#F59E0B")
                      : (tokens?.background ?? "#fff"),
                    borderWidth: 1,
                    borderColor: tokens?.border ?? "#E5E7EB",
                  }}
                >
                  <Text
                    className="text-center text-sm font-semibold"
                    style={{
                      color: selected ? "#fff" : (tokens?.text ?? "#111827"),
                    }}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Topic */}
          <View className="mb-3">
            <Text
              className="text-sm mb-1"
              style={{ color: tokens?.text ?? "#111827" }}
            >
              Topic
            </Text>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="E.g. Mery's birthday / Medication reminder"
              placeholderTextColor={tokens?.subtitle ?? "#9CA3AF"}
              className="rounded-xl px-3 py-2"
              style={{
                color: tokens?.text ?? "#111827",
                borderWidth: 1,
                borderColor: tokens?.border ?? "#E5E7EB",
                backgroundColor: tokens?.background ?? "#fff",
              }}
            />
          </View>

          {/* Details */}
          <View className="mb-4">
            <Text
              className="text-sm mb-1"
              style={{ color: tokens?.text ?? "#111827" }}
            >
              Details
            </Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="Add the suggested message or specific instructions"
              placeholderTextColor={tokens?.subtitle ?? "#9CA3AF"}
              multiline
              numberOfLines={4}
              className="rounded-xl px-3 py-2"
              style={{
                minHeight: 90,
                textAlignVertical: "top",
                color: tokens?.text ?? "#111827",
                borderWidth: 1,
                borderColor: tokens?.border ?? "#E5E7EB",
                backgroundColor: tokens?.background ?? "#fff",
              }}
            />
            <Text
              className="text-xs mt-1"
              style={{ color: tokens?.subtitle ?? "#6B7280" }}
            >
              {details.length}/500
            </Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-xl py-3"
              style={{
                borderWidth: 1,
                borderColor: tokens?.border ?? "#E5E7EB",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: tokens?.text ?? "#111827" }}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 rounded-xl py-3"
              style={{
                backgroundColor: canSubmit
                  ? (tokens?.highlight ?? "#F59E0B")
                  : "#E5E7EB",
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: canSubmit ? "#fff" : "#9CA3AF" }}
              >
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default SendSuggestionModal;
