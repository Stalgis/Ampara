import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Heading, Subheading } from "../../src/components/ui";

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
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 mb-4 shadow-md"
          onPress={() => navigation.navigate("LogIn")}
        >
          <Subheading className="text-white text-center">Log In</Subheading>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-accent rounded-xl py-4 shadow-md"
          onPress={() => navigation.navigate("SignUp")}
        >
          <Subheading className="text-white text-center">
            Create Account
          </Subheading>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
