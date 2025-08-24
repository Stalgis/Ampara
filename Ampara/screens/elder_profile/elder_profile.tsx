import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { apiService } from "../../services/api";

import {
  DashboardInnerStackParamList,
  MainTabParamList,
} from "../../navigation/types";
import AddAllergyModal from "./Modals/AddAllergyModal";
import AddNoteModal from "./Modals/AddNoteModal";
import LogMedModal from "./Modals/LogMedModal";
import Social from "./Social";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
type Role = "FAMILY" | "NURSE";
type RiskStatus = "green" | "amber" | "red";
type MedStatus = "UPCOMING" | "TAKEN" | "MISSED";

interface Elder {
  id: string;
  name: string;
  preferredName?: string;
  dob: string; // ISO
  avatarUrl?: string;
  tags: string[];
}

// Real elder user data from API
interface ElderUserData {
  _id: string;
  name: string;
  dateOfBirth: Date;
  phoneNumbers: Array<{
    label: string;
    number: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phoneNumber: string;
  }>;
  medicalInfo: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  caregivers: string[];
  createdAt: Date;
  updatedAt: Date;
}
interface Medication {
  id: string;
  time: string;
  name: string;
  dosage: string;
  status: MedStatus;
}
interface Allergy {
  id: string;
  allergen: string;
  reaction?: string;
  severity?: "mild" | "moderate" | "severe";
}
interface Vitals {
  bpSys?: number;
  bpDia?: number;
  hr?: number;
  spo2?: number;
  timestamp: string;
}
interface Note {
  id: string;
  author: string;
  role: Role;
  timestamp: string;
  text: string;
}
type ElderProfileRoute = RouteProp<
  DashboardInnerStackParamList,
  "ElderUserProfile"
>;

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const computeAge = (dobISO: string) => {
  const d = new Date(dobISO);
  const diff = Date.now() - d.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
const computeRiskStatus = (meds: Medication[], vitals?: Vitals): RiskStatus => {
  const missed24h = meds.filter((m) => m.status === "MISSED").length;
  if (missed24h >= 3) return "red";
  if (missed24h >= 1) return "amber";
  if (vitals) {
    const hours = (Date.now() - new Date(vitals.timestamp).getTime()) / 36e5;
    if (hours > 72) return "amber";
  }
  return "green";
};
const riskBadge: Record<
  RiskStatus,
  { dot: string; badge: string; text: string }
> = {
  green: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 border-emerald-300",
    text: "text-emerald-800",
  },
  amber: {
    dot: "bg-amber-500",
    badge: "bg-amber-100 border-amber-300",
    text: "text-amber-800",
  },
  red: {
    dot: "bg-rose-500",
    badge: "bg-rose-100 border-rose-300",
    text: "text-rose-800",
  },
};

// ─────────────────────────────────────────────────────────
// Mock data (replace by API later)
// ─────────────────────────────────────────────────────────
const mockMeds: Medication[] = [
  {
    id: "m1",
    time: "08:00",
    name: "Metformin",
    dosage: "500 mg",
    status: "TAKEN",
  },
  {
    id: "m2",
    time: "12:00",
    name: "Lisinopril",
    dosage: "10 mg",
    status: "UPCOMING",
  },
  {
    id: "m3",
    time: "20:00",
    name: "Atorvastatin",
    dosage: "20 mg",
    status: "MISSED",
  },
];
const mockAllergies: Allergy[] = [
  { id: "a1", allergen: "Penicillin", reaction: "Rash", severity: "moderate" },
];
const mockVitals: Vitals = {
  bpSys: 128,
  bpDia: 78,
  hr: 72,
  spo2: 97,
  timestamp: new Date().toISOString(),
};
const mockNotes: Note[] = [
  {
    id: "n1",
    author: "Nurse Kate",
    role: "NURSE",
    timestamp: new Date().toISOString(),
    text: "Walked 15 minutes.",
  },
  {
    id: "n2",
    author: "Nurse Tom",
    role: "NURSE",
    timestamp: new Date().toISOString(),
    text: "Hydration OK.",
  },
];

// ─────────────────────────────────────────────────────────
// Reusable pieces
// ─────────────────────────────────────────────────────────
const SectionCard = ({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <View className="bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark p-4">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-lg font-semibold text-text dark:text-text-dark">
        {title}
      </Text>
      {right}
    </View>
    {children}
  </View>
);

const Chip = ({ label }: { label: string }) => (
  <View className="px-3 py-1 rounded-full border border-border dark:border-border-dark">
    <Text className="text-xs text-text dark:text-text-dark">{label}</Text>
  </View>
);

// ─────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────
export default function ElderUserProfile() {
  const route = useRoute<ElderProfileRoute>();
  const nav = useNavigation<BottomTabNavigationProp<MainTabParamList>>(); // ✅ use parent's navigator
  const { elderName, dob, tags, avatarUrl, elderId } = route.params;

  const [elderData, setElderData] = useState<ElderUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const elder: Elder = { id: elderId || "param", name: elderName, dob, avatarUrl, tags };
  const [role] = useState<Role>("NURSE");
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  // Initialize with empty arrays until we load real data
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [vitals] = useState<Vitals | undefined>(mockVitals);
  const [notes, setNotes] = useState(mockNotes);

  const risk = useMemo(() => computeRiskStatus(meds, vitals), [meds, vitals]);

  // ── Load real elder data
  useEffect(() => {
    const loadElderData = async () => {
      if (!elderId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await apiService.getElderUser(elderId);
        
        let data;
        if (response.data) {
          data = response.data;
        } else if (response.success !== false) {
          data = response;
        }
        
        if (data) {
          setElderData(data);
          
          // Convert medications from API to internal format
          const medicationsFromAPI = data.medicalInfo.medications.map((med: string, index: number) => ({
            id: `med-${index}`,
            time: "08:00", // Default time - would need to be stored properly in real app
            name: med,
            dosage: "As prescribed", // Default dosage - would need to be stored properly
            status: "UPCOMING" as MedStatus,
          }));
          
          // Convert allergies from API to internal format
          const allergiesFromAPI = data.medicalInfo.allergies.map((allergy: string, index: number) => ({
            id: `allergy-${index}`,
            allergen: allergy,
            reaction: undefined,
            severity: undefined,
          }));
          
          setMeds(medicationsFromAPI);
          setAllergies(allergiesFromAPI);
        }
      } catch (error) {
        console.error("Failed to load elder data:", error);
        Alert.alert("Error", "Failed to load elder information");
      } finally {
        setLoading(false);
      }
    };

    loadElderData();
  }, [elderId]);

  // ── Modals state
  const [allergyModal, setAllergyModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [logMedModal, setLogMedModal] = useState(false);

  // ── Actions
  const handleStartCall = () =>
    Alert.alert("Start Call", "Choose: Elder / Family / Nurse / Emergency");

  const handleAddNote = () => setNoteModal(true);
  const handleMarkTaken = (id: string) =>
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "TAKEN" } : m))
    );
  const handleSkip = (id: string) =>
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "MISSED" } : m))
    );

  const handleVitalsAdd = () => {
    // 👉 Jump to Health tab (works because we use screen's nav)
    nav.getParent()?.navigate("Health");
  };

  const saveAllergy = (allergy: {
    allergen: string;
    reaction?: string;
    severity?: "mild" | "moderate" | "severe";
  }) => {
    setAllergies((prev) => [
      ...prev,
      {
        id: String(Math.random()),
        ...allergy,
      },
    ]);
    setAllergyModal(false);
  };

  const saveNote = (note: string) => {
    setNotes((prev) => [
      {
        id: String(Math.random()),
        author: "You",
        role,
        timestamp: new Date().toISOString(),
        text: note,
      },
      ...prev,
    ]);
    setNoteModal(false);
  };

  const saveMed = (med: { name: string; dosage: string; time: string }) => {
    setMeds((prev) => [
      ...prev,
      {
        id: String(Math.random()),
        ...med,
        status: "UPCOMING",
      },
    ]);
    setLogMedModal(false);
  };

  const age = useMemo(() => computeAge(elder.dob), [elder.dob]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="text-subtitle dark:text-subtitle-dark mt-2">Loading elder profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Header — cleaner */}
        <View className="bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark p-4">
          <View className="flex-row items-center">
            {elder.avatarUrl ? (
              <Image
                source={{ uri: elder.avatarUrl }}
                className="w-14 h-14 rounded-full mr-3"
              />
            ) : (
              <View className="w-14 h-14 rounded-full mr-3 bg-amber-100 items-center justify-center">
                <Text className="text-amber-800 font-bold text-lg">
                  {elder.name.charAt(0)}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text dark:text-text-dark">
                {elder.name}
              </Text>
              <Text className="text-subtitle dark:text-subtitle-dark">
                {age} years
              </Text>
              <View className="flex-row flex-wrap mt-2 gap-2">
                {elder.tags.map((t) => (
                  <Chip key={t} label={t} />
                ))}
                <View
                  className={`px-2.5 py-1 rounded-full border ${riskBadge[risk].badge} ml-1`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-2 h-2 rounded-full mr-1 ${riskBadge[risk].dot}`}
                    />
                    <Text
                      className={`text-xs font-medium ${riskBadge[risk].text}`}
                    >
                      {risk.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Actions: one strong + two light */}
          <View className="flex-row mt-4">
            <Pressable
              onPress={handleStartCall}
              className="flex-1 rounded-2xl bg-amber-500 py-3 mr-2 items-center"
            >
              <Text className="text-white font-semibold">Start Call</Text>
            </Pressable>
            <Pressable
              onPress={() => setLogMedModal(true)}
              className="flex-1 rounded-2xl border border-amber-300 py-3 mr-2 items-center"
            >
              <Text className="text-amber-800">Log Med</Text>
            </Pressable>
            <Pressable
              onPress={handleAddNote}
              className="flex-1 rounded-2xl border border-amber-300 py-3 items-center"
            >
              <Text className="text-amber-800">Add Note</Text>
            </Pressable>
          </View>
        </View>

        {/* Crisis row (compact) */}
        <View className="mt-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="alert-decagram"
                size={18}
                color="#92400e"
              />
              <Text className="ml-2 text-amber-900 dark:text-amber-200 font-medium">
                Status
              </Text>
              <View
                className={`ml-2 px-2.5 py-0.5 rounded-full border ${riskBadge[risk].badge}`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-2 h-2 rounded-full mr-1 ${riskBadge[risk].dot}`}
                  />
                  <Text
                    className={`text-xs font-semibold ${riskBadge[risk].text}`}
                  >
                    {risk.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row">
              <Pressable className="px-3 py-2 rounded-2xl border border-amber-300 mr-2">
                <Text className="text-amber-900">Emergency</Text>
              </Pressable>
              <Pressable className="px-3 py-2 rounded-2xl bg-amber-500">
                <Text className="text-white font-semibold">Call 000</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="mt-3 bg-background dark:bg-background-dark rounded-2xl p-1 flex-row">
          {["Care", "Social"].map((t, i) => (
            <Pressable
              key={t}
              onPress={() => setActiveTab(i as 0 | 1)}
              className={`flex-1 p-2 rounded-xl ${
                activeTab === i
                  ? "bg-background dark:bg-background-dark shadow"
                  : ""
              }`}
            >
              <Text
                className={`text-center ${
                  activeTab === i
                    ? "text-text dark:text-text-dark font-semibold"
                    : "text-subtitle dark:text-subtitle-dark"
                }`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content */}
        <View className="mt-3 space-y-4 gap-3">
          {activeTab === 0 ? (
            <>
              {/* Meds */}
              <SectionCard title="Medications Today">
                <View className="space-y-3 gap-1">
                  {meds.map((m) => (
                    <View
                      key={m.id}
                      className="flex-row items-start border border-border rounded p-3"
                    >
                      <View className="w-12">
                        <Text className="text-subtitle dark:text-subtitle-dark font-medium">
                          {m.time}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-text dark:text-text-dark font-semibold">
                          {m.name}{" "}
                          <Text className="text-subtitle dark:text-subtitle-dark">
                            {m.dosage}
                          </Text>
                        </Text>
                        <Text
                          className={`text-xs mt-1 ${
                            m.status === "TAKEN"
                              ? "text-emerald-700"
                              : m.status === "MISSED"
                              ? "text-rose-700"
                              : "text-subtitle dark:text-subtitle-dark"
                          }`}
                        >
                          {m.status === "TAKEN"
                            ? "Taken"
                            : m.status === "MISSED"
                            ? "Missed"
                            : "Upcoming"}
                        </Text>
                      </View>
                      {role === "NURSE" && (
                        <View className="flex-row items-center">
                          {m.status !== "TAKEN" && (
                            <Pressable
                              onPress={() => handleMarkTaken(m.id)}
                              className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 mr-2"
                            >
                              <Text className="text-emerald-800 text-xs font-medium">
                                Mark Taken
                              </Text>
                            </Pressable>
                          )}
                          {m.status === "UPCOMING" && (
                            <Pressable
                              onPress={() => handleSkip(m.id)}
                              className="px-3 py-1 rounded-full border border-border"
                            >
                              <Text className="text-xs">Skip</Text>
                            </Pressable>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </SectionCard>

              {/* Allergies (+ modal) */}
              <SectionCard
                title="Allergies"
                right={
                  role === "NURSE" ? (
                    <Pressable
                      onPress={() => setAllergyModal(true)}
                      className="px-3 py-1 rounded-full border border-border"
                    >
                      <Text className="text-xs font-medium">Add</Text>
                    </Pressable>
                  ) : undefined
                }
              >
                {allergies.length === 0 ? (
                  <Text className="text-subtitle dark:text-subtitle-dark">
                    No allergies recorded.
                  </Text>
                ) : (
                  <View className="space-y-2">
                    {allergies.map((a) => (
                      <View
                        key={a.id}
                        className="flex-row items-center justify-between"
                      >
                        <View>
                          <Text className="font-medium text-text dark:text-text-dark">
                            {a.allergen}
                          </Text>
                          <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                            {a.reaction ?? "—"}{" "}
                            {a.severity ? `• ${a.severity}` : ""}
                          </Text>
                        </View>
                        {role === "NURSE" && (
                          <Pressable
                            onPress={() =>
                              setAllergies((prev) =>
                                prev.filter((x) => x.id !== a.id)
                              )
                            }
                            className="px-3 py-1 rounded-full bg-rose-50 border border-rose-300"
                          >
                            <Text className="text-xs text-rose-700">
                              Remove
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </SectionCard>

              {/* Vitals → Add sends to Health */}
              <SectionCard
                title="Vitals Snapshot"
                right={
                  role === "NURSE" ? (
                    <Pressable
                      onPress={handleVitalsAdd}
                      className="px-3 py-1 rounded-full border border-border"
                    >
                      <Text className="text-xs font-medium">Add</Text>
                    </Pressable>
                  ) : undefined
                }
              >
                {vitals ? (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row space-x-3">
                      <Chip
                        label={`BP ${vitals.bpSys ?? "—"}/${
                          vitals.bpDia ?? "—"
                        }`}
                      />
                      <Chip label={`HR ${vitals.hr ?? "—"}`} />
                      <Chip label={`SpO₂ ${vitals.spo2 ?? "—"}%`} />
                    </View>
                    <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                      {new Date(vitals.timestamp).toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-subtitle dark:text-subtitle-dark">
                    No readings yet.
                  </Text>
                )}
              </SectionCard>

              {/* Phone Numbers */}
              {elderData && elderData.phoneNumbers && elderData.phoneNumbers.length > 0 && (
                <SectionCard title="Phone Numbers">
                  <View className="space-y-2">
                    {elderData.phoneNumbers.map((phone, index) => (
                      <View key={index} className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-medium text-text dark:text-text-dark">
                            {phone.label || `Phone ${index + 1}`}
                          </Text>
                          <Text className="text-text dark:text-text-dark">
                            {phone.number}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => Alert.alert("Call", `Call ${phone.number}?`)}
                          className="px-3 py-1 rounded-full bg-highlight"
                        >
                          <Text className="text-white text-xs font-medium">Call</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </SectionCard>
              )}

              {/* Emergency Contacts */}
              {elderData && elderData.emergencyContacts && elderData.emergencyContacts.length > 0 && (
                <SectionCard title="Emergency Contacts">
                  <View className="space-y-3">
                    {elderData.emergencyContacts.map((contact, index) => (
                      <View key={index} className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="font-medium text-text dark:text-text-dark">
                            {contact.name}
                          </Text>
                          <Text className="text-subtitle dark:text-subtitle-dark text-sm">
                            {contact.relation} • {contact.phoneNumber}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => Alert.alert("Emergency Call", `Call ${contact.name}?`)}
                          className="px-3 py-1 rounded-full bg-red-500"
                        >
                          <Text className="text-white text-xs font-medium">Call</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </SectionCard>
              )}

              {/* Notes (+ modal) */}
              <SectionCard
                title="Notes (Staff)"
                right={
                  role === "NURSE" ? (
                    <Pressable
                      onPress={() => setNoteModal(true)}
                      className="px-3 py-1 rounded-full border border-border"
                    >
                      <Text className="text-xs font-medium">Add</Text>
                    </Pressable>
                  ) : undefined
                }
              >
                {notes.length === 0 ? (
                  <Text className="text-subtitle dark:text-subtitle-dark">
                    No notes yet.
                  </Text>
                ) : (
                  <View className="space-y-3">
                    {notes.slice(0, 3).map((n) => (
                      <View key={n.id}>
                        <Text className="text-text dark:text-text-dark font-medium">
                          {n.author}{" "}
                          <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                            ({n.role}) •{" "}
                            {new Date(n.timestamp).toLocaleString()}
                          </Text>
                        </Text>
                        <Text className="text-text dark:text-text-dark">
                          {n.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </SectionCard>
            </>
          ) : (
            <Social />
          )}
        </View>

        <View className="px-1 py-6">
          <Text className="text-xs text-subtitle dark:text-subtitle-dark text-center">
            Last updated {new Date().toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      <AddAllergyModal
        visible={allergyModal}
        onClose={() => setAllergyModal(false)}
        onSave={saveAllergy}
      />
      <AddNoteModal
        visible={noteModal}
        onClose={() => setNoteModal(false)}
        onSave={saveNote}
      />
      <LogMedModal
        visible={logMedModal}
        onClose={() => setLogMedModal(false)}
        onSave={saveMed}
      />
    </SafeAreaView>
  );
}
