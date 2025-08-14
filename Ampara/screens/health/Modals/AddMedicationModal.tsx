import React, { useState } from "react";
import { Modal, View, TextInput, Pressable } from "react-native";
import { Heading, Subheading, Body } from "../../../src/components/ui";

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
        <View className="bg-white p-6 rounded-lg w-11/12">
          <Heading className="text-xl mb-4">Add New Medication</Heading>

          <TextInput
            className="border border-border rounded p-3 mb-4"
            placeholder="e.g., Lisinopril"
            placeholderTextColor="#9CA3AF"
            value={medicationName}
            onChangeText={setMedicationName}
          />
          <TextInput
            className="border border-border rounded p-3 mb-4"
            placeholder="e.g., 10mg"
            placeholderTextColor="#9CA3AF"
            value={dosage}
            onChangeText={setDosage}
          />
          <TextInput
            className="border border-border rounded p-3 mb-4"
            placeholder="e.g., Once daily at 8:00 AM"
            placeholderTextColor="#9CA3AF"
            value={frequency}
            onChangeText={setFrequency}
          />

          <View className="flex-row justify-end items-center">
            <Pressable className="mr-4" onPress={onClose}>
              <Subheading className="text-calm">Cancel</Subheading>
            </Pressable>
            <Pressable
              className="bg-calm py-2 px-4 rounded"
              onPress={handleAddMedication}
            >
              <Subheading className="text-white font-bold">
                Add Medication
              </Subheading>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMedicationModal;
