import React from "react";
import { View, Image, Text } from "react-native";

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => (
  <View className="flex-row items-center justify-center bg-white pt-12 pb-4">
    <Image
      source={require("./assets/Ampara_logo.png")}
      className="w-10 h-10"
      resizeMode="contain"
    />
    {title && <Text className="ml-2 text-xl font-bold">{title}</Text>}
  </View>
);

export default AppHeader;
