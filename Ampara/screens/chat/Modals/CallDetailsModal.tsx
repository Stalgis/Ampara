
import React from "react";
import { View, Text, Modal, Pressable } from "react-native";

interface CallDetailsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CallDetailsModal: React.FC<CallDetailsModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-background p-6 rounded-lg w-11/12">
          <Text className="text-lg font-bold mb-4">Call Details</Text>
          <Text className="text-base mb-4">
            This is a brief description of the call that took place.
          </Text>
          <Pressable
            className="bg-primary p-3 rounded-lg items-center mb-2"
            onPress={() => {
              /* Navigate to conversation screen */
            }}
          >
            <Text className="text-white font-bold">See Conversation</Text>
          </Pressable>
          <Pressable
            className="bg-border p-3 rounded-lg items-center"
            onPress={onClose}
          >
            <Text className="text-text font-bold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CallDetailsModal;
