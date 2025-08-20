import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import CallDetailsModal, { CallItem } from "./Modals/CallDetailsModal";
import SendSuggestionModal, {
  SuggestionPayload,
} from "./Modals/SendSuggestionModal";
import { designTokens } from "../../design-tokens";
import { useTheme } from "../../controllers/ThemeContext";

/**
 * -----------------------------  API CONTRACT (commented)  -----------------------------
 * POST /ai-instructions
 * Body:
 * {
 *   elderId: string,
 *   createdBy: string,
 *   message: string,         // you can combine intent/topic/details into a single string
 *   aiResponse?: string
 * }
 * Response: AiInstruction
 * {
 *   _id: string,
 *   elderId: string,
 *   createdBy: string,
 *   message: string,
 *   aiResponse?: string,
 *   createdAt: string,
 *   updatedAt: string
 * }
 *
 * Example:
 * // const res = await fetch(`${API_URL}/ai-instructions`, {
 * //   method: 'POST',
 * //   headers: { 'Content-Type': 'application/json' },
 * //   body: JSON.stringify({
 * //     elderId: 'ELDER_123',
 * //     createdBy: 'USER_456',
 * //     message: `Intent: ${payload.type}\nTopic: ${payload.title}\nDetails: ${payload.notes ?? ''}`
 * //   })
 * // });
 * // if (!res.ok) throw new Error(`HTTP ${res.status}`);
 * // const data = await res.json();
 * ---------------------------------------------------------------------------------------
 */

// Mock submit while backend is not connected
const mockSubmitSuggestion = (
  payload: SuggestionPayload,
  delay = 1000,
  shouldFail = false
) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (shouldFail ? reject(new Error("Network error")) : resolve()),
      delay
    )
  );

// --- OPTIONAL: if you already created filterCalls util, keep using it ---
const parseMDYTime = (input: string): Date | null => {
  const [datePartRaw, timePartRaw] = input.split(",").map((s) => s?.trim());
  if (!datePartRaw) return null;
  const [mm, dd, yyyy] = datePartRaw.split("/").map((n) => parseInt(n, 10));
  if (!(mm >= 1 && mm <= 12) || !(dd >= 1 && dd <= 31) || !yyyy) return null;
  let hours = 0,
    minutes = 0;
  if (timePartRaw) {
    const m = timePartRaw.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
    if (m) {
      hours = parseInt(m[1], 10) % 12;
      minutes = parseInt(m[2], 10);
      if (m[3].toUpperCase() === "PM") hours += 12;
    }
  }
  return new Date(yyyy, mm - 1, dd, hours, minutes);
};

const daysBetween = (a: Date, b: Date): number => {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((A - B) / (1000 * 60 * 60 * 24));
};

const filterCalls = (
  calls: CallItem[],
  callFilter: string,
  now = new Date()
): CallItem[] => {
  const limit =
    callFilter === "Last 7 days"
      ? 7
      : callFilter === "Last 30 days"
      ? 30
      : Infinity;
  return calls.filter((c) => {
    const d = parseMDYTime(c.date);
    if (!d) return false;
    const diff = daysBetween(now, d);
    return diff < limit;
  });
};

const Chat = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallItem | null>(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [callFilter, setCallFilter] = useState("All");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  // Transient banner state for suggestion sending (loading/success/error)
  const [sendState, setSendState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [bannerVisible, setBannerVisible] = useState(false);

  const [suggestionState, setSuggestionState] = useState({
    visible: true,
    sent: false,
  });

  const handleSendSuggestionCard = () => {
    setSuggestionState({ ...suggestionState, sent: true });
    setTimeout(() => {
      setSuggestionState({ visible: false, sent: false });
    }, 2000);
  };

  // Auto-hide the banner a few seconds after success/error/loading
  useEffect(() => {
    if (sendState !== "idle") {
      setBannerVisible(true);
      const t = setTimeout(
        () => {
          setBannerVisible(false);
          // Return to idle after the banner is gone
          if (sendState !== "loading") setSendState("idle");
        },
        sendState === "loading" ? 1200 : 1800
      );
      return () => clearTimeout(t);
    }
  }, [sendState]);

  const calls: CallItem[] = [
    {
      date: "08/08/2025, 9:00AM",
      topic: "Birthday reminder for Mery",
      description:
        "We discussed calling Mery to wish her a happy birthday and planning a short afternoon visit next week.",
    },
    {
      date: "08/15/2025, 11:30AM",
      topic: "Medication follow‑up",
      description:
        "Quick check-in about morning pills. Confirmed dosage schedule and set a reminder for refills.",
    },
    {
      date: "07/20/2025, 3:00PM",
      topic: "Walk to the park",
      description:
        "Talked about a light walk in the nearby park depending on weather; shared safety tips and hydration reminders.",
    },
  ];

  const filteredCalls = useMemo(
    () => filterCalls(calls, callFilter),
    [calls, callFilter]
  );

  const openCall = (call: CallItem) => {
    setSelectedCall(call);
    setModalVisible(true);
  };

  // Handler passed to SendSuggestionModal
  const handleSubmitSuggestion = async (payload: SuggestionPayload) => {
    try {
      setSendState("loading");
      // --- Switch to real POST when backend is ready (see contract at top) ---
      // await submit to `${API_URL}/ai-instructions` with combined message
      // const message = `Intent: ${payload.intent}\nTopic: ${payload.topic}\nDetails: ${payload.details}`;
      // await fetch(...)

      await mockSubmitSuggestion(payload, 1000, /* shouldFail */ false);
      setSendState("success");
      setSendModalVisible(false);
    } catch (e) {
      setSendState("error");
      // keep modal open so user can edit/try again if you prefer:
      // setSendModalVisible(true);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mx-4">
        {/* Ampara suggestions banner (existing) */}
        {suggestionState.visible && (
          <View className="bg-badge border border-highlight rounded-2xl mt-4 p-3 flex flex-row items-center">
            <Image
              source={require("../../assets/Ampara_logo.png")}
              className="w-20 h-20 mr-3"
              resizeMode="contain"
            />
            <View className="flex-1">
              {suggestionState.sent ? (
                <Text className="text-text text-base font-semibold">
                  Suggestion sent!
                </Text>
              ) : (
                <>
                  <Text className="text-text text-base mb-1">
                    Ampara suggestions
                  </Text>
                  <Text className="text-subtitle text-sm mb-2">
                    Today I can mention her friend Mery's birthday, would you
                    like that?
                  </Text>
                  <Pressable
                    onPress={handleSendSuggestionCard}
                    className="bg-highlight rounded-lg px-3 py-1 self-start"
                  >
                    <Text className="text-white text-sm font-medium">
                      Send Suggestion
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}

        {/* NEW: Personalized suggestion box */}
        <View className="border border-border bg-background rounded-2xl p-4 mt-4">
          <Text className="text-text text-base font-semibold mb-1">
            Send personalized suggestion
          </Text>
          <Text className="text-subtitle text-sm mb-3">
            Tell Ampara exactly what you want it to say or remind. Choose the
            type, topic and add details.
          </Text>
          <Pressable
            onPress={() => setSendModalVisible(true)}
            className="rounded-xl py-3 px-4 self-start"
            style={{ backgroundColor: tokens.highlight }}
          >
            <Text className="text-white font-semibold">Send suggestion</Text>
          </Pressable>
        </View>

        {/* Calls header + filter */}
        <View id="call-history" className="mt-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-text text-lg font-bold">Calls history</Text>
            <Pressable
              onPress={() => setShowFilterOptions(!showFilterOptions)}
              className="flex-row items-center"
            >
              <Text className="text-primary font-bold mr-1">{callFilter}</Text>
              <Feather
                name={showFilterOptions ? "chevron-up" : "chevron-down"}
                size={20}
                color={tokens.highlight}
              />
            </Pressable>
          </View>

          {showFilterOptions && (
            <View
              className="absolute right-0 top-8 bg-background border border-border rounded-xl mt-2 w-40"
              style={{ zIndex: 20, elevation: 20 }}
            >
              {["Last 7 days", "Last 30 days", "All"].map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    setCallFilter(opt);
                    setShowFilterOptions(false);
                  }}
                  className="p-3"
                >
                  <Text style={{ color: tokens.text }}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Call cards */}
          <View className="mt-2">
            {filteredCalls.map((call, index) => (
              <Pressable
                key={`${call.date}-${index}`}
                onPress={() => openCall(call)}
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                className="mb-3"
                accessibilityRole="button"
                accessibilityLabel={`Open details for call on ${call.date}`}
              >
                <View
                  className="flex-row items-center justify-between rounded-2xl p-4 bg-background border border-border"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="rounded-2xl mr-3 p-3"
                      style={{ backgroundColor: tokens.highlight }}
                    >
                      <Feather name="phone" size={22} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-base"
                        style={{ color: tokens.text }}
                      >
                        Call
                      </Text>
                      <Text
                        className="text-sm"
                        numberOfLines={1}
                        style={{ color: tokens.subtitle }}
                      >
                        {call.topic}
                      </Text>
                      <Text
                        className="text-xs mt-1"
                        style={{ color: tokens.subtitle }}
                      >
                        {call.date}
                      </Text>
                    </View>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={tokens.subtitle}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Details Modal */}
      <CallDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        call={selectedCall}
        tokens={{
          background: tokens.background,
          text: tokens.text,
          subtitle: tokens.subtitle,
          border: tokens.border,
          highlight: tokens.highlight,
        }}
      />

      {/* Send Suggestion Modal */}
      <SendSuggestionModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        onSubmit={handleSubmitSuggestion}
        tokens={{
          background: tokens.background,
          text: tokens.text,
          subtitle: tokens.subtitle,
          border: tokens.border,
          highlight: tokens.highlight,
        }}
      />

      {/* Transient status banner (bottom-center) */}
      {bannerVisible && (
        <View className="absolute left-0 right-0 bottom-5 px-4">
          <View
            className="self-center rounded-xl px-4 py-2 border"
            style={{
              backgroundColor:
                sendState === "error"
                  ? "#FEE2E2" // red-100
                  : sendState === "loading"
                  ? "#E5E7EB" // gray-200
                  : tokens.highlight,
              borderColor:
                sendState === "error"
                  ? "#FCA5A5" // red-300
                  : sendState === "loading"
                  ? "#D1D5DB" // gray-300
                  : tokens.highlight,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color:
                  sendState === "error"
                    ? "#991B1B" // red-800
                    : sendState === "loading"
                    ? "#111827" // gray-900
                    : "#FFFFFF",
              }}
            >
              {sendState === "loading"
                ? "Sending…"
                : sendState === "success"
                ? "Suggestion sent"
                : "Failed to send — try again"}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Chat;
