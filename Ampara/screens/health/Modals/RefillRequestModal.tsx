import React from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";

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
        <View className="bg-white p-6 rounded-lg w-11/12 max-h-[80%]">
          <Text className="font-bold text-xl mb-4">Request a Refill</Text>
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="border-b border-border py-3"
                onPress={() => onSelectMedication(item)}
              >
                <Text className="text-lg">{item.name}</Text>
              </Pressable>
            )}
          />
          <Pressable className="mt-4" onPress={onClose}>
            <Text className="text-calm text-right">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RefillRequestModal;
