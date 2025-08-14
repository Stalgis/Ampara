import React from "react";
import { View, Pressable, Modal, FlatList } from "react-native";
import { Heading, Subheading, Body } from "../../../src/components/ui";

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
}

const RefillRequestModal: React.FC<RefillRequestModalProps> = ({
  visible,
  onClose,
  medications,
  onSelectMedication,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-background p-6 rounded-lg w-11/12 max-h-[80%]">
          <Text className="font-bold text-xl mb-4">Request a Refill</Text>
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="border-b border-border py-3"
                onPress={() => onSelectMedication(item)}
              >
                <Subheading className="text-lg">{item.name}</Subheading>
              </Pressable>
            )}
          />
          <Pressable className="mt-4" onPress={onClose}>
            <Subheading className="text-calm text-right">Cancel</Subheading>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RefillRequestModal;
