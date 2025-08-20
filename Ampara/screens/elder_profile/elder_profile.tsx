import React, { useMemo, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { DashboardInnerStackParamList } from "../../navigation/types";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type Role = "FAMILY" | "NURSE";

type RiskStatus = "green" | "amber" | "red";

type MedStatus = "UPCOMING" | "TAKEN" | "MISSED";

interface Elder {
  id: string;
  name: string;
  preferredName?: string;
  dob: string; // ISO date
  avatarUrl?: string;
  tags: string[]; // e.g. ["Fall risk", "Diabetes"]
}

interface Medication {
  id: string;
  time: string; // HH:mm 24h
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
  timestamp: string; // ISO
}

interface Note {
  id: string;
  author: string;
  role: Role;
  timestamp: string;
  text: string;
}

interface Contact {
  id: string;
  name: string;
  role: Role | "GP" | "OTHER";
  phone?: string;
  email?: string;
}

type ElderProfileRoute = RouteProp<
  DashboardInnerStackParamList,
  "ElderUserProfile"
>;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const computeAge = (dobISO: string) => {
  const dob = new Date(dobISO);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const computeRiskStatus = (meds: Medication[], vitals?: Vitals): RiskStatus => {
  const missed24h = meds.filter((m) => m.status === "MISSED").length;
  if (missed24h >= 3) return "red";
  if (missed24h >= 1) return "amber";
  // Vitals staleness (72h)
  if (vitals) {
    const hours = (Date.now() - new Date(vitals.timestamp).getTime()) / 36e5;
    if (hours > 72) return "amber";
  }
  return "green";
};

const riskColors: Record<RiskStatus, string> = {
  green: "bg-emerald-100 text-emerald-800 border-emerald-300",
  amber: "bg-amber-100 text-amber-800 border-amber-300",
  red: "bg-rose-100 text-rose-800 border-rose-300",
};

const statusDot: Record<RiskStatus, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-rose-500",
};

const formatTime = (hhmm: string) => hhmm; // keep simple; rely on upstream locale later

// ──────────────────────────────────────────────────────────────────────────────
// Mock data (replace with API/state)
// ──────────────────────────────────────────────────────────────────────────────

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

const mockContacts: Contact[] = [
  { id: "c1", name: "Sarah Johnson", role: "FAMILY", phone: "+61 400 123 456" },
  { id: "c2", name: "Kate (Nurse)", role: "NURSE", phone: "+61 400 987 654" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Reusable UI
// ──────────────────────────────────────────────────────────────────────────────

const PrimaryButton: React.FC<{
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}> = ({ title, icon, onPress, className }) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 active:opacity-80 ${
      className ?? ""
    }`}
  >
    {icon ? <View className="mr-2">{icon}</View> : null}
    <Text className="text-white font-semibold">{title}</Text>
  </Pressable>
);

const OutlineButton: React.FC<{
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}> = ({ title, icon, onPress, className }) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center justify-center rounded-2xl border border-amber-300 px-4 py-3 active:opacity-80 ${
      className ?? ""
    }`}
  >
    {icon ? <View className="mr-2">{icon}</View> : null}
    <Text className="text-amber-800 dark:text-amber-300 font-medium">
      {title}
    </Text>
  </Pressable>
);

const SectionCard: React.FC<{
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, right, children, className }) => (
  <View
    className={`bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark p-4 shadow-sm ${
      className ?? ""
    }`}
  >
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-lg font-semibold text-text dark:text-text-dark">
        {title}
      </Text>
      {right}
    </View>
    {children}
  </View>
);

const Chip: React.FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <View
    className={`px-3 py-1 rounded-full border border-border dark:border-border-dark text-xs ${
      className ?? ""
    }`}
  >
    <Text className="text-xs text-text dark:text-text-dark">
      {label}
    </Text>
  </View>
);

// ──────────────────────────────────────────────────────────────────────────────
// Header + CrisisBar + Tabs
// ──────────────────────────────────────────────────────────────────────────────

const Header: React.FC<{
  elder: Elder;
  risk: RiskStatus;
  onStartCall: () => void;
  onLogMed: () => void;
  onAddNote: () => void;
}> = ({ elder, risk, onStartCall, onLogMed, onAddNote }) => {
  const age = useMemo(() => computeAge(elder.dob), [elder.dob]);

  return (
    <View className="px-4 pb-3">
      <View className="flex-row items-center">
        {elder.avatarUrl ? (
          <Image
            source={{ uri: elder.avatarUrl }}
            className="w-16 h-16 rounded-full mr-3"
          />
        ) : (
          <View className="w-16 h-16 rounded-full mr-3 bg-amber-100 items-center justify-center">
            <Text className="text-amber-800 font-bold text-xl">
              {elder.name.charAt(0)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-xl font-semibold text-text dark:text-text-dark">
            {elder.name}
            {elder.preferredName ? (
              <Text className="text-subtitle dark:text-subtitle-dark">
                {" "}
                · “{elder.preferredName}”
              </Text>
            ) : null}
          </Text>
          <Text className="text-subtitle dark:text-subtitle-dark">
            {age} years
          </Text>
          <View className="flex-row mt-2 space-x-2 gap-1">
            {elder.tags.map((t) => (
              <Chip key={t} label={t} className="border-amber-300" />
            ))}
            <View
              className={`px-2.5 py-1 rounded-full border ${riskColors[risk]}`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-2 h-2 rounded-full mr-1 ${statusDot[risk]}`}
                />
                <Text className="text-xs font-medium">
                  {risk.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row mt-4 space-x-3 gap-2">
        <PrimaryButton
          title="Start Call"
          onPress={onStartCall}
          icon={<Ionicons name="call" size={18} color="#fff" />}
          className="flex-1"
        />
        <OutlineButton
          title="Log Med"
          onPress={onLogMed}
          icon={
            <MaterialCommunityIcons name="pill" size={18} color="#92400e" />
          }
          className="flex-1"
        />
        <OutlineButton
          title="Add Note"
          onPress={onAddNote}
          icon={
            <Ionicons name="add-circle-outline" size={18} color="#92400e" />
          }
          className="flex-1"
        />
      </View>
    </View>
  );
};

const CrisisBar: React.FC<{
  risk: RiskStatus;
  onCall000: () => void;
  onCallEmergency: () => void;
}> = ({ risk, onCall000, onCallEmergency }) => (
  <View className="px-4 mb-3">
    <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-3">
      <View className="flex-row items-center justify-between gap-1">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="alert-decagram"
            size={18}
            color="#92400e"
          />
          <Text className="ml-2 text-amber-900 dark:text-amber-200 font-medium">
            Status:
          </Text>
          <View
            className={`ml-2 px-2.5 py-0.5 rounded-full border ${riskColors[risk]}`}
          >
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-1 ${statusDot[risk]}`}
              />
              <Text className="text-xs font-semibold">
                {risk.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row space-x-2 gap-1">
          <OutlineButton
            title="Emergency"
            onPress={onCallEmergency}
            icon={<Ionicons name="person" size={14} color="#92400e" />}
          />
          <PrimaryButton
            title="Call 000"
            onPress={onCall000}
            icon={<Ionicons name="warning" size={14} color="#fff" />}
          />
        </View>
      </View>
    </View>
  </View>
);

const SegmentedTabs: React.FC<{
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
}> = ({ tabs, active, onChange }) => (
  <View className="px-4">
    <View className="bg-background dark:bg-background-dark rounded-2xl p-1 flex-row">
      {tabs.map((t, i) => (
        <Pressable
          key={t}
          onPress={() => onChange(i)}
          className={`flex-1 p-2 rounded-xl ${
            i === active ? "bg-background dark:bg-background-dark shadow" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              i === active
                ? "text-text dark:text-text-dark"
                : "text-subtitle dark:text-subtitle-dark"
            }`}
          >
            {t}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);

// ──────────────────────────────────────────────────────────────────────────────
// Care Tab Components
// ──────────────────────────────────────────────────────────────────────────────

const MedsTodayCard: React.FC<{
  meds: Medication[];
  role: Role;
  isOffline?: boolean;
  onMarkTaken: (id: string) => void;
  onSkip: (id: string) => void;
}> = ({ meds, role, isOffline, onMarkTaken, onSkip }) => (
  <SectionCard title="Medications Today">
    <View className="space-y-3 gap-2">
      {meds.map((m) => (
        <View
          key={m.id}
          className="flex-row items-start border border-border rounded gap-4 p-2"
        >
          <View className="w-12">
            <Text className="text-subtitle dark:text-subtitle-dark font-medium">
              {formatTime(m.time)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-text dark:text-text-dark font-semibold">
              {m.name} <Text className="text-subtitle dark:text-subtitle-dark">{m.dosage}</Text>
            </Text>
            <View className="mt-1">
              {m.status === "TAKEN" && (
                <Text className="text-emerald-700 dark:text-emerald-400 text-xs">
                  Taken
                </Text>
              )}
              {m.status === "MISSED" && (
                <Text className="text-rose-700 dark:text-rose-400 text-xs">
                  Missed
                </Text>
              )}
              {m.status === "UPCOMING" && (
                <Text className="text-subtitle dark:text-subtitle-dark text-xs">Upcoming</Text>
              )}
            </View>
          </View>
          {role === "NURSE" && (
            <View className="flex-row items-center space-x-2">
              {isOffline ? (
                <MaterialCommunityIcons
                  name="cloud-off-outline"
                  size={18}
                  color="#737373"
                />
              ) : null}
              {m.status !== "TAKEN" && (
                <Pressable
                  onPress={() => onMarkTaken(m.id)}
                  className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300"
                >
                  <Text className="text-emerald-800 text-xs font-medium">
                    Mark Taken
                  </Text>
                </Pressable>
              )}
              {m.status === "UPCOMING" && (
                <Pressable
                  onPress={() => onSkip(m.id)}
                  className="px-3 py-1 rounded-full bg-neutral-100 border border-border dark:border-border-dark"
                >
                  <Text className="text-text dark:text-text-dark text-xs font-medium">
                    Skip
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  </SectionCard>
);

const AllergiesCard: React.FC<{
  allergies: Allergy[];
  canEdit: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ allergies, canEdit, onAdd, onEdit, onRemove }) => (
  <SectionCard
    title="Allergies"
    right={
      canEdit ? (
        <Pressable
          onPress={onAdd}
          className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
        >
          <Text className="text-xs font-medium text-text dark:text-text-dark">Add</Text>
        </Pressable>
      ) : undefined
    }
  >
    {allergies.length === 0 ? (
      <Text className="text-subtitle dark:text-subtitle-dark">No allergies recorded.</Text>
    ) : (
      <View className="space-y-2">
        {allergies.map((a) => (
          <View key={a.id} className="flex-row items-center justify-between">
            <View>
              <Text className="font-medium text-text dark:text-text-dark">
                {a.allergen}
              </Text>
              <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                {a.reaction ?? "—"} {a.severity ? `• ${a.severity}` : ""}
              </Text>
            </View>
            {canEdit ? (
              <View className="flex-row space-x-2 gap-2">
                <Pressable
                  onPress={() => onEdit(a.id)}
                  className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
                >
                  <Text className="text-xs">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => onRemove(a.id)}
                  className="px-3 py-1 rounded-full border border-rose-300 bg-rose-50"
                >
                  <Text className="text-xs text-rose-700">Remove</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    )}
  </SectionCard>
);

const VitalsSnapshotCard: React.FC<{
  vitals?: Vitals;
  canAdd: boolean;
  onAdd: () => void;
}> = ({ vitals, canAdd, onAdd }) => (
  <SectionCard
    title="Vitals Snapshot"
    right={
      canAdd ? (
        <Pressable
          onPress={onAdd}
          className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
        >
          <Text className="text-xs font-medium text-text dark:text-text-dark">Add</Text>
        </Pressable>
      ) : undefined
    }
  >
    {vitals ? (
      <View className="flex-row items-center justify-between">
        <View className="flex-row space-x-4">
          <Chip label={`BP ${vitals.bpSys ?? "—"}/${vitals.bpDia ?? "—"}`} />
          <Chip label={`HR ${vitals.hr ?? "—"}`} />
          <Chip label={`SpO₂ ${vitals.spo2 ?? "—"}%`} />
        </View>
        <Text className="text-xs text-subtitle dark:text-subtitle-dark">
          {new Date(vitals.timestamp).toLocaleString()}
        </Text>
      </View>
    ) : (
      <Text className="text-subtitle dark:text-subtitle-dark">No readings yet.</Text>
    )}
  </SectionCard>
);

const StaffNotesCard: React.FC<{
  notes: Note[];
  canAdd: boolean;
  onAdd: () => void;
}> = ({ notes, canAdd, onAdd }) => (
  <SectionCard
    title="Notes (Staff)"
    right={
      canAdd ? (
        <Pressable
          onPress={onAdd}
          className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
        >
          <Text className="text-xs font-medium text-text dark:text-text-dark">Add</Text>
        </Pressable>
      ) : undefined
    }
  >
    {notes.length === 0 ? (
      <Text className="text-subtitle dark:text-subtitle-dark">No notes yet.</Text>
    ) : (
      <View className="space-y-3">
        {notes.slice(0, 3).map((n) => (
          <View key={n.id}>
            <Text className="text-text dark:text-text-dark font-medium">
              {n.author}{" "}
              <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                ({n.role}) • {new Date(n.timestamp).toLocaleString()}
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
);

// ──────────────────────────────────────────────────────────────────────────────
// Social Tab Components
// ──────────────────────────────────────────────────────────────────────────────

const ProfileBasicsCard: React.FC<{
  elder: Elder;
  canEdit: boolean;
  onEdit: () => void;
}> = ({ elder, canEdit, onEdit }) => (
  <SectionCard
    title="Profile Basics"
    right={
      canEdit ? (
        <Pressable
          onPress={onEdit}
          className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
        >
          <Text className="text-xs font-medium text-text dark:text-text-dark">Edit</Text>
        </Pressable>
      ) : undefined
    }
  >
    <View className="space-y-2">
      <Text className="text-text dark:text-text-dark">
        Preferred name:{" "}
        <Text className="font-medium">{elder.preferredName ?? "—"}</Text>
      </Text>
      <Text className="text-text dark:text-text-dark">
        Birthday:{" "}
        <Text className="font-medium">
          {new Date(elder.dob).toLocaleDateString()}
        </Text>
      </Text>
      <View className="flex-row flex-wrap gap-2 mt-1">
        {elder.tags.map((t) => (
          <Chip key={t} label={t} className="border-amber-300" />
        ))}
      </View>
    </View>
  </SectionCard>
);

const ContactsCard: React.FC<{
  contacts: Contact[];
  canEdit: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onCall: (id: string) => void;
}> = ({ contacts, canEdit, onAdd, onEdit, onRemove, onCall }) => (
  <SectionCard
    title="Contacts"
    right={
      canEdit ? (
        <Pressable
          onPress={onAdd}
          className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
        >
          <Text className="text-xs font-medium text-text dark:text-text-dark">Add</Text>
        </Pressable>
      ) : undefined
    }
  >
    {contacts.length === 0 ? (
      <Text className="text-subtitle dark:text-subtitle-dark">
        Add family or staff so they can be notified.
      </Text>
    ) : (
      <View className="space-y-3">
        {contacts.map((c) => (
          <View key={c.id} className="flex-row items-center justify-between">
            <View>
              <Text className="text-text dark:text-text-dark font-medium">
                {c.name}{" "}
                <Text className="text-xs text-subtitle dark:text-subtitle-dark">({c.role})</Text>
              </Text>
              <Text className="text-xs text-subtitle dark:text-subtitle-dark">
                {c.phone ?? c.email ?? "—"}
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <Pressable
                onPress={() => onCall(c.id)}
                className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300"
              >
                <Text className="text-xs text-amber-900 font-medium">Call</Text>
              </Pressable>
              {canEdit ? (
                <>
                  <Pressable
                    onPress={() => onEdit(c.id)}
                    className="px-3 py-1 rounded-full border border-border dark:border-border-dark"
                  >
                    <Text className="text-xs">Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onRemove(c.id)}
                    className="px-3 py-1 rounded-full bg-rose-50 border border-rose-300"
                  >
                    <Text className="text-xs text-rose-700">Remove</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    )}
  </SectionCard>
);

const ReassuranceCard: React.FC<{
  lastCallAt?: string;
  lastSeenAt?: string;
}> = ({ lastCallAt, lastSeenAt }) => (
  <SectionCard title="Recent Activity">
    <View className="space-y-1">
      <Text className="text-text dark:text-text-dark">
        Last call:{" "}
        <Text className="text-subtitle dark:text-subtitle-dark">
          {lastCallAt ? new Date(lastCallAt).toLocaleString() : "—"}
        </Text>
      </Text>
      <Text className="text-text dark:text-text-dark">
        Last seen by caregiver:{" "}
        <Text className="text-subtitle dark:text-subtitle-dark">
          {lastSeenAt ? new Date(lastSeenAt).toLocaleString() : "—"}
        </Text>
      </Text>
    </View>
  </SectionCard>
);

// ──────────────────────────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────────────────────────

const AuditRow: React.FC<{ updatedBy?: string; updatedAt?: string }> = ({
  updatedBy,
  updatedAt,
}) => (
  <View className="px-4 py-6">
    <Text className="text-xs text-subtitle dark:text-subtitle-dark text-center">
      Last updated {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}{" "}
      {updatedBy ? `by ${updatedBy}` : ""}
    </Text>
  </View>
);

// ──────────────────────────────────────────────────────────────────────────────
// Offline banner
// ──────────────────────────────────────────────────────────────────────────────

const OfflineBanner: React.FC<{ syncedAt?: string }> = ({ syncedAt }) => (
  <View className="px-4">
    <View className="bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-2xl p-3 mb-3 flex-row items-center">
      <Ionicons name="cloud-offline" size={16} color="#525252" />
      <Text className="ml-2 text-text dark:text-text-dark text-sm">
        Offline — showing last synced.{" "}
        {syncedAt ? `Synced: ${new Date(syncedAt).toLocaleTimeString()}` : ""}
      </Text>
    </View>
  </View>
);

// ──────────────────────────────────────────────────────────────────────────────
// Screen
// ──────────────────────────────────────────────────────────────────────────────

export default function ElderUserProfile() {
  const route = useRoute<ElderProfileRoute>();
  const { elderName, dob, tags, avatarUrl } = route.params;

  // Build your local `elder` object from params (no mock needed)
  const elder: Elder = {
    id: "param",
    name: elderName,
    dob,
    avatarUrl,
    tags,
  };

  // In real app, derive from auth/route
  const [role] = useState<Role>("NURSE"); // 'FAMILY' | 'NURSE'
  const [isOffline] = useState<boolean>(false);

  // const [elder, setElder] = useState<Elder>(mockElder);
  const [meds, setMeds] = useState<Medication[]>(mockMeds);
  const [allergies, setAllergies] = useState<Allergy[]>(mockAllergies);
  const [vitals, setVitals] = useState<Vitals | undefined>(mockVitals);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);

  const [activeTab, setActiveTab] = useState<number>(0); // 0=Care, 1=Social

  const risk = useMemo(() => computeRiskStatus(meds, vitals), [meds, vitals]);

  // Actions (wire to API later)
  const handleStartCall = () =>
    Alert.alert("Start Call", "Choose: Elder / Family / Nurse / Emergency");
  const handleLogMed = () =>
    Alert.alert("Log Medication", "Open quick log modal");
  const handleAddNote = () => Alert.alert("Add Note", "Open add note modal");

  const handleCall000 = () => Alert.alert("Calling 000…");
  const handleEmergency = () =>
    Alert.alert("Emergency Contact", "Calling primary contact…");

  const handleMarkTaken = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "TAKEN" } : m))
    );
  };

  const handleSkip = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "MISSED" } : m))
    );
  };

  const handleAllergyAdd = () => Alert.alert("Add Allergy");
  const handleAllergyEdit = (id: string) => Alert.alert("Edit Allergy", id);
  const handleAllergyRemove = (id: string) =>
    setAllergies((prev) => prev.filter((a) => a.id !== id));

  const handleVitalsAdd = () => Alert.alert("Add Vitals");

  const handleProfileEdit = () => Alert.alert("Edit Profile Basics");

  const handleContactAdd = () => Alert.alert("Add Contact");
  const handleContactEdit = (id: string) => Alert.alert("Edit Contact", id);
  const handleContactRemove = (id: string) =>
    setContacts((prev) => prev.filter((c) => c.id !== id));
  const handleContactCall = (id: string) =>
    Alert.alert("Calling", contacts.find((c) => c.id === id)?.name ?? "");

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark ">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        className="mt-4"
      >
        {isOffline && <OfflineBanner syncedAt={new Date().toISOString()} />}

        <Header
          elder={elder}
          risk={risk}
          onStartCall={handleStartCall}
          onLogMed={handleLogMed}
          onAddNote={handleAddNote}
        />

        <CrisisBar
          risk={risk}
          onCall000={handleCall000}
          onCallEmergency={handleEmergency}
        />

        <SegmentedTabs
          tabs={["Care", "Social"]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <View className="px-4 mt-3 space-y-4 gap-2">
          {activeTab === 0 ? (
            <>
              <MedsTodayCard
                meds={meds}
                role={role}
                isOffline={isOffline}
                onMarkTaken={handleMarkTaken}
                onSkip={handleSkip}
              />
              <AllergiesCard
                allergies={allergies}
                canEdit={role === "NURSE"}
                onAdd={handleAllergyAdd}
                onEdit={handleAllergyEdit}
                onRemove={handleAllergyRemove}
              />
              <VitalsSnapshotCard
                vitals={vitals}
                canAdd={role === "NURSE"}
                onAdd={handleVitalsAdd}
              />
              <StaffNotesCard
                notes={notes}
                canAdd={role === "NURSE"}
                onAdd={handleAddNote}
              />
            </>
          ) : (
            <>
              <ProfileBasicsCard
                elder={elder}
                canEdit={role === "FAMILY"}
                onEdit={handleProfileEdit}
              />
              <ContactsCard
                contacts={contacts}
                canEdit={role === "FAMILY"}
                onAdd={handleContactAdd}
                onEdit={handleContactEdit}
                onRemove={handleContactRemove}
                onCall={handleContactCall}
              />
              <ReassuranceCard
                lastCallAt={new Date().toISOString()}
                lastSeenAt={new Date().toISOString()}
              />
            </>
          )}
        </View>

        <AuditRow
          updatedBy={notes[0]?.author}
          updatedAt={notes[0]?.timestamp}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
