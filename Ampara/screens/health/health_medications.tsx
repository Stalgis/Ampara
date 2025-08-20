import React, { useState, useRef } from "react";
import {
  View,
  Pressable,
  Modal,
  Alert,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import AddMedicationModal from "./Modals/AddMedicationModal";
import RefillRequestModal from "./Modals/RefillRequestModal";
import { Heading, Subheading, Body } from "../../src/components/ui";
import { designTokens } from "../../design-tokens"; // ✅ add this
import { useTheme } from "../../controllers/ThemeContext";
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  active: boolean;
}

const Medications = () => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];
  const [addMedicationModalVisible, setAddMedicationModalVisible] =
    useState(false);
  const [refillRequestModalVisible, setRefillRequestModalVisible] =
    useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      active: true,
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      active: true,
    },
  ]);

  // Cámara
  const [facing, setFacing] = useState<CameraType>("back");
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
        Alert.alert(
          "Camera permission required",
          "Enable camera access in Settings to take a photo."
        );
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

  const handleAddMedication = (
    medication: Omit<Medication, "id" | "active">
  ) => {
    setMedications((prev) => [
      ...prev,
      { ...medication, id: Date.now().toString(), active: true },
    ]);
  };

  const toggleMedicationActive = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, active: !med.active } : med))
    );
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
        <Body className="mt-2">
          Camera access denied. Please enable it in Settings.
        </Body>
      </View>
    );
  }

  return (
    <View className="p-4 bg-background">
      <AddMedicationModal
        visible={addMedicationModalVisible}
        onClose={() => setAddMedicationModalVisible(false)}
        onAddMedication={handleAddMedication}
        tokens={tokens} // ✅ pass tokens
      />
      <RefillRequestModal
        visible={refillRequestModalVisible}
        onClose={() => setRefillRequestModalVisible(false)}
        medications={medications}
        onSelectMedication={handleSelectMedication}
        tokens={tokens} // ✅ pass tokens
      />

      {/* Camera modal (simplified & robust) */}
      <Modal
        visible={cameraOpen}
        animationType="slide"
        onRequestClose={() => setCameraOpen(false)}
        presentationStyle="fullScreen" // ✅ iOS: true full-screen
        hardwareAccelerated // ✅ Android: better composition
        statusBarTranslucent // ✅ Android: avoid status bar overlap artifacts
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          {/* Permission gate (optional if you gate earlier) */}
          {!permission?.granted ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
              }}
            >
              <Text
                style={{ color: "#fff", marginBottom: 8, textAlign: "center" }}
              >
                We need your permission to show the camera
              </Text>
              <Pressable
                onPress={requestPermission}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#2563eb",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Grant permission
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }} // ✅ direct flex on the camera
                facing="back"
                onCameraReady={() => setCameraReady(true)}
              >
                {/* Top bar */}
                <View
                  style={{
                    position: "absolute",
                    top: 48,
                    left: 16,
                    right: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={() => setCameraOpen(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Close camera"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={22} color="#fff" />
                  </Pressable>
                  {/* Flip camera (optional) */}
                  <Pressable
                    onPress={() => {
                      // quick toggle example (no extra state if you don't need it):
                      setCameraOpen(false);
                      setAddMedicationModalVisible(true);
                    }}
                    // style={{
                    //   width: 40,
                    //   height: 40,
                    //   borderRadius: 20,
                    //   backgroundColor: "rgba(255, 255, 255, 0.5)",
                    //   alignItems: "center",
                    //   justifyContent: "center",
                    // }}
                    className="bg-highlight z-50 rounded rounded-[50] px-2"
                  >
                    <Text className="text-white m-auto">
                      Add medication manually
                    </Text>
                  </Pressable>
                </View>

                {/* Shutter */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 36,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={handleTakePhoto}
                    disabled={!cameraReady}
                    accessibilityRole="button"
                    accessibilityLabel="Capture photo"
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 38,
                      backgroundColor: cameraReady
                        ? "#fff"
                        : "rgba(255,255,255,0.5)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: "#fff",
                        borderWidth: 2,
                        borderColor: "#d1d5db",
                      }}
                    />
                  </Pressable>
                </View>
              </CameraView>

              {/* Loader layer while camera gets ready */}
              {!cameraReady && (
                <View
                  pointerEvents="none" // ✅ don’t block camera surface
                  style={{
                    position: "absolute",
                    inset: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator color="#fff" size="large" />
                  <Text style={{ color: "#fff", marginTop: 10 }}>
                    Opening camera…
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>

      <Heading className="text-xl" style={{ color: tokens.text }}>
        Current Medications
      </Heading>

      {photoUri ? (
        <View className="mt-3">
          <Body className="mb-2" style={{ color: tokens.subtitle }}>
            Last photo:
          </Body>
          <Image
            source={{ uri: photoUri }}
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />
        </View>
      ) : null}

      <View className="mt-4">
        {medications.map((med) => (
          <View
            key={med.id}
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
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-3">
                <Subheading
                  className="text-xl font-semibold"
                  style={{ color: tokens.text }}
                >
                  {med.name}
                </Subheading>
                <Body
                  className="text-sm mt-0.5"
                  style={{ color: tokens.subtitle }}
                >
                  {med.dosage}, {med.frequency}
                </Body>
              </View>
              <Pressable onPress={() => toggleMedicationActive(med.id)}>
                <Text
                  className="text-xs font-bold rounded-full py-1 px-3"
                  style={{
                    borderWidth: 1,
                    borderColor: med.active ? "#22c55e" : "#ef4444",
                    backgroundColor: med.active ? "#dcfce7" : "#fee2e2",
                    color: med.active ? "#15803d" : "#b91c1c",
                  }}
                >
                  {med.active ? "Active" : "Inactive"}
                </Text>
              </Pressable>
            </View>

            <View
              className="w-full h-px my-4"
              style={{ backgroundColor: tokens.border }}
            />
            <Body style={{ color: tokens.text }}>
              Next dose: Today, 8:00 PM
            </Body>
          </View>
        ))}

        <View className="flex-row justify-between gap-2 mt-2">
          <Pressable
            className="rounded-xl flex-1 py-3 border"
            style={{ borderColor: tokens.border }}
            onPress={() => setRefillRequestModalVisible(true)}
          >
            <Subheading
              className="font-medium mx-auto text-lg"
              style={{ color: tokens.text }}
            >
              Refill Request
            </Subheading>
          </Pressable>

          <Pressable
            className="rounded-xl flex-1 py-3"
            style={{ backgroundColor: tokens.highlight }}
            onPress={() => handleOpenCamera()}
          >
            <Subheading className="text-white font-medium mx-auto text-lg">
              Add Medication
            </Subheading>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Medications;
