
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'

const SignUp = () => {
    const navigation = useNavigation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [elderId, setElderId] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !elderId.trim() || !confirmPassword.trim()) {
            Alert.alert('Missing Fields', 'Please fill out all fields.')
            return
        }
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.')
            return
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.')
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
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, elderId }),
            })
            const data = await response.json()
            if (response.ok) {
                Alert.alert('Registration Successful', data.message || 'Account created successfully.', [
                    { text: 'OK', onPress: () => navigation.navigate('LogIn') },
                ])
            } else {
                Alert.alert('Registration Failed', data.message || 'Please try again.')
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to register. Please try again later.')
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-white p-6">
                <View className="flex-1 justify-center">
                    <Text className="text-3xl font-bold text-center mb-10">Create Account</Text>
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
                                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
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
                        <View className="flex-row items-center border-b border-gray-300">
                            <TextInput
                                placeholder="Confirm Password"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                className="flex-1 py-2 px-1"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword((s) => !s)}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showConfirmPassword ? 'Hide password' : 'Show password'
                                }
                                hitSlop={8}
                                style={{ position: 'absolute', right: 8 }}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Connect to Elder (Name or ID)"
                            value={elderId}
                            onChangeText={setElderId}
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
