
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const ForgotPassword = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-white p-6">
                <View className="flex-1 justify-center">
                    <Text className="text-3xl font-bold text-center mb-10">Forgot Password</Text>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Email"
                            className="border-b border-gray-300 py-2 px-1"
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-blue-500 rounded-lg py-3"
                    >
                        <Text className="text-white text-center font-bold">Send Reset Link</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                        <Text className="text-blue-500 font-bold">Back to Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword
