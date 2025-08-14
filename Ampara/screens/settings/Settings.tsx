import React from "react";
import { View } from "react-native";
import { Heading } from "../../src/components/ui";

const Settings = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Heading style={{ fontSize: 24 }}>Settings Screen</Heading>
    </View>
  );
};

export default Settings;
