import React, { useEffect, useState } from "react";
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

const intents: Array<SuggestionPayload["intent"]> = ["Call", "Message", "Reminder"];

const SendSuggestionModal: React.FC<SendSuggestionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  tokens,
}) => {
  const [intent, setIntent] = useState<SuggestionPayload["intent"]>("Call");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [ack, setAck] = useState(false);

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
    setAck(true);
  };

  useEffect(() => {
    if (!visible) setAck(false);
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Backdrop: tap to dismiss keyboard (NOT the modal) */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        {/* Centered card above the backdrop (same skeleton as AddEventModal) */}
        <View
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          pointerEvents="box-none"
          className="items-center justify-center"
        >
          <Pressable
            onPress={() => {}}
            className="w-11/12 rounded-2xl overflow-hidden"
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
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20 }}
            >
              {!ack ? (
                <>
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

                  {/* Intent segmented control */}
                  <View className="flex-row mb-3">
                    {intents.map((opt) => {
                      const selected = intent === opt;
                      return (
                        <Pressable
                          key={opt}
                          onPress={() => setIntent(opt)}
                          className="flex-1 py-2 mx-0.5 rounded-xl"
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
                    <Text className="text-sm mb-1" style={{ color: tokens?.text ?? "#111827" }}>
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
                      maxLength={80}
                    />
                  </View>

                  {/* Details */}
                  <View className="mb-4">
                    <Text className="text-sm mb-1" style={{ color: tokens?.text ?? "#111827" }}>
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
                      maxLength={500}
                    />
                    <Text className="text-xs mt-1" style={{ color: tokens?.subtitle ?? "#6B7280" }}>
                      {details.length}/500
                    </Text>
                  </View>
                </>
              ) : (
                // Ack content (inside scroll so layout is consistent)
                <View className="items-center py-10">
                  <Text className="text-4xl mb-3">✅</Text>
                  <Text
                    className="text-base font-semibold mb-1 text-center"
                    style={{ color: tokens?.text ?? "#111827" }}
                  >
                    Suggestion sent
                  </Text>
                  <Text
                    className="text-xs text-center mb-6"
                    style={{ color: tokens?.subtitle ?? "#6B7280" }}
                  >
                    Ampara received your suggestion and will use it appropriately.
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Footer (outside ScrollView, like your AddEventModal) */}
            <View className="flex-row gap-3 px-5 pb-5">
              {!ack ? (
                <>
                  <Pressable
                    onPress={onClose}
                    className="flex-1 rounded-xl py-3"
                    style={{ borderWidth: 1, borderColor: tokens?.border ?? "#E5E7EB" }}
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
                </>
              ) : (
                <Pressable
                  onPress={onClose}
                  className="flex-1 rounded-xl py-3"
                  style={{ backgroundColor: tokens?.highlight ?? "#F59E0B" }}
                >
                  <Text className="text-center font-semibold text-white">OK</Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SendSuggestionModal;

