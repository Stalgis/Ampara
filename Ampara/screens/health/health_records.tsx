import React, { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import AddHealthRecordModal from "./Modals/AddHealthRecordModal";

interface HealthRecord {
  id: string;
  visitType: string;
  doctor: string;
  date: string;
  details: string;
}

const HealthRecords = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(
    null
  );

  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      visitType: "Cardiology Check-up",
      doctor: "Dr. Smith",
      date: "2023-10-26",
      details: "Routine check-up. Everything looks good.",
    },
    {
      id: "2",
      visitType: "Dermatology Visit",
      doctor: "Dr. Jones",
      date: "2023-09-15",
      details: "Follow-up on skin rash. Prescribed new cream.",
    },
  ]);

  const openModal = (record: HealthRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setModalVisible(false);
  };

  const handleAddRecord = (record: {
    title: string;
    doctor: string;
    date: string;
    summary: string;
  }) => {
    const newRecord: HealthRecord = {
      id: (records.length + 1).toString(),
      visitType: record.title,
      doctor: record.doctor,
      date: record.date,
      details: record.summary,
    };
    setRecords([...records, newRecord]);
  };

  return (
    <View className="p-4">
      <Text className="font-bold text-xl font-text text-text">
        Health Records
      </Text>
      <View id="container-records-cards" className="mt-4 flex gap-4">
        {records.map((record) => (
          <View
            key={record.id}
            className="flex-row items-center justify-between border border-border rounded-lg p-3 mb-3 bg-background"
          >
            <View>
              <Text className="font-bold text-xl text-text">
                {record.visitType}
              </Text>
              <Text className="text-subtitle text-sm">
                {record.doctor} - {record.date}
              </Text>
            </View>
            <Pressable onPress={() => openModal(record)}>
              <Text className="text-calm font-bold">View</Text>
            </Pressable>
          </View>
        ))}
        <Pressable
          className="bg-calm py-3 rounded mt-4"
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-medium mx-auto text-lg">
            Upload New Record
          </Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-background p-6 rounded-lg w-11/12">
            <Text className="font-bold text-xl mb-4">
              {selectedRecord?.visitType}
            </Text>
            <Text className="text-subtitle text-sm mb-4">
              {selectedRecord?.doctor} - {selectedRecord?.date}
            </Text>
            <Text>{selectedRecord?.details}</Text>
            <Pressable className="mt-4" onPress={closeModal}>
              <Text className="text-calm text-right">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <AddHealthRecordModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddRecord={handleAddRecord}
      />
    </View>
  );
};

export default HealthRecords;
