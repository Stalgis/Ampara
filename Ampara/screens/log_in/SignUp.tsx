
import { View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
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
    const [role, setRole] = useState('')
    const [linkedElder, setLinkedElder] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSignUp = async () => {
        setError(null)
        if (!name || !email || !password || !role) {
            setError('All fields are required')
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Invalid Password',
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
            return
        }

        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    ...(linkedElder ? { linkedElders: [linkedElder] } : {}),
                }),
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
                    {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
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
                            autoCapitalize="none"
                            className="border-b border-gray-300 py-2 px-1"
                        />
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Role (e.g., FAMILY_MEMBER)"
                            value={role}
                            onChangeText={setRole}
                            className="border-b border-gray-300 py-2 px-1"
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
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Image
                                    source={!showPassword ? require('../../assets/adaptive-icon.png') : require('../../assets/icon.png')}
                                    className="w-6 h-6"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Connect to Elder (Name or ID)"
                            value={linkedElder}
                            onChangeText={setLinkedElder}
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
