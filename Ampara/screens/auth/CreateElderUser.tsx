// screens/auth/CreateElderUser.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView, // 👈 add
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import apiFetch from "../../services/api";

const toList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export default function CreateElderUser() {
  const nav = useNavigation<any>();

  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [phone, setPhone] = useState("");
  const [emgName, setEmgName] = useState("");
  const [emgPhone, setEmgPhone] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const dobRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emgNameRef = useRef<TextInput>(null);
  const emgPhoneRef = useRef<TextInput>(null);
  const condRef = useRef<TextInput>(null);
  const medsRef = useRef<TextInput>(null);

  const save = async () => {
    if (!name) return Alert.alert("Missing info", "Please provide the name.");
    const payload: any = {
      name,
      dateOfBirth: dob ? new Date(dob).toISOString() : undefined,
      phoneNumbers: phone ? [phone] : [],
      caregivers: [],
      emergencyContacts:
        emgName && emgPhone ? [{ name: emgName, phone: emgPhone }] : [],
      medicalInfo: {
        conditions: toList(conditions),
        medications: toList(medications),
        notes: notes || undefined,
      },
    };

    setLoading(true);
    try {
      const res = await apiFetch("/elder-users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        Alert.alert("Error", msg || "Could not create elder user.");
        return;
      }
      await res.json();
      Alert.alert("Created!", "Elder profile created.", [
        { text: "OK", onPress: () => nav.navigate("LogIn") },
      ]);
    } catch (e: any) {
      Alert.alert("Network error", e?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // inside your component
  const handleDobChange = (raw: string) => {
    // keep only digits and cap at 8 (YYYYMMDD)
    const digits = raw.replace(/\D/g, "").slice(0, 8);

    // build YYYY-MM-DD progressively
    let formatted = digits;
    if (digits.length > 4)
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    if (digits.length > 6)
      formatted =
        digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6);

    setDob(formatted);
  };

  const isValidISODate = (s: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return (
      dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center p-6">
        {/* Card keeps the box look; the ScrollView lives *inside* so content can scroll */}
        <Card className="w-full max-w-md p-0">
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-2xl font-bold mb-4 text-text">
              Create Elder User
            </Text>

            {/* --- Non-avoiding section (top fields) --- */}
            <FormInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => dobRef.current?.focus()}
            />

            <FormInput
              ref={dobRef}
              label="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={handleDobChange} // ← masked
              keyboardType="number-pad" // numeric keyboard
              inputMode="numeric" // (RN 0.71+) extra hint
              maxLength={10} // YYYY-MM-DD is 10 chars
              returnKeyType="next"
              placeholder="1940-01-01"
              onBlur={() => {
                if (dob && !isValidISODate(dob)) {
                  Alert.alert(
                    "Invalid date",
                    "Please enter a valid date in YYYY-MM-DD format."
                  );
                }
              }}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />

            <FormInput
              ref={phoneRef}
              label="Primary Phone (optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => emgNameRef.current?.focus()}
            />

            <FormInput
              ref={emgNameRef}
              label="Emergency Contact Name (optional)"
              value={emgName}
              onChangeText={setEmgName}
              returnKeyType="next"
              onSubmitEditing={() => emgPhoneRef.current?.focus()}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <FormInput
                ref={emgPhoneRef}
                label="Emergency Contact Phone (optional)"
                value={emgPhone}
                onChangeText={setEmgPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => condRef.current?.focus()}
              />

              <FormInput
                ref={condRef}
                label="Conditions (comma separated)"
                value={conditions}
                onChangeText={setConditions}
                returnKeyType="next"
                onSubmitEditing={() => medsRef.current?.focus()}
              />

              <FormInput
                ref={medsRef}
                label="Medications (comma separated)"
                value={medications}
                onChangeText={setMedications}
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
              />

              <FormInput
                label="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                inputMode="text"
                returnKeyType="done"
              />

              <PrimaryButton
                title={loading ? "Saving..." : "Save"}
                onPress={save}
                disabled={loading}
                className="mt-4"
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView>
  );
}
