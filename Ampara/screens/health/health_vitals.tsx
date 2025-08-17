import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { designTokens } from "../../design-tokens";
import RecordVitalsModal, { VitalsPatch } from "./Modals/RecordVitalsModal";

const Vitals: React.FC = () => {
  const scheme = useColorScheme() ?? "light";
  const tokens = designTokens[scheme];

  const [heartRateTime, setHeartRateTime] = useState("Today, 8:00 AM");
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressureTime, setBloodPressureTime] = useState("Today, 8:00 AM");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [temperatureTime, setTemperatureTime] = useState("Today, 8:00 AM");
  const [temperature, setTemperature] = useState(98.6);
  const [bloodGlucoseTime, setBloodGlucoseTime] = useState("Today, 8:00 AM");
  const [bloodGlucose, setBloodGlucose] = useState(90);

  const [modalVisible, setModalVisible] = useState(false);

  const getDateTimeString = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${dateString}, ${timeString}`;
  };

  const onSaveVitals = (patch: VitalsPatch) => {
    const ts = getDateTimeString();
    if (patch.heartRate != null) {
      setHeartRate(patch.heartRate);
      setHeartRateTime(ts);
    }
    if (patch.bloodPressure) {
      setBloodPressure(patch.bloodPressure);
      setBloodPressureTime(ts);
    }
    if (patch.temperature != null) {
      setTemperature(patch.temperature);
      setTemperatureTime(ts);
    }
    if (patch.bloodGlucose != null) {
      setBloodGlucose(patch.bloodGlucose);
      setBloodGlucoseTime(ts);
    }
  };

  const Card = ({
    icon,
    title,
    subtitle,
    value,
    valueSuffix,
    iconBg,
    iconColor,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    value: string | number;
    valueSuffix?: string;
    iconBg: string;
    iconColor: string;
  }) => (
    <View
      className="flex-row items-center justify-between rounded-2xl p-4 mb-3 bg-background border"
      style={{
        borderColor: tokens.border,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="rounded-2xl mr-3 p-3"
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text
            className="font-semibold text-base"
            style={{ color: tokens.text }}
          >
            {title}
          </Text>
          <Text
            className="text-sm"
            style={{ color: tokens.subtitle }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <View>
        <Text className="font-semibold text-lg" style={{ color: tokens.text }}>
          {value} {valueSuffix ?? ""}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-background h-fit">
      <View className="m-4">
        <Text className="text-xl font-bold" style={{ color: tokens.text }}>
          Recent Vitals
        </Text>

        <View className="mt-4">
          <Card
            icon="heart-outline"
            title="Heart Rate"
            subtitle={`Last updated: ${heartRateTime}`}
            value={heartRate}
            valueSuffix="bpm"
            iconBg="#fee2e2"
            iconColor="#ef4444"
          />
          <Card
            icon="analytics-outline"
            title="Blood Pressure"
            subtitle={`Last updated: ${bloodPressureTime}`}
            value={bloodPressure}
            valueSuffix="mmHg"
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
          <Card
            icon="thermometer-outline"
            title="Temperature"
            subtitle={`Last updated: ${temperatureTime}`}
            value={temperature}
            valueSuffix="°F"
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
          <Card
            icon="water-outline"
            title="Blood Glucose"
            subtitle={`Last updated: ${bloodGlucoseTime}`}
            value={bloodGlucose}
            valueSuffix="mg/dL"
            iconBg="#ede9fe"
            iconColor="#7c3aed"
          />
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="rounded-xl py-3 px-4 self-start mt-3"
          style={{ backgroundColor: tokens.highlight }}
        >
          <Text className="text-white font-semibold">Record New Vitals</Text>
        </Pressable>
      </View>

      <RecordVitalsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(patch) => {
          onSaveVitals(patch);
          setModalVisible(false);
        }}
        tokens={tokens}
      />
    </SafeAreaView>
  );
};

export default Vitals;
