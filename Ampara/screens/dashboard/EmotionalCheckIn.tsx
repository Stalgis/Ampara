// screens/dashboard/EmotionalCheckIns.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { apiService } from "../../services/api";

type MoodItem = {
  _id?: string;
  elderId: string;
  source: "AUTO" | "MANUAL";
  mood: string; // libre: "HAPPY" | "NEUTRAL" | "SAD" | etc.
  confidence?: number; // 0..1
  timestamp: string; // ISO
  note?: string; // 🔸 local-only (no se envía si backend no lo soporta)
};

type RouteParams = {
  elderId?: string;
  elderName?: string;
};

const MOOD_CHOICES = [
  { key: "HAPPY", label: "😊 Happy" },
  { key: "CALM", label: "🙂 Calm" },
  { key: "NEUTRAL", label: "😐 Neutral" },
  { key: "SAD", label: "🙁 Sad" },
  { key: "ANXIOUS", label: "😟 Anxious" },
];

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString(undefined, opts);
};

// máscara YYYY-MM-DD
const maskISODate = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};
const validISODate = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
};

const EmotionalCheckIns: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const elderId = route.params?.elderId ?? ""; // debe venir desde navegación
  const elderName = route.params?.elderName;

  const [loading, setLoading] = useState(false);
  const [moods, setMoods] = useState<MoodItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Campos del modal
  const [newMood, setNewMood] = useState<string>("HAPPY");
  const [newNote, setNewNote] = useState("");
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  });
  const [confidence, setConfidence] = useState("1.0"); // como string en input; enviamos parseFloat

  // Carga de moods
  const loadMoods = async () => {
    if (!elderId) return;
    setLoading(true);
    try {
      const response: any = await apiService.get(`/moods/elder/${elderId}`);

      if (
        response &&
        typeof response === "object" &&
        "success" in response &&
        response.success === false
      ) {
        throw new Error(response.message || "Could not load moods.");
      }

      let list: MoodItem[] | undefined;
      if (Array.isArray(response)) {
        list = response;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray(response.data)
      ) {
        list = response.data as MoodItem[];
      } else if (
        response &&
        typeof response === "object" &&
        "moods" in response &&
        Array.isArray((response as any).moods)
      ) {
        list = (response as any).moods as MoodItem[];
      }

      if (!list) {
        throw new Error("Unexpected response format when loading moods.");
      }

      // Orden por fecha desc
      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setMoods(list);
    } catch (e: any) {
      console.error("Failed to load moods", e);
      Alert.alert(
        "Error",
        e?.message ?? "Could not load moods. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoods();
  }, [elderId]);

  // Resumen semanario simple
  const weeklySummary = useMemo(() => {
    if (!moods.length) return "No mood data yet.";
    // cuenta por etiqueta
    const counts = moods
      .slice(0, 14)
      .reduce<Record<string, number>>((acc, m) => {
        acc[m.mood] = (acc[m.mood] || 0) + 1;
        return acc;
      }, {});
    // ganador
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return "No mood data yet.";
    return `Mostly ${top[0].toLowerCase()} in recent days.`;
  }, [moods]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setNewMood("HAPPY");
    setNewNote("");
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    setNewDate(`${y}-${m}-${da}`);
    setConfidence("1.0");
  };

  const saveMood = async () => {
    if (!elderId) {
      Alert.alert("Missing elderId", "This screen requires an elderId param.");
      return;
    }
    if (!validISODate(newDate)) {
      Alert.alert("Invalid date", "Use YYYY-MM-DD.");
      return;
    }
    const conf = Math.max(0, Math.min(1, parseFloat(confidence) || 0));
    const iso = new Date(`${newDate}T12:00:00`).toISOString(); // medio día para evitar TZ edge-cases

    const payload = {
      elderId,
      source: "MANUAL" as const,
      mood: newMood,
      confidence: conf,
      timestamp: iso,
      // note NO existe en tu esquema actual → no lo incluimos en el POST
    };

    try {
      const response: any = await apiService.post<MoodItem | { data?: MoodItem }>(
        "/moods",
        payload
      );

      if (
        response &&
        typeof response === "object" &&
        "success" in response &&
        response.success === false
      ) {
        throw new Error(response.message || "Could not save mood.");
      }

      let created: MoodItem | undefined;
      if (response && typeof response === "object") {
        if ("data" in response && response.data) {
          created = response.data as MoodItem;
        } else if ("mood" in response || "_id" in response) {
          created = response as MoodItem;
        }
      }

      if (!created) {
        throw new Error("Unexpected response format when saving mood.");
      }
      // adjuntar nota solo localmente (para mostrarla)
      created.note = newNote || undefined;

      setMoods((prev) =>
        [created, ...prev].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
      closeModal();
    } catch (e: any) {
      console.error("Failed to save mood", e);
      Alert.alert("Error", e?.message ?? "Could not save mood.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-background dark:bg-background-dark">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-background dark:bg-background-dark p-4">
          <Text className="text-xl font-bold text-text dark:text-text-dark mb-1">
            Emotional Check-ins{elderName ? ` · ${elderName}` : ""}
          </Text>
          <Text className="text-subtitle dark:text-subtitle-dark mb-4">
            Track moods over time and view insights
          </Text>

          {/* Graph placeholder */}
          <View className="h-48 border border-border dark:border-border-dark rounded-lg bg-background dark:bg-background-dark mb-6 items-center justify-center">
            <Text className="text-subtitle dark:text-subtitle-dark">
              [ Mood Graph Here ]
            </Text>
          </View>

          {/* Weekly Summary */}
          <View className="border border-border dark:border-border-dark rounded-lg p-4 mb-6 bg-background dark:bg-background-dark">
            <Text className="font-bold text-lg text-text dark:text-text-dark mb-2">
              Weekly Summary
            </Text>
            <Text className="text-sm text-subtitle dark:text-subtitle-dark">
              {weeklySummary}
            </Text>
          </View>

          {/* Mood Logs */}
          <Text className="font-bold text-lg text-text dark:text-text-dark mb-3">
            Mood Log
          </Text>

          {loading ? (
            <Text className="text-subtitle dark:text-subtitle-dark">
              Loading…
            </Text>
          ) : !moods.length ? (
            <Text className="text-subtitle dark:text-subtitle-dark">
              No mood entries yet.
            </Text>
          ) : (
            <View className="space-y-3">
              {moods.map((m) => (
                <View
                  key={m._id ?? `${m.timestamp}-${m.mood}`}
                  className="border border-border dark:border-border-dark rounded-lg p-3 bg-background dark:bg-background-dark"
                >
                  <Text className="font-bold text-base">
                    {fmtDate(m.timestamp)}
                  </Text>
                  <Text
                    className={
                      m.mood === "HAPPY" || m.mood === "CALM"
                        ? "text-green-600"
                        : m.mood === "NEUTRAL"
                        ? "text-yellow-600"
                        : "text-red-500"
                    }
                  >
                    {MOOD_CHOICES.find((x) => x.key === m.mood)?.label ??
                      m.mood}
                  </Text>
                  {!!m.confidence && (
                    <Text className="text-xs text-subtitle dark:text-subtitle-dark mt-0.5">
                      confidence {Math.round((m.confidence || 0) * 100)}%
                    </Text>
                  )}
                  {!!m.note && (
                    <Text className="text-subtitle dark:text-subtitle-dark text-sm mt-1">
                      {m.note}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Add mood button */}
          <Pressable
            onPress={openModal}
            className="bg-calm py-3 rounded mt-6"
            accessibilityRole="button"
          >
            <Text className="text-white text-center font-medium">Add Mood</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal: Add mood */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "formSheet" : "fullScreen"}
        onRequestClose={closeModal}
      >
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-xl font-bold text-text dark:text-text-dark mb-3">
              New Mood
            </Text>

            {/* Date */}
            <FormInput
              label="Date (YYYY-MM-DD)"
              value={newDate}
              onChangeText={(t) => setNewDate(maskISODate(t))}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={10}
              placeholder="1940-01-01"
              onBlur={() => {
                if (newDate && !validISODate(newDate)) {
                  Alert.alert("Invalid date", "Use YYYY-MM-DD.");
                }
              }}
            />

            {/* Mood choices */}
            <Text className="text-text dark:text-text-dark text-base font-semibold mb-2">
              Mood
            </Text>
            <View className="rounded-2xl overflow-hidden border border-border dark:border-border-dark mb-4">
              {MOOD_CHOICES.map((opt, idx) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setNewMood(opt.key)}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    idx < MOOD_CHOICES.length - 1
                      ? "border-b border-border dark:border-border-dark"
                      : ""
                  }`}
                >
                  <Text className="text-text dark:text-text-dark">
                    {opt.label}
                  </Text>
                  <Text className="text-accent">
                    {newMood === opt.key ? "●" : "○"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Confidence 0..1 */}
            <FormInput
              label="Confidence (0–1)"
              value={confidence}
              onChangeText={(t) =>
                setConfidence(t.replace(/[^\d.]/g, "").slice(0, 4))
              }
              keyboardType="decimal-pad"
              placeholder="1.0"
            />

            {/* Note (local only) */}
            <FormInput
              label="Note (optional)"
              value={newNote}
              onChangeText={setNewNote}
              multiline
              inputMode="text"
              placeholder="Short note about the context"
            />

            <View className="flex-row mt-4">
              <PrimaryButton
                title="Save"
                onPress={saveMood}
                className="flex-1 mr-2"
              />
              <Pressable
                onPress={closeModal}
                className="flex-1 py-3 rounded border border-border dark:border-border-dark items-center"
              >
                <Text className="text-text dark:text-text-dark font-medium">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default EmotionalCheckIns;
