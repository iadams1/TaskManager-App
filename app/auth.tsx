import images from "@/constrants/images";
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "@/lib/auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";


export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState<boolean>(true);
    const [elementDisplay, setElementDisplay] = useState<Boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [cpassword, setConfirmPassword] = useState<string>("");
    const [fname, setFirstName] = useState<string>("");
    const [lname, setLastName] = useState<string>("");

    const params = useLocalSearchParams();
    const initialized = useRef(false);

    const showAlert = (title: string, message?: string) => {
        Alert.alert(title, message);
    };

    const router = useRouter();
    const { signIn, signUp } = useAuth();

    useEffect(() => {
        if (!initialized.current) {
            if (params.mode === "login") {
                setIsSignUp(false);
                setElementDisplay(false);
            }
            initialized.current = true;
        }
    }, [params]);

    const handleAuth = async () => {

        if (!isSignUp) {
            if (!email || !password) {
                showAlert('Login Failed', 'Please check your credentials.');
            }

            const error = await signIn(email, password)
            if (error) {
                showAlert(error)
                return
            }

            router.replace("/")
        } else {
            if (!email || !password || !fname || !lname || !cpassword) {
                showAlert('Missing Fields', 'Please fill in all fields.');
            }
            else if (password.length < 6) {
                showAlert('Invaild Password', 'Passwords must be at least 6 characters long.');
            }
            else if (password != cpassword) {
                showAlert('Password Error', 'Password confirmation does not match.');
            }

            const error = await signUp(fname, lname, email, password)
            if (error) {
                showAlert(error)
                return
            }
            
        }

    };

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
        setElementDisplay((prev) => !prev);
    };
    
    return (
        <SafeAreaView className="bg-white h-full flex-1" edges={['left', 'right']}>
            <ImageBackground source={isSignUp ? images.signUpBackground: images.loginBackground} resizeMode="cover" className='flex-1'>
                    <View className='mt-[100]'>

                        {/* Title Text */}
                        <Text style={isSignUp ? styles.signUpText : styles.loginText}>
                            {isSignUp ? "Sign Up" : "Login"}
                        </Text>

                        {/* First & Last Name Text Input */}
                        {elementDisplay ? (
                            <View>
                            <Text style={styles.authTitleText}>First & Last Name</Text>
                                <View style={styles.nameContainter}>
                                <TextInput style={styles.authTextInput}
                                    autoCapitalize="none" 
                                    placeholder="First Name"
                                    placeholderTextColor={"#000000"}
                                    onChangeText={setFirstName}
                                />

                                <TextInput style={styles.authTextInput}
                                    autoCapitalize="none" 
                                    placeholder="Last Name"
                                    placeholderTextColor={"#000000"}
                                    onChangeText={setLastName}
                                />
                                </View>
                            </View>
                        ) : null }
                        
                        {/* Email Text Input */}
                        <Text style={styles.authTitleText}>Email</Text>
                        <TextInput style={styles.authTextInput}
                            autoCapitalize="none" 
                            keyboardType="email-address"
                            placeholder={isSignUp ? "Enter Your Desired Email" : "Enter Your Account Email"}
                            placeholderTextColor={"#000000"}
                            onChangeText={setEmail}
                        />

                        {/* Password Text Input */}
                        <Text style={styles.authTitleText}>Password</Text>
                        <TextInput style={styles.authTextInput}
                            autoCapitalize="none" 
                            secureTextEntry
                            placeholder="Enter Password"
                            placeholderTextColor={"#000000"}
                            onChangeText={setPassword}
                        />

                        {/* Confirm Password Text Input */}
                        {elementDisplay ? (
                        <View>
                            <Text style={styles.authTitleText}>Confirm Password</Text>
                            <TextInput style={styles.authTextInput}
                                autoCapitalize="none" 
                                secureTextEntry
                                placeholder="Re-Enter Password"
                                placeholderTextColor={"#000000"}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        ) : null }

                        {/* Forgot Password Button */}
                        {elementDisplay ? null : (
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                            </TouchableOpacity>
                        )}

                        {/* SignUp / Login Button */}
                        <TouchableOpacity style={styles.buttonShadow} onPress={handleAuth}>
                            <LinearGradient colors={isSignUp ? ['#A05FD8','#3DCDF5'] : ['#D33C28','#A05FD8']}  start={{ x: 0.2, y: 0 }} end={{ x: 0.75, y: 1 }}
                            style={styles.authSignUpButton}>
                                <Text style={styles.authButtonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* SignUp / Login Re-Direction Button */}
                        <TouchableOpacity onPress={handleSwitchMode}>
                            <View style={isSignUp ? styles.authDirectionButtonS : styles.authDirectionButtonL}>
                                <Text style={styles.authDirectionButtonText}>{isSignUp ? "Already have an account?" : "Don't have an account?"}</Text>
                                <Text style={styles.authDirectionButtonTextN}>{isSignUp ? "Sign In" : "Sign Up"}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    signUpText: {
        color: "white",
        fontSize: 35,
        fontFamily: "poppins",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 7,
        top: 27,
        paddingLeft: 35,
        paddingBottom: 110
    },
    authTitleText: {
        color: "black",
        fontFamily: "poppins",
        fontWeight: 500,
        fontSize: 20,
        marginLeft: 50,
        paddingBottom: 11,
        paddingTop: 28
    },
    authTextInput: {
        color: "black",
        fontFamily: "poppins",
        fontWeight: 400,
        fontSize: 16,
        marginLeft: 50,
        paddingBottom: 7,
        borderBottomWidth: 1.4,
        width: "73%"
    },
    nameContainter: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "41%"
    },
    authSignUpButton: {
        marginTop: 27,
        justifyContent: "center",
        borderWidth: 3,
        width: 237,
        height: 56,
        left: 67,
        borderRadius: 69,
        borderColor: "#ffffff01",
    },
    authButtonText: {
        color: "white",
        fontSize: 22,
        fontFamily: "poppins",
        fontWeight: "600",
        textTransform: "uppercase",
        textAlign: "center"
    },
    buttonShadow: {
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
    },
    authDirectionButtonS: {
        flexDirection: "row",
        left: 59,
        top: 27,
    },
    authDirectionButtonL: {
        flexDirection: "row",
        left: 70,
        top: 60,
    },
    authDirectionButtonText: {
        fontFamily: "poppins",
        fontWeight: "400",
        marginLeft: 5
    },
    authDirectionButtonTextN: {
        fontFamily: "poppins",
        fontWeight: "600",
        marginLeft: 5,
        color: '#7443D6'
    },
    loginText: {
        color: "white",
        fontSize: 35,
        fontFamily: "poppins",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 7,
        top: 127,
        paddingRight: 35,
        textAlign: "right",
        paddingBottom: 210
    },
    forgotPasswordText: {
        color: "#D33C28",
        fontFamily: "poppins",
        fontWeight: 600,
        marginTop: 12,
        textAlign: "right",
        paddingRight: 50,
        paddingBottom: 31
    }
})