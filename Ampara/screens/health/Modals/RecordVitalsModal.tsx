import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

type Vitals = {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  bloodGlucose?: number;
};

type RecordVitalsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (newVitals: Vitals) => void;
};

const RecordVitalsModal = ({
  visible,
  onClose,
  onSave,
}: RecordVitalsModalProps) => {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [temperature, setTemperature] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");

  const handleSave = () => {
    const newVitals: Vitals = {};
    if (heartRate) newVitals.heartRate = Number(heartRate);
    if (bloodPressure) newVitals.bloodPressure = bloodPressure;
    if (temperature) newVitals.temperature = Number(temperature);
    if (bloodGlucose) newVitals.bloodGlucose = Number(bloodGlucose);
    onSave(newVitals);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Record New Vitals</Text>
          <TextInput
            style={styles.input}
            placeholder="Heart Rate (bpm)"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
          />
          <TextInput
            style={styles.input}
            placeholder="Blood Pressure (e.g., 120/80)"
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />
          <TextInput
            style={styles.input}
            placeholder="Temperature (°F)"
            keyboardType="numeric"
            value={temperature}
            onChangeText={setTemperature}
          />
          <TextInput
            style={styles.input}
            placeholder="Blood Glucose (mg/dL)"
            keyboardType="numeric"
            value={bloodGlucose}
            onChangeText={setBloodGlucose}
          />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFDF7",
    padding: 20,
    borderRadius: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 10,
    borderRadius: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#A78BFA",
  },
  buttonText: {
    color: "#3F3F46",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
  },
});

export default RecordVitalsModal;
