import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Settings Screen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Settings;
