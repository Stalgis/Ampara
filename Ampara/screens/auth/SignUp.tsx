// screens/log_in/SignUp.tsx
import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Text,
  Platform,
  Keyboard,
  ScrollView, // 👈 add
  KeyboardAvoidingView, // 👈 add
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Body } from "../../src/components/ui";
import apiFetch from "../../services/api";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";

type Role = "FAMILY_MEMBER" | "NURSE";
const ROLE_OPTIONS: { label: "Family" | "Nurse"; value: Role }[] = [
  { label: "Family", value: "FAMILY_MEMBER" },
  { label: "Nurse", value: "NURSE" },
];

const SignUp = () => {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("FAMILY_MEMBER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [elderId, setElderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const elderRef = useRef<TextInput>(null);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please complete all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please enter the same password twice."
      );
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const body: any = { name, email, password, role };
      if (elderId.trim()) body.linkedElderId = elderId.trim();

      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Registration failed");
        return;
      }

      const { access_token, user } = await response.json();
      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: "LogIn" }] });
    } catch (e: any) {
      setError(`Registration failed: ${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center px-6 py-4">
        {/* Card holds a scrollable interior */}
        <Card className="w-full max-w-md p-0">
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="items-center mb-6">
              <Image
                source={require("../../assets/Ampara_logo.png")}
                className="w-24 h-24 mb-2"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-text dark:text-text-dark">
                Sign Up
              </Text>
            </View>

            {error && (
              <Body className="text-red-500 text-center mb-3">{error}</Body>
            )}

            {/* Top fields */}
            <FormInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <FormInput
              ref={emailRef}
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            {/* Role selector (compact) */}
            <Text className="text-text dark:text-text-dark text-base font-semibold mb-2">
              Role
            </Text>
            <View className="rounded-2xl overflow-hidden border border-border dark:border-border-dark mb-4">
              {ROLE_OPTIONS.map((opt, i) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setRole(opt.value)}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    i < ROLE_OPTIONS.length - 1
                      ? "border-b border-border dark:border-border-dark"
                      : ""
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === opt.value }}
                >
                  <Text className="text-text dark:text-text-dark">
                    {opt.label}
                  </Text>
                  {role === opt.value ? (
                    <Ionicons
                      name="radio-button-on"
                      size={22}
                      color="#F59E0B"
                    />
                  ) : (
                    <Ionicons
                      name="radio-button-off"
                      size={22}
                      color="#9CA3AF"
                    />
                  )}
                </Pressable>
              ))}
            </View>

            <FormInput
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  className="p-3"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              }
            />

            {/* ✅ Only these last fields are inside a KAV */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <FormInput
                ref={confirmPasswordRef}
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="next"
                onSubmitEditing={() => elderRef.current?.focus()}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((s) => !s)}
                    className="p-3"
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={24}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                }
              />

              <FormInput
                ref={elderRef}
                label="Link Elder by ID (optional)"
                value={elderId}
                onChangeText={setElderId}
                placeholder="e.g. 6862248a1e4d9e2f661b5c67"
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  handleSignUp();
                }}
              />

              <PrimaryButton
                title={loading ? "Loading..." : "Sign Up"}
                onPress={handleSignUp}
                disabled={loading}
                className="mt-4"
              />
            </KeyboardAvoidingView>

            {/* Footer link */}
            <View className="flex-row justify-center mt-5">
              <Text className="text-subtitle">Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
                <Text className="text-accent font-semibold ml-1">Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
