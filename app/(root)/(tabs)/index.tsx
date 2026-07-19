import { Image, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import images from '@/constrants/images'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constrants/icons'
import { router } from 'expo-router'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/lib/auth-context'
import { DATABASE_ID, databases, TASKS_ID, TODOLIST_ID } from '@/lib/appwrite'
import { Query } from 'react-native-appwrite'
import { Tasks, ToDoList } from '@/types/database.type'
import GradientText from 'expo-gradient-text'


export default function Index() {
    const [elementDisplay, setElementDisplay] = useState<Boolean>(false);
    const [buttonPressed, setButtonPressed] = useState<Boolean>(true);
    const [tasks, setTasks] = useState<Tasks[]>()
    const [todolist, setToDoList] = useState<ToDoList[]>()

    const {signOut, user} = useAuth()

    useEffect(() => {
            if (!user?.$id) return;

            fetchTasks()
            fetchToDoLists()
        }, [user?.$id])
    
        const fetchTasks = async () => {
            if (!user?.$id) return;

            try {
                const reponse = await databases.listDocuments(
                    DATABASE_ID,
                    TASKS_ID,
                    [Query.equal("user_id", user?.$id ?? "")]
                )
    
                setTasks(reponse.documents as Tasks[]);
    
            } catch (error) {
                console.error(error)
            }
        }

        const fetchToDoLists = async () => {
            if (!user?.$id) return;

            try {
                const reponse = await databases.listDocuments(
                    DATABASE_ID,
                    TODOLIST_ID,
                    [Query.equal("user_id", user?.$id ?? "")]
                )
    
                setToDoList(reponse.documents as ToDoList[]);
    
            } catch (error) {
                console.error(error)
            }
        }

    const handleNavigationPress = () => {
        setElementDisplay((prev) => !prev);
    };

    const handleSiteChangeTasks = () => {
            router.replace("/task");
    };

    const handleSiteChangeTags = () => {
            //router.replace("/tags");
    };

    const handleSiteChangeToDo = () => {
            //router.replace("/todolist");
    };

    const handleSiteChangeAcc = () => {
            //router.replace("/account");
    };

    const handleSiteChangeSet = () => {
            //router.replace("/settings");
    };

    const handleMainButtonPress = () => {
        setButtonPressed((prev) => !prev);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();

        if(hour < 12) return "Good Morning,";
        else if (hour < 18) return "Good Afternoon,";
        else return "Good Evening,";
    };

    // Gets the users first name by checking if user.name exist ( can be undefined )
    const fname = user?.name ? user.name.split(" ")[0] : "";

    return (
        <SafeAreaView className="bg-white h-full flex-1" edges={['left', 'right']}>
            <ImageBackground source={images.gradientHomeBackground} resizeMode="contain" className='flex-1' style={styles.gradientHomeBackground}>

                <View style={styles.screenContainer}>

                    <View style={styles.topScreenContainer}>
                        <TouchableOpacity onPress={handleNavigationPress}><Image source={icons.alignCenterIcon} style={styles.navHomeIcon} resizeMode="contain"/></TouchableOpacity>
                        <Image source={images.titleBanner} style={styles.titleBanner} resizeMode="contain"/>
                    </View>

                    <Text style={styles.greetingTitle}>{getGreeting()}</Text>

                    <GradientText colors={['#3DCDF5','#a05fd8','#d33c28']}  start={{ x: 0.24, y: 0 }} end={{ x: 0, y: 0 }} style={styles.userTitle}>
                        <Text>{fname}</Text>
                    </GradientText>

                    {/* Tasks & Todo List Buttons */}
                    {buttonPressed ? (
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity>    
                            <LinearGradient colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 1.5 }} end={{ x: 0.95, y: 1 }}
                                            style={styles.buttonTouchContainer}>
                                <Text style={styles.buttonContainerText}>Tasks</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleMainButtonPress}>   
                            <Text style={styles.buttonContainerTextOff}>To-do List</Text>
                        </TouchableOpacity> 
                        </View>

                    ) : (
                        
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleMainButtonPress}>    
                            <Text style={styles.buttonContainerTextOff}>Tasks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>   
                            <LinearGradient colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 0 }} end={{ x: 0.95, y: 1 }}
                                            style={styles.buttonTouchContainer}>
                                <Text style={styles.buttonContainerText}>To-do List</Text>
                            </LinearGradient> 
                        </TouchableOpacity>
                        </View>
 
                    )}

                    {/* No Tasks/To-do List Available Section */}
                    {tasks?.length === 0 && buttonPressed ? (
                        <View style={styles.centerListContainter}>
                            <Text style={styles.centerListText}>No Current Task Available</Text>

                            <TouchableOpacity style={styles.centerListButton} onPress={handleSiteChangeTasks}>
                                <GradientText colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 0 }} end={{ x: 1.05, y: 1 }}>
                                    <Text style={styles.centerListButtonText}>+ Create a New Task</Text>
                                </GradientText>    
                            </TouchableOpacity>
                        </View>
                    ) : null }

                    {todolist?.length === 0 && !buttonPressed ? (
                        <View style={styles.centerListContainter}>
                            <Text style={styles.centerListText}>No To-do List Created</Text>

                            <TouchableOpacity style={styles.centerListButton} onPress={handleSiteChangeToDo}>
                                <GradientText colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 0 }} end={{ x: 1.05, y: 1 }}>
                                    <Text style={styles.centerListButtonText}>+ Create a To-do List</Text>
                                </GradientText>    
                            </TouchableOpacity>
                        </View>
                    ) : null }

                    {/* List of Tasks */}
                    {tasks?.length !== 0 && buttonPressed ? (
                        <View style={styles.listContainer}>
                        <ScrollView contentContainerStyle={{ paddingTop: 5, paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
                            {tasks?.length === 0 ? (
                                <View><Text style={styles.noTaskCreatedText}>There are no tasks created. Click the button below to get started!</Text></View>
                            ) : (
                                tasks?.map((task, key) => (
                                    <View key={key} style={styles.taskBox}>
                                        <View style={styles.taskSubBox}>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                            <Text style={styles.taskInfo}>{task.time}</Text>
                                        </View>
                                        
                                        <Text style={styles.taskInfo}>{task.subject}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                    ) : null}
                    
                </View>
  
                {/* Navigation Section */}
                {elementDisplay ? (
                    <View style={styles.navContainer}>
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                        <LinearGradient colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.2, y: 0 }} end={{ x: 0.75, y: 1 }}
                                        style={{paddingLeft: 122, paddingBottom: 400}}>
                            <View style={styles.navBox}>
                                <TouchableOpacity onPress={handleNavigationPress}><Image source={icons.whiteXIcon}/></TouchableOpacity>
                                <View style={styles.navProfileBox}>
                                    <Image source={icons.genericAvater}/>
                                    <Text style={styles.navProfileText}>{user?.name}</Text>
                                    <Text style={styles.navProfileTextUID}>UID: {user?.$id}</Text>
                                </View>

                                <View style={styles.navTextBox}>
                                    <TouchableOpacity onPress={() => handleSiteChangeTasks()}><Text style={styles.navText}>Tasks</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSiteChangeTags()}><Text style={styles.navText}>Tags/Categories</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSiteChangeToDo()}><Text style={styles.navText}>To-Do List</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSiteChangeAcc()}><Text style={styles.navText}>Account</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleSiteChangeSet()}><Text style={styles.navText}>Settings</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={signOut} style={styles.navLogoutButton}>
                                    <GradientText colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 0 }} end={{ x: 1.05, y: 1 }}>
                                        <Text style={styles.navLogoutText}>Logout</Text>
                                    </GradientText>    
                                </TouchableOpacity>
                                </View>

                            </View>
                        </LinearGradient>
                    </View>
                ) : null}

            </ImageBackground>
        </SafeAreaView>
    );      
}

const styles = StyleSheet.create({
    navContainer: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        top: -380,
        left: 0,
    },
    navBox: {
        gap: 35,
        top: 110,
        right: 100,
    },
    navProfileBox: {
        alignItems: "center",
        gap: 7,
        top: -50,
        borderBottomColor: "#ffffffff",
        borderBottomWidth: 2,
        paddingBottom: 20,
        width: 330
    },
    navProfileText: {
        top: 6,
        fontFamily: "poppins",
        fontWeight: 600,
        fontSize: 23,
        color: "#ffffff"
    },
    navProfileTextUID: {
        top: 6,
        fontFamily: "poppins",
        fontWeight: 400,
        fontSize: 14,
        color: "#ffffff"
    },
    navTextBox: {
        alignItems: "center",
        gap: 25,
        top: -50,
        right: 5
    },
    navText: {
        left: 45,
        fontFamily: "poppins",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: 27,
        color: "#ffffff"
    },
    navLogoutButton: {
        backgroundColor: "#ffffff",
        width: 270,
        height: 49,
        alignItems: "center",
        justifyContent: "center",
        left: 45,
        top: 50,
        borderRadius: 40,
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
    },
    navLogoutText: {
        fontFamily: "poppins",
        fontWeight: 600,
        textTransform: "uppercase",
        fontSize: 23,
    },
    gradientHomeBackground: {
        position: 'absolute',
        bottom: -40,
        width: '100%',
        height: 500,
    },
    topScreenContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        bottom: 22
    },
    screenContainer: {
        top: -330
    },
    navHomeIcon: {
        top: 90,
        left: 32
    },
    titleBanner: {
        width: 250,
        height: 300,
        bottom: 33,
        left: 9,
        marginBottom: -128
    },
    greetingTitle: {
        fontFamily: "poppins",
        fontWeight: 500,
        fontSize: 22,
        left: 30
    },
    userTitle: {
        fontFamily: "poppins",
        fontWeight: 600,
        fontSize: 39,
        left: 30,
        bottom: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        top: 40,
    },
    buttonTouchContainer: {
        borderRadius: 70,
        width: 154,
    },
    buttonContainerText: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        padding: 6,
        textAlign: "center"
    },
    buttonContainerTextOff: {
        fontFamily: "poppins",
        color: "#000000ff",
        fontWeight: 600,
        padding: 6,
        textAlign: "center",
        width: 154,
    },
    centerListContainter: {
        backgroundColor: "#00000015",
        width: 315,
        height: 380,
        top: 70,
        left: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    centerListButton: {
        backgroundColor: "#ffffff",
        height: 43,
        width: 236,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        borderRadius: 20,
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
    },
    centerListText: {
        fontFamily: "poppins",
        color: "#000000ff",
        fontWeight: 500,
        paddingLeft: 80,
        paddingRight: 80,
        textAlign: "center",
        fontSize: 19
    },
    centerListButtonText: {
        fontFamily: "poppins",
        fontWeight: 600,
        fontSize: 15
    },
    noTaskCreatedText: {
        textAlign: "center",
        width: 300,
        alignSelf: "center",
        top: 140,
        fontFamily: "poppins",
        fontWeight: 600,
        fontSize: 20,
        borderColor: "#00000044",
        borderWidth: 1,
        borderRadius: 40,
        padding: 30
    },
    taskBox: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 20,
        padding: 20,
        backgroundColor: "#ffffff",
        width: 330,
        alignSelf: "center",
        flexDirection: "column",
        marginBottom: 15
    },
    taskSubBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        flexWrap: "wrap"
    },
    taskTitle: {
        fontFamily: "poppins",
        fontWeight: 500,
        fontSize: 17,
        textOverflow: "true",
        maxWidth: 220
    },
    taskInfo: {
        fontFamily: "poppins",
        fontWeight: 400,
        fontSize: 14,
        color: "#00000073",
        maxWidth: 330,
    },
    listContainer: {
        width: 375,
        marginTop: 120,
        height: 470,
        top: -60
    },
})