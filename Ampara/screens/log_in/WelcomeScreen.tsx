import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import SecondaryButton from "../../src/components/ui/SecondaryButton";
import { Heading } from "../../src/components/ui";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="items-center mb-12">
        <Image
          source={require("../../assets/Ampara_logo.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
        <Heading>AMPARA</Heading>
      </View>

      <View className="w-full max-w-sm">
        <PrimaryButton
          title="Log In"
          onPress={() => navigation.navigate("LogIn")}
          className="mb-4 shadow-md"
        />

        <SecondaryButton
          title="Create Account"
          onPress={() => navigation.navigate("SignUp")}
          className="shadow-md"
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
