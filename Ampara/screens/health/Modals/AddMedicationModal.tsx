import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";

interface AddMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMedication: (medication: {
    name: string;
    dosage: string;
    frequency: string;
  }) => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  visible,
  onClose,
  onAddMedication,
}) => {
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleAddMedication = () => {
    if (medicationName && dosage && frequency) {
      onAddMedication({ name: medicationName, dosage, frequency });
      setMedicationName("");
      setDosage("");
      setFrequency("");
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-background p-6 rounded-2xl w-11/12">
          <Text className="font-bold text-xl mb-4">Add New Medication</Text>

          <TextInput
            className="border border-border rounded-2xl p-3 mb-4"
            placeholder="e.g., Lisinopril"
            placeholderTextColor="#6B7280"
            value={medicationName}
            onChangeText={setMedicationName}
          />
          <TextInput
            className="border border-border rounded-2xl p-3 mb-4"
            placeholder="e.g., 10mg"
            placeholderTextColor="#6B7280"
            value={dosage}
            onChangeText={setDosage}
          />
          <TextInput
            className="border border-border rounded-2xl p-3 mb-4"
            placeholder="e.g., Once daily at 8:00 AM"
            placeholderTextColor="#6B7280"
            value={frequency}
            onChangeText={setFrequency}
          />

          <View className="flex-row justify-end items-center">
            <Pressable className="mr-4" onPress={onClose}>
              <Text className="text-calm">Cancel</Text>
            </Pressable>
            <Pressable
              className="bg-calm py-2 px-4 rounded-2xl"
              onPress={handleAddMedication}
            >
              <Text className="text-white font-bold">Add Medication</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMedicationModal;
