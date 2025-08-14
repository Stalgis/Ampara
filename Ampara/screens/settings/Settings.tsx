import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme, ThemePreference } from "../../controllers/ThemeContext";

const options: { label: string; value: ThemePreference }[] = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-4">Theme</Text>
      {options.map(({ label, value }) => (
        <TouchableOpacity
          key={value}
          onPress={() => setTheme(value)}
          className="flex-row items-center py-2"
        >
          <View
            className={`w-5 h-5 mr-3 rounded-full border border-gray-400 ${
              theme === value ? "bg-primary" : ""
            }`}
          />
          <Text className="text-lg">{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Settings;
