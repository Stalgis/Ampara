import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import FormInput from "../../../src/components/ui/FormInput";
import PrimaryButton from "../../../src/components/ui/PrimaryButton";

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
          <Text className="font-bold text-xl mb-4">Add New Medication</Text>

          <FormInput
            label="Medication Name"
            containerClassName="mb-4"
            placeholder="e.g., Lisinopril"
            placeholderTextColor="#9CA3AF"
            value={medicationName}
            onChangeText={setMedicationName}
          />
          <FormInput
            label="Dosage"
            containerClassName="mb-4"
            placeholder="e.g., 10mg"
            placeholderTextColor="#9CA3AF"
            value={dosage}
            onChangeText={setDosage}
          />
          <FormInput
            label="Frequency"
            containerClassName="mb-4"
            placeholder="e.g., Once daily at 8:00 AM"
            placeholderTextColor="#9CA3AF"
            value={frequency}
            onChangeText={setFrequency}
          />

          <View className="flex-row justify-end items-center">
            <Pressable className="mr-4" onPress={onClose}>
              <Text className="text-calm">Cancel</Text>
            </Pressable>
            <PrimaryButton
              title="Add Medication"
              onPress={handleAddMedication}
              className="py-2 px-4"
              textClassName="font-bold"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMedicationModal;
