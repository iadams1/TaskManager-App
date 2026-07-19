
import images from '@/constrants/images'
import icons from '@/constrants/icons'
import React from 'react'
import { Image, View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GradientText from 'expo-gradient-text';
import { router } from 'expo-router'

export const welcome = () => {

    const handleLoginSignUp = () => {
        router.replace("/auth")
    };
    
        return (
                <SafeAreaView className="bg-white h-full" edges={['left', 'right']}>
                    <ImageBackground source={images.backgroundGradient} resizeMode="cover" className='flex-1'>
    
                        {/* Background */}
                        <Image source={images.iconAndTitle} className="size-[460] mt-[60] ml-[-55] mb-[-70]" resizeMode="contain" />
                        
                        {/* Welcome Text */}
                        <View className='pl-4'>
                            <GradientText colors={['#D33C28', '#A05FD8','#3DCDF5']}  start={{ x: 0.2, y: 0 }} end={{ x: 0.75, y: 1 }}>
                                <Text className="text-center uppercase font-poppins-semibold tracking-[10] text-3xl">Welcome</Text>
                            </GradientText>
                        </View>
    
                        {/* Description Text */}
                        <View>
                            <Text className="text-center text-wrap pr-10 pl-10 top-2 text-lg font-poppins-medium 
                            text-black opacity-[.29]">An easier way to keep track of your personal reminders and tasks</Text>
                        </View>
    
                        {/* Let's Get Started Button */}
                        <TouchableOpacity onPress={handleLoginSignUp} className="bg-white rounded-full left-[39] 
                        w-[300] h-[49] mt-24 justify-center shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
                            <View className="flex flex-row items-center justify-center">
                                <Text className=" font-poppins-semibold text-lg mr-5">Let's Get Started</Text>
                                <Image source={icons.gradientCircleArrowRight} className="w-8 h-8" resizeMode="contain"/>
                            </View>
                        </TouchableOpacity>
    
                    </ImageBackground>
                </SafeAreaView>
  );
}

export default welcome