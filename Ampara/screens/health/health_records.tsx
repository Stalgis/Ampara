import React, { useState } from "react";
import { View, Pressable, Modal, Text } from "react-native";
import AddHealthRecordModal from "./Modals/AddHealthRecordModal";
import { Heading, Body } from "../../src/components/ui";
import { designTokens } from "../../design-tokens";
import { useTheme } from "../../controllers/ThemeContext";

interface HealthRecord {
  id: string;
  visitType: string;
  doctor: string;
  date: string;
  details: string;
}

const HealthRecords: React.FC = () => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

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
    setRecords((prev) => [...prev, newRecord]);
  };

  const Card = ({ r }: { r: HealthRecord }) => (
    <View
      className="rounded-2xl p-4 mb-3 bg-background border"
      style={{
        borderColor: tokens.border,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="pr-3 flex-1">
          <Text
            className="font-semibold text-base"
            style={{ color: tokens.text }}
          >
            {r.visitType}
          </Text>
          <Body className="text-sm mt-0.5" style={{ color: tokens.subtitle }}>
            {r.doctor} · {r.date}
          </Body>
        </View>
        <Pressable
          onPress={() => openModal(r)}
          className="rounded-lg px-3 py-2"
          style={{ borderWidth: 1, borderColor: tokens.border }}
        >
          <Text style={{ color: tokens.text, fontWeight: "600" }}>View</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View className="p-4 bg-background">
      <Heading className="text-xl" style={{ color: tokens.text }}>
        Health Records
      </Heading>

      <View className="mt-4">
        {records.map((r) => (
          <Card key={r.id} r={r} />
        ))}

        <Pressable
          className="rounded-xl py-3 mt-2"
          style={{ backgroundColor: tokens.highlight }}
          onPress={() => setAddModalVisible(true)}
        >
          <Text className="text-white font-semibold mx-auto text-lg">
            Upload New Record
          </Text>
        </Pressable>
      </View>

      {/* Details Modal (centered, non-scroll) */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
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
              {selectedRecord?.visitType}
            </Text>
            <Body className="text-sm mb-4" style={{ color: tokens.subtitle }}>
              {selectedRecord?.doctor} · {selectedRecord?.date}
            </Body>
            <Body style={{ color: tokens.text }}>
              {selectedRecord?.details}
            </Body>

            <View className="flex-row justify-end mt-5">
              <Pressable
                onPress={closeModal}
                className="px-4 py-2 rounded-lg"
                style={{ borderWidth: 1, borderColor: tokens.border }}
              >
                <Text style={{ color: tokens.text, fontWeight: "600" }}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Record Modal (centered, keyboard-safe) */}
      <AddHealthRecordModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddRecord={handleAddRecord}
        tokens={tokens} // ✅ pass tokens
      />
    </View>
  );
};

export default HealthRecords;
