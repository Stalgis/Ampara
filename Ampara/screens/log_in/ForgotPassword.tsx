
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'

const ForgotPassword = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleResetPassword = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.')
            return
        }
        try {
            setLoading(true)
            const apiUrl = Constants.expoConfig?.extra?.apiUrl || ''
            const response = await fetch(`${apiUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error((data as { message?: string }).message || 'Failed to send reset link')
            }
            Alert.alert('Success', (data as { message?: string }).message || 'Reset link sent. Please check your email.')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong.'
            Alert.alert('Error', message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-white p-6">
                <View className="flex-1 justify-center">
                    <Text className="text-3xl font-bold text-center mb-10">Forgot Password</Text>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Email"
                            className="border-b border-gray-300 py-2 px-1"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-blue-500 rounded-lg py-3"
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Text>
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
