import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  MainTabParamList,
  DashboardInnerStackParamList,
} from "../../navigation/types";
import { designTokens } from "../../design-tokens";
import { View, Text, SafeAreaView, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useTheme } from "../../controllers/ThemeContext";
import { useAuth } from "../../controllers/AuthContext";
import { apiService } from "../../services/api";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import colors from "tailwindcss/colors";

interface ElderUser {
  _id: string;
  name: string;
  dateOfBirth: Date;
  phoneNumbers: Array<{
    label: string;
    number: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phoneNumber: string;
  }>;
  medicalInfo: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  caregivers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Dashboard = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardInnerStackParamList, "DashboardHome">
    >();
  const { user } = useAuth();
  const [elderUsers, setElderUsers] = useState<ElderUser[]>([]);
  const [selectedElder, setSelectedElder] = useState<ElderUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMedicationDone, setIsMedicationDone] = useState(false);
  const [isAppointmentDone, setIsAppointmentDone] = useState(false);

  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  useEffect(() => {
    loadElderUsers();
  }, []);

  // Refresh elder users when screen comes into focus (e.g., after creating new elder)
  useFocusEffect(
    React.useCallback(() => {
      loadElderUsers();
    }, [])
  );

  const loadElderUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getElderUsers();
      
      // Handle different response formats
      let data;
      if (Array.isArray(response)) {
        data = response; // Direct array response
      } else if (response.data) {
        data = response.data; // Wrapped in data property
      } else if (response.success !== false) {
        data = response; // Response is the data itself
      } else {
        throw new Error(response.message || "Failed to load elder users");
      }

      setElderUsers(data);
      // Select the first elder user by default
      if (data.length > 0) {
        setSelectedElder(data[0]);
      }
    } catch (error) {
      console.error("Failed to load elder users:", error);
      // Only show alert if it's a real error, not just empty data
      if (error.message && !error.message.includes('404')) {
        Alert.alert("Error", "Failed to load elder users. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={tokens.highlight} />
        <Text className="text-subtitle mt-2">Loading elder users...</Text>
      </SafeAreaView>
    );
  }

  if (elderUsers.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
        <Entypo name="heart-outlined" size={64} color={tokens.subtitle} />
        <Text className="text-xl font-bold text-text mt-4 text-center">
          No Elder Users Found
        </Text>
        <Text className="text-subtitle text-center mt-2">
          Connect with elder users to start monitoring their wellbeing.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-background">
      <ScrollView>
        <View className="mx-4 mb-4">
          {/* Elder User Selector */}
          <View className="mt-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-lg text-text">
                {elderUsers.length > 1 ? "Select Elder User" : "Elder User"}
              </Text>
              <Pressable
                onPress={() => navigation.navigate("CreateElderUser")}
                className="bg-highlight p-2 rounded-full"
                accessibilityLabel="Add new elder user"
              >
                <FontAwesome name="plus" size={16} color="white" />
              </Pressable>
            </View>
            
            {elderUsers.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {elderUsers.map((elder) => (
                  <Pressable
                    key={elder._id}
                    onPress={() => setSelectedElder(elder)}
                    className={`mr-3 px-4 py-2 rounded-xl ${
                      selectedElder?._id === elder._id 
                        ? "bg-highlight" 
                        : "bg-badge"
                    }`}
                  >
                    <Text 
                      className={`font-semibold ${
                        selectedElder?._id === elder._id 
                          ? "text-white" 
                          : "text-text"
                      }`}
                    >
                      {elder.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {selectedElder && (
            <>
              {/* Header Card - Elder User Profile */}
              <Pressable
                onPress={() =>
                  navigation.navigate("ElderUserProfile", {
                    elderName: selectedElder.name,
                    dob: formatDate(selectedElder.dateOfBirth),
                    tags: [...selectedElder.medicalInfo.conditions, ...selectedElder.medicalInfo.allergies],
                    avatarUrl: "",
                    elderId: selectedElder._id,
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Open ${selectedElder.name}'s profile`}
                accessibilityHint={`Navigates to ${selectedElder.name}'s profile`}
                android_ripple={{
                  color: tokens.highlight + "22",
                  borderless: false,
                }}
                hitSlop={8}
                className="relative mt-8 rounded-2xl overflow-hidden bg-background border border-border py-2"
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                {/* decorative left bar */}
                <View className="absolute left-0 top-0 bottom-0 w-1 bg-highlight" />

                <View className="flex-row items-center p-4">
                  <View className="p-3 rounded-full bg-badge mr-3">
                    <Entypo
                      name="heart-outlined"
                      size={22}
                      color={tokens.highlight}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-lg text-text">{selectedElder.name}</Text>
                    <Text className="text-subtitle">
                      Age: {calculateAge(selectedElder.dateOfBirth)} • Born {formatDate(selectedElder.dateOfBirth)}
                    </Text>
                    {selectedElder.medicalInfo.conditions.length > 0 && (
                      <Text className="text-subtitle text-sm mt-1">
                        Conditions: {selectedElder.medicalInfo.conditions.join(", ")}
                      </Text>
                    )}
                  </View>

                  {/* explicit CTA makes affordance obvious */}
                  <View className="flex-row items-center">
                    <Text className="text-highlight font-semibold mr-1">
                      View profile
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={tokens.highlight}
                    />
                  </View>
                </View>
              </Pressable>

              {/* Health Information */}
              <View className="mt-8 flex-row justify-between items-center">
                <Text className="font-bold text-xl text-text">Health Overview</Text>
              </View>

              <View className="mt-4 border border-border rounded-2xl bg-background shadow-sm">
                {/* Medications */}
                {selectedElder.medicalInfo.medications.length > 0 && (
                  <View className="p-4 border-b border-border">
                    <View className="flex-row items-center mb-2">
                      <FontAwesome6
                        name="pills"
                        size={18}
                        color={colors.red[500]}
                        className="mr-3"
                      />
                      <Text className="font-bold text-base text-text ml-2">Medications</Text>
                    </View>
                    {selectedElder.medicalInfo.medications.map((medication, index) => (
                      <Text key={index} className="text-subtitle text-sm ml-6">
                        • {medication}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Allergies */}
                {selectedElder.medicalInfo.allergies.length > 0 && (
                  <View className="p-4 border-b border-border">
                    <View className="flex-row items-center mb-2">
                      <FontAwesome
                        name="warning"
                        size={18}
                        color={colors.orange[500]}
                      />
                      <Text className="font-bold text-base text-text ml-2">Allergies</Text>
                    </View>
                    {selectedElder.medicalInfo.allergies.map((allergy, index) => (
                      <Text key={index} className="text-subtitle text-sm ml-6">
                        • {allergy}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Emergency Contacts */}
                {selectedElder.emergencyContacts.length > 0 && (
                  <View className="p-4">
                    <View className="flex-row items-center mb-2">
                      <FontAwesome
                        name="phone"
                        size={18}
                        color={colors.blue[500]}
                      />
                      <Text className="font-bold text-base text-text ml-2">Emergency Contacts</Text>
                    </View>
                    {selectedElder.emergencyContacts.map((contact, index) => (
                      <View key={index} className="ml-6 mb-1">
                        <Text className="text-text font-semibold">{contact.name} ({contact.relation})</Text>
                        <Text className="text-subtitle text-sm">{contact.phoneNumber}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Show empty state if no health info */}
                {selectedElder.medicalInfo.medications.length === 0 && 
                 selectedElder.medicalInfo.allergies.length === 0 && 
                 selectedElder.emergencyContacts.length === 0 && (
                  <View className="p-4 text-center">
                    <Text className="text-subtitle text-center">No health information available</Text>
                  </View>
                )}
              </View>

              {/* Quick Actions */}
              <View className="mt-8 flex-row justify-between items-center">
                <Text className="font-bold text-xl text-text">Quick Actions</Text>
              </View>

              <View className="mt-4 flex-row justify-between">
                <Pressable className="flex-1 mr-2 bg-highlight p-4 rounded-xl items-center">
                  <FontAwesome name="phone" size={24} color="white" />
                  <Text className="text-white font-semibold mt-2">Call</Text>
                </Pressable>
                
                <Pressable className="flex-1 mx-2 bg-calm p-4 rounded-xl items-center">
                  <FontAwesome name="heart" size={24} color="white" />
                  <Text className="text-white font-semibold mt-2">Check Mood</Text>
                </Pressable>
                
                <Pressable 
                  className="flex-1 ml-2 bg-badge border border-border p-4 rounded-xl items-center"
                  onPress={() =>
                    navigation
                      .getParent<BottomTabNavigationProp<MainTabParamList>>()
                      ?.navigate("Health")
                  }
                >
                  <FontAwesome6 name="notes-medical" size={24} color={tokens.text} />
                  <Text className="text-text font-semibold mt-2">Health</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
