import React, { useState, useRef } from "react";
import { View, Pressable, Modal, Alert, Image, Text, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import AddMedicationModal from "./Modals/AddMedicationModal";
import RefillRequestModal from "./Modals/RefillRequestModal";
import { Heading, Subheading, Body } from "../../src/components/ui";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  active: boolean;
}

const Medications = () => {
  const [addMedicationModalVisible, setAddMedicationModalVisible] = useState(false);
  const [refillRequestModalVisible, setRefillRequestModalVisible] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", active: true },
    { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", active: true },
  ]);

  // Cámara
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleOpenCamera = async () => {
    // Solicitar permiso si hace falta
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Camera permission required", "Enable camera access in Settings to take a photo.");
        return;
      }
    }
    setCameraReady(false);
    setCameraOpen(true);
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setCameraOpen(false);
      }
    } catch {
      Alert.alert("Error", "Could not take picture.");
    }
  };

  const handleAddMedication = (medication: Omit<Medication, "id" | "active">) => {
    setMedications(prev => [...prev, { ...medication, id: Date.now().toString(), active: true }]);
  };

  const toggleMedicationActive = (id: string) => {
    setMedications(prev => prev.map(med => (med.id === id ? { ...med, active: !med.active } : med)));
  };

  const handleSelectMedication = (medication: Medication) => {
    console.log("Selected medication for refill:", medication);
    setRefillRequestModalVisible(false);
  };

  // UI auxiliar si el permiso fue denegado
  if (permission && permission.status === "denied") {
    return (
      <View className="p-4">
        <Heading className="text-xl text-text">Current Medications</Heading>
        <Body className="mt-2">Camera access denied. Please enable it in Settings.</Body>
      </View>
    );
  }

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

      {/* Modal de Cámara */}
      <Modal visible={cameraOpen} animationType="slide" onRequestClose={() => setCameraOpen(false)}>
        <View className="flex-1">
          <CameraView
            ref={cameraRef}
            className="flex-1"
            facing="back"
            onCameraReady={() => setCameraReady(true)}
          />

          {/* Overlay: loader hasta que la cámara esté lista */}
          {!cameraReady && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator color="#fff" size="large" />
              <Text className="text-white mt-3">Opening camera…</Text>
            </View>
          )}

          {/* Cerrar */}
          <View className="absolute top-12 left-4">
            <Pressable
              onPress={() => setCameraOpen(false)}
              className="w-10 h-10 rounded-full items-center justify-center bg-black/50"
            >
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Disparador */}
          <View className="absolute bottom-10 w-full items-center">
            <Pressable
              onPress={handleTakePhoto}
              disabled={!cameraReady}
              className={`w-20 h-20 rounded-full items-center justify-center ${
                cameraReady ? "bg-white" : "bg-white/50"
              }`}
              android_ripple={{ color: "#e5e7eb", borderless: true }}
            >
              <View className="w-16 h-16 rounded-full bg-white border-2 border-zinc-300" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <Heading className="text-xl text-text">Current Medications</Heading>

      {photoUri ? (
        <View className="mt-3">
          <Body className="mb-2 text-subtitle">Last photo:</Body>
          <Image source={{ uri: photoUri }} style={{ width: 120, height: 120, borderRadius: 12 }} />
        </View>
      ) : null}

      <View id="container-vitals-cards" className="mt-4 flex gap-4">
        {medications.map(med => (
          <View key={med.id} className="flex items-start justify-between border border-border rounded-lg p-3 mb-3 bg-background">
            <View className="flex-row justify-between w-full items-start">
              <View>
                <Subheading className="font-bold text-xl text-text">{med.name}</Subheading>
                <Body className="text-subtitle text-sm">{med.dosage}, {med.frequency}</Body>
              </View>
              <Pressable onPress={() => toggleMedicationActive(med.id)}>
                <Body
                  className={`border ${
                    med.active
                      ? "border-green-500 bg-green-200 text-green-700"
                      : "border-red-500 bg-red-200 text-red-700"
                  } rounded-full py-1 px-3 text-xs font-bold`}
                >
                  {med.active ? "Active" : "Inactive"}
                </Body>
              </Pressable>
            </View>
            <View className="w-full h-px bg-border my-4" />
            <Body>Next dose: Today, 8:00 PM</Body>
          </View>
        ))}

        <View className="flex-row justify-between gap-2">
          <Pressable className="border border-border rounded flex-1 py-3" onPress={() => setRefillRequestModalVisible(true)}>
            <Subheading className="font-medium mx-auto text-lg">Refill Request</Subheading>
          </Pressable>

          <Pressable className="bg-calm py-3 flex-1 rounded" onPress={handleOpenCamera}>
            <Subheading className="text-white font-medium mx-auto text-lg">Add Medication</Subheading>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Medications;
