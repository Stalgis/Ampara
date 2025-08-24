import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../controllers/AuthContext";
import { apiService } from "../../services/api";
import { designTokens } from "../../design-tokens";
import { useTheme } from "../../controllers/ThemeContext";
import Card from "../../src/components/ui/Card";
import FormInput from "../../src/components/ui/FormInput";
import PrimaryButton from "../../src/components/ui/PrimaryButton";
import SecondaryButton from "../../src/components/ui/SecondaryButton";
import { Heading, Body } from "../../src/components/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface PhoneNumber {
  label: string;
  number: string;
}

interface EmergencyContact {
  name: string;
  relation: string;
  phoneNumber: string;
}

interface MedicalInfo {
  conditions: string[];
  medications: string[];
  allergies: string[];
}

const CreateElderUser = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  // Form states
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1950, 0, 1)); // Default to a reasonable elder birth year
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Phone numbers - most important section
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { label: "Primary", number: "" },
  ]);
  
  // Emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", relation: "", phoneNumber: "" },
  ]);
  
  // Medical information
  const [conditions, setConditions] = useState<string[]>([""]);
  const [medications, setMedications] = useState<string[]>([""]);
  const [allergies, setAllergies] = useState<string[]>([""]);

  // Validation
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Elder's name is required");
      return false;
    }

    if (!dateOfBirth) {
      Alert.alert("Validation Error", "Date of birth is required");
      return false;
    }

    // Validate primary phone number
    const primaryPhone = phoneNumbers[0].number.trim();
    if (!primaryPhone) {
      Alert.alert("Phone Number Required", "Primary phone number is required for voice AI communication");
      return false;
    }

    if (!validatePhoneNumber(primaryPhone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid primary phone number");
      return false;
    }

    return true;
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { label: "", number: "" }]);
  };

  const removePhoneNumber = (index: number) => {
    if (index === 0) return; // Can't remove primary phone
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index: number, field: keyof PhoneNumber, value: string) => {
    const updated = [...phoneNumbers];
    updated[index][field] = value;
    setPhoneNumbers(updated);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: "", relation: "", phoneNumber: "" }]);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  const addListItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, ""]);
  };

  const removeListItem = (index: number, list: string[], setList: (items: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const updateListItem = (index: number, value: string, list: string[], setList: (items: string[]) => void) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter(p => p.number.trim());
      
      // Filter out empty emergency contacts
      const validEmergencyContacts = emergencyContacts.filter(
        c => c.name.trim() && c.relation.trim() && c.phoneNumber.trim()
      );

      // Filter out empty medical info
      const validConditions = conditions.filter(c => c.trim());
      const validMedications = medications.filter(m => m.trim());
      const validAllergies = allergies.filter(a => a.trim());

      const elderData = {
        name: name.trim(),
        dateOfBirth: dateOfBirth,
        phoneNumbers: validPhoneNumbers,
        emergencyContacts: validEmergencyContacts,
        medicalInfo: {
          conditions: validConditions,
          medications: validMedications,
          allergies: validAllergies,
        },
        caregivers: [user?.sub || user?.id], // Link to current user
      };

      const response = await apiService.createElderUser(elderData);
      
      if (response.success !== false) {
        Alert.alert(
          "Success", 
          `${name} has been added successfully! They can now receive voice calls from the AI system.`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.message || "Failed to create elder user");
      }
    } catch (error: any) {
      console.error("Create elder error:", error);
      Alert.alert("Error", "Failed to create elder user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          <Card className="bg-background rounded-xl p-6 border border-border mb-6">
            <Heading className="text-text mb-2">Add New Elder</Heading>
            <Body className="text-subtitle mb-6">
              Create a profile for an elder who will receive voice calls from the AI system
            </Body>

            {/* PHONE NUMBERS SECTION - MOST IMPORTANT */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <FontAwesome name="phone" size={20} color={tokens.highlight} />
                <Heading className="text-text ml-2">Phone Numbers</Heading>
                <View className="bg-red-100 px-2 py-1 rounded ml-2">
                  <Text className="text-red-600 text-xs font-semibold">REQUIRED</Text>
                </View>
              </View>
              
              <Body className="text-subtitle mb-4">
                📞 Phone numbers are essential - this is how the AI will communicate with the elder
              </Body>

              {phoneNumbers.map((phone, index) => (
                <View key={index} className="mb-4 p-4 border border-border rounded-lg">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-text font-semibold">
                      {index === 0 ? "Primary Phone (Required)" : `Phone ${index + 1}`}
                    </Text>
                    {index > 0 && (
                      <TouchableOpacity onPress={() => removePhoneNumber(index)}>
                        <Ionicons name="close-circle" size={24} color={tokens.accent} />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <FormInput
                    label="Label (e.g., Home, Mobile)"
                    value={phone.label}
                    onChangeText={(value) => updatePhoneNumber(index, 'label', value)}
                    placeholder={index === 0 ? "Primary" : "Mobile, Home, etc."}
                  />
                  
                  <FormInput
                    label="Phone Number"
                    value={phone.number}
                    onChangeText={(value) => updatePhoneNumber(index, 'number', value)}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                  />
                  
                  {phone.number && !validatePhoneNumber(phone.number) && (
                    <Text className="text-red-500 text-sm mt-1">
                      Please enter a valid phone number
                    </Text>
                  )}
                </View>
              ))}

              <SecondaryButton
                title="Add Another Phone Number"
                onPress={addPhoneNumber}
                className="mb-4"
              />
            </View>

            {/* BASIC INFORMATION */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Ionicons name="person" size={20} color={tokens.highlight} />
                <Heading className="text-text ml-2">Basic Information</Heading>
              </View>
              
              <FormInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Elder's full name"
              />
              
              <View>
                <Text className="text-text font-semibold mb-2">Date of Birth</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-background border border-border rounded-lg p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-text text-base">
                      {formatDateForDisplay(dateOfBirth)} (Age: {calculateAge(dateOfBirth)})
                    </Text>
                    <Ionicons name="calendar" size={20} color={tokens.subtitle} />
                  </View>
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()} // Can't be born in the future
                    minimumDate={new Date(1900, 0, 1)} // Reasonable minimum birth year
                  />
                )}
              </View>
            </View>

            {/* EMERGENCY CONTACTS */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <FontAwesome name="phone-square" size={20} color={tokens.highlight} />
                <Heading className="text-text ml-2">Emergency Contacts</Heading>
              </View>

              {emergencyContacts.map((contact, index) => (
                <View key={index} className="mb-4 p-4 border border-border rounded-lg">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-text font-semibold">Contact {index + 1}</Text>
                    {emergencyContacts.length > 1 && (
                      <TouchableOpacity onPress={() => removeEmergencyContact(index)}>
                        <Ionicons name="close-circle" size={24} color={tokens.accent} />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <FormInput
                    label="Name"
                    value={contact.name}
                    onChangeText={(value) => updateEmergencyContact(index, 'name', value)}
                    placeholder="Contact name"
                  />
                  
                  <FormInput
                    label="Relationship"
                    value={contact.relation}
                    onChangeText={(value) => updateEmergencyContact(index, 'relation', value)}
                    placeholder="Son, Daughter, Friend, etc."
                  />
                  
                  <FormInput
                    label="Phone Number"
                    value={contact.phoneNumber}
                    onChangeText={(value) => updateEmergencyContact(index, 'phoneNumber', value)}
                    placeholder="+1234567890"
                    keyboardType="phone-pad"
                  />
                </View>
              ))}

              <SecondaryButton
                title="Add Emergency Contact"
                onPress={addEmergencyContact}
                className="mb-4"
              />
            </View>

            {/* MEDICAL INFORMATION */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <FontAwesome name="heart" size={20} color={tokens.highlight} />
                <Heading className="text-text ml-2">Medical Information</Heading>
              </View>
              <Body className="text-subtitle mb-4">
                Help the AI provide better care by understanding the elder's health context
              </Body>

              {/* Medical Conditions */}
              <Text className="text-text font-semibold mb-2">Medical Conditions</Text>
              {conditions.map((condition, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="flex-1">
                    <FormInput
                      value={condition}
                      onChangeText={(value) => updateListItem(index, value, conditions, setConditions)}
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </View>
                  {conditions.length > 1 && (
                    <TouchableOpacity onPress={() => removeListItem(index, conditions, setConditions)} className="ml-2">
                      <Ionicons name="close-circle" size={24} color={tokens.accent} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <SecondaryButton
                title="Add Condition"
                onPress={() => addListItem(conditions, setConditions)}
                className="mb-4"
              />

              {/* Medications */}
              <Text className="text-text font-semibold mb-2">Current Medications</Text>
              {medications.map((medication, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="flex-1">
                    <FormInput
                      value={medication}
                      onChangeText={(value) => updateListItem(index, value, medications, setMedications)}
                      placeholder="e.g., Metformin 500mg twice daily"
                    />
                  </View>
                  {medications.length > 1 && (
                    <TouchableOpacity onPress={() => removeListItem(index, medications, setMedications)} className="ml-2">
                      <Ionicons name="close-circle" size={24} color={tokens.accent} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <SecondaryButton
                title="Add Medication"
                onPress={() => addListItem(medications, setMedications)}
                className="mb-4"
              />

              {/* Allergies */}
              <Text className="text-text font-semibold mb-2">Allergies</Text>
              {allergies.map((allergy, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="flex-1">
                    <FormInput
                      value={allergy}
                      onChangeText={(value) => updateListItem(index, value, allergies, setAllergies)}
                      placeholder="e.g., Penicillin, Nuts"
                    />
                  </View>
                  {allergies.length > 1 && (
                    <TouchableOpacity onPress={() => removeListItem(index, allergies, setAllergies)} className="ml-2">
                      <Ionicons name="close-circle" size={24} color={tokens.accent} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <SecondaryButton
                title="Add Allergy"
                onPress={() => addListItem(allergies, setAllergies)}
                className="mb-6"
              />
            </View>

            {/* SUBMIT BUTTONS */}
            <PrimaryButton
              title={loading ? "Creating Profile..." : "Create Elder Profile"}
              onPress={handleSubmit}
              disabled={loading}
              className="mb-4"
            />

            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={loading}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateElderUser;