import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import AddMedicationModal from "./Modals/AddMedicationModal";
import RefillRequestModal from "./Modals/RefillRequestModal";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  active: boolean;
}

const Medications = () => {
  const [addMedicationModalVisible, setAddMedicationModalVisible] =
    useState(false);
  const [refillRequestModalVisible, setRefillRequestModalVisible] =
    useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", active: true },
    { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", active: true },
  ]);

  const handleAddMedication = (medication: Omit<Medication, 'id' | 'active'>) => {
    setMedications(prev => [...prev, { ...medication, id: Date.now().toString(), active: true }]);
  };

  const toggleMedicationActive = (id: string) => {
    setMedications(prev => prev.map(med => med.id === id ? { ...med, active: !med.active } : med));
  };

  const handleSelectMedication = (medication: Medication) => {
    // Handle the selected medication for refill
    console.log("Selected medication for refill:", medication);
    setRefillRequestModalVisible(false);
  };

  return (
    <View className="p-4">
      <AddMedicationModal
        visible={addMedicationModalVisible}
        onClose={() => setAddMedicationModalVisible(false)}
        onAddMedication={handleAddMedication}
      />
      <RefillRequestModal
        visible={refillRequestModalVisible}
        onClose={() => setRefillRequestModalVisible(false)}
        medications={medications}
        onSelectMedication={handleSelectMedication}
      />
      <Text className="font-bold text-xl font-text text-text">
        Current Medications
      </Text>
      <View id="container-vitals-cards" className="mt-4 flex gap-4">
        {medications.map(med => (
          <View key={med.id} className="flex items-start justify-between border border-border rounded-lg p-3 mb-3 bg-white">
            <View className="flex-row justify-between w-full items-start">
              <View>
                <Text className="font-bold text-xl text-text">{med.name}</Text>
                <Text className="text-subtitle text-sm">{med.dosage}, {med.frequency}</Text>
              </View>
              <Pressable onPress={() => toggleMedicationActive(med.id)}>
                <Text
                  className={`border ${
                    med.active
                      ? "border-green-500 bg-green-200 text-green-700"
                      : "border-red-500 bg-red-200 text-red-700"
                  } rounded-full py-1 px-3 text-xs font-bold`}
                >
                  {med.active ? "Active" : "Inactive"}
                </Text>
              </Pressable>
            </View>
            <View className="w-full h-px bg-border my-4" />
            <Text>Next dose: Today, 8:00 PM</Text>
          </View>
        ))}
        <View className="flex-row justify-between gap-2">
          <Pressable
            className="border border-border rounded flex-1 py-3"
            onPress={() => setRefillRequestModalVisible(true)}
          >
            <Text className="font-medium mx-auto text-lg">Refill Request</Text>
          </Pressable>
          <Pressable
            className="bg-calm py-3 flex-1 rounded"
            onPress={() => setAddMedicationModalVisible(true)}
          >
            <Text className="text-white font-medium mx-auto text-lg">
              Add Medication
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Medications;
