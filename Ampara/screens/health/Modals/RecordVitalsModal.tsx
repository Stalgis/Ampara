import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Heading, Subheading } from "../../../src/components/ui";

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
          <Heading style={styles.modalTitle}>Record New Vitals</Heading>
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
              <Subheading style={styles.buttonText}>Cancel</Subheading>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Subheading style={[styles.buttonText, styles.saveButtonText]}>
                Save
              </Subheading>
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
  },
});

export default RecordVitalsModal;
