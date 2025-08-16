import React from "react";
import { View, Image, Text } from "react-native";

export default function LogoTitle({ title }: { title?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../../assets/Ampara_logo.png")}
        style={{ width: 40, height: 40, marginRight: 8 }}
        resizeMode="contain"
      />
      {!!title && (
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{title}</Text>
      )}
    </View>
  );
}
