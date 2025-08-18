import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Subheading } from "../../../src/components/ui";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  active: boolean;
}

interface RefillRequestModalProps {
  visible: boolean;
  onClose: () => void;
  medications: Medication[];
  onSelectMedication: (medication: Medication) => void;
  tokens: {
    background: string;
    text: string;
    subtitle: string;
    border: string;
    highlight: string;
  };
}

const RefillRequestModal: React.FC<RefillRequestModalProps> = ({
  visible,
  onClose,
  medications,
  onSelectMedication,
  tokens,
}) => {
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
                Request a Refill
              </Text>
              <Text className="text-xs mb-4" style={{ color: tokens.subtitle }}>
                Choose a medication to request a refill.
              </Text>

              {/* Simple list (not scrollable by request). If you have many meds, consider truncating or switching back to FlatList. */}
              <View>
                {medications.slice(0, 6).map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => onSelectMedication(item)}
                    className="py-3"
                    style={{ borderBottomWidth: 1, borderColor: tokens.border }}
                  >
                    <Subheading
                      className="text-base"
                      style={{ color: tokens.text }}
                    >
                      {item.name}
                    </Subheading>
                    <Text
                      className="text-xs mt-0.5"
                      style={{ color: tokens.subtitle }}
                    >
                      {item.dosage} · {item.frequency}
                    </Text>
                  </Pressable>
                ))}
                {medications.length > 6 && (
                  <Text
                    className="text-xs mt-2"
                    style={{ color: tokens.subtitle }}
                  >
                    Showing first 6. Add scrolling if your list is longer.
                  </Text>
                )}
              </View>

              <View className="flex-row gap-3 mt-5">
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
                  onPress={onClose}
                  className="flex-1 rounded-xl py-3"
                  style={{ backgroundColor: tokens.highlight }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: "#fff" }}
                  >
                    Done
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

export default RefillRequestModal;
