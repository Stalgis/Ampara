
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { AuthContext } from '../../App'
import apiFetch from '../../services/api'

const SignUp = () => {
    const navigation = useNavigation()
    const { setIsAuthenticated } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [elder, setElder] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSignUp = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Invalid Password',
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
            return
        }

        setError(null)
        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, elderConnection: elder })
            })

            if (!response.ok) {
                const message = await response.text()
                setError(message || 'Registration failed')
                return
            }

            const { access_token, user } = await response.json()
            await AsyncStorage.setItem('access_token', access_token)
            await AsyncStorage.setItem('user', JSON.stringify(user))
            setIsAuthenticated(true)
        } catch (e) {
            setError('Registration failed')
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-white p-6">
                <View className="flex-1 justify-center">
                    <Text className="text-3xl font-bold text-center mb-10">Create Account</Text>
                    {error && (
                        <Text className="text-red-500 text-center mb-4">{error}</Text>
                    )}
                    <View className="mb-6">
                        <TextInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            className="border-b border-gray-300 py-2 px-1"
                        />
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            className="border-b border-gray-300 py-2 px-1"
                            autoCapitalize="none"
                        />
                    </View>
                    <View className="mb-6">
                        <View className="flex-row items-center border-b border-gray-300">
                            <TextInput
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                className="flex-1 py-2 px-1"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword((s) => !s)}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showPassword ? 'Hide password' : 'Show password'
                                }
                                hitSlop={8}
                                style={{ position: 'absolute', right: 8 }}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Connect to Elder (Name or ID)"
                            value={elder}
                            onChangeText={setElder}
                            className="border-b border-gray-300 py-2 px-1"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSignUp}
                        className="bg-blue-500 rounded-lg py-3"
                    >
                        <Text className="text-white text-center font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Text className="text-gray-500">Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                        <Text className="text-blue-500 font-bold ml-1">Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignUp
