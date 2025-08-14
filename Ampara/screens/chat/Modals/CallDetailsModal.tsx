
import React from "react";
import { View, Modal, Pressable } from "react-native";
import { Heading, Subheading, Body } from "../../../src/components/ui";

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
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Heading className="text-lg mb-4">Call Details</Heading>
          <Body className="text-base mb-4">
            This is a brief description of the call that took place.
          </Body>
          <Pressable
            className="bg-primary p-3 rounded-lg items-center mb-2"
            onPress={() => {
              /* Navigate to conversation screen */
            }}
          >
            <Subheading className="text-white font-bold">
              See Conversation
            </Subheading>
          </Pressable>
          <Pressable
            className="bg-gray-300 p-3 rounded-lg items-center"
            onPress={onClose}
          >
            <Subheading className="text-black font-bold">Close</Subheading>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CallDetailsModal;
