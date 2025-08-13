
import { View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const SignUp = () => {
    const navigation = useNavigation()
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')

    const handleSignUp = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Invalid Password',
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
            return
        }
        // Handle sign up logic here
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-white p-6">
                <View className="flex-1 justify-center">
                    <Text className="text-3xl font-bold text-center mb-10">Create Account</Text>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Full Name"
                            className="border-b border-gray-300 py-2 px-1"
                        />
                    </View>
                    <View className="mb-6">
                        <TextInput
                            placeholder="Email"
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
