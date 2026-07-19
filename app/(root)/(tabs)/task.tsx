import icons from '@/constrants/icons'
import images from '@/constrants/images'
import { client, DATABASE_ID, databases, RealtimeResponse, TASKS_ID } from '@/lib/appwrite'
import { useAuth } from '@/lib/auth-context'
import { Tasks } from '@/types/database.type'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ID, Query } from 'react-native-appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Task() {

    const [section, setSection] = useState<Boolean>(false)
    const [filter, setFilter] = useState<Boolean>(false)
    const [title, setTitle] = useState<String>("")
    const [location, setLocation] = useState<String>("")
    const [subject, setSubject] = useState<String>("")
    const [description, setDescription] = useState<String>("")
    const [date, setDate] = useState<String>("")
    const [tasks, setTasks] = useState<Tasks[]>()
    const { user } = useAuth();

    const handleBackButton = () => {
        router.replace("/")
    }

    const handleCreateButton = () => {
        setSection((prev) => !prev)
    }

    const handleFilterButton = () => {
        setFilter((prev) => !prev)
    }

    useEffect(() => {
        fetchTasks()

        const channel = `databases.${DATABASE_ID}.collections.${TASKS_ID}.documents`
        const taskSubscription = client.subscribe(
            channel,
            (reponse: RealtimeResponse) => {
                if (reponse.events.includes("databases.*.collections.*.documents.*.create")) {
                    fetchTasks();
                } else if (reponse.events.includes("databases.*.collections.*.documents.*.update")) {
                    fetchTasks();
                } else if (reponse.events.includes("databases.*.collections.*.documents.*.delete")) {
                    fetchTasks();
                }
            }
        );

        fetchTasks();

        // cancels and unsubscribe; cleans up any memory leaks from the use effect
        return () => {
            taskSubscription();
        }
    }, [user])

    const fetchTasks = async () => {
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

    const handleSubmit = async () => {
        if (!user) return;

        await databases.createDocument(
            DATABASE_ID, 
            TASKS_ID, 
            ID.unique(),
            {
                user_id: user.$id,
                title,
                location,
                subject,
                description,
                status: "New",
                date,
            }
        );

        handleCreateButton();
    };
 
    return (
    <SafeAreaView className="bg-white h-full flex-1" edges={['left', 'right']}>
        <ImageBackground source={images.gradientHomeBackground} resizeMode="contain" className='flex-1' style={styles.gradientHomeBackground}>
            <View style={styles.screenContainer}> 

                {/* Back Button & Screen Title */}
                <View style={styles.topScreenContainer}>
                    <TouchableOpacity onPress={handleBackButton}><Image source={icons.chevronsLeftIcon} style={styles.navHomeIcon} resizeMode="contain"/></TouchableOpacity>
                    
                    <Text style={styles.titleTextBanner}>Tasks</Text>
                </View>

                {/* Filter Button */}
                <View>
                    <TouchableOpacity onPress={handleFilterButton}><Image source={icons.filterIcon} style={styles.filterIcon} resizeMode="contain"/></TouchableOpacity>
                </View>

                {/* List of Tasks */}
                <View style={styles.listContainer}>
                    
                        {tasks?.length === 0 ? (
                            <View><Text style={styles.noTaskCreatedText}>There are no tasks created. Click the button below to get started!</Text></View>
                        ) : (
                            <ScrollView contentContainerStyle={{ paddingTop: 5, paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
                                {tasks?.map((task) => (
                                    <Link key={task.$id} href={`/tasks/${task.$id}`} asChild>
                                        <TouchableOpacity style={styles.taskBox}>
                                            <View style={styles.taskSubBox}>
                                                <Text style={styles.taskTitle}>{task.title}</Text>
                                                <Text style={styles.taskInfo}>{task.time}</Text>
                                            </View>
                                            
                                            <Text style={styles.taskInfo}>{task.subject}</Text>
                                        </TouchableOpacity>
                                    </Link>
                                ))}
                            </ScrollView>
                        )}
                </View>

                {/* Add Button */}
                <TouchableOpacity onPress={handleCreateButton}>
                    <Image source={icons.addButtonIcon} style={styles.addButtonIcon} resizeMode="contain"/>
                </TouchableOpacity>

                {/* Filter Selection Section */}
                {filter ? (
                    <View style={styles.filterContainer}>
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}/>
                        <View style={styles.filterBox}>
                            <View>
                                <Image source={icons.arrowUpIcon}/>
                                <Text>Filter</Text>
                                <Image source={icons.filter}/>
                            </View>
                            
                        </View>
                    </View>
                ) : null}

                {/* Task Creation Section */}
                {section ? (
                    <View style={styles.createTaskContainer}>
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}/>
                        <View style={styles.createTaskBox}>
                            <Text style={styles.newTaskTitle}>New Task</Text>

                            <ScrollView contentContainerStyle={{ gap: 30, paddingTop: 20, paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
                                <TextInput style={styles.createText}
                                    multiline={false}
                                    autoCapitalize="none" 
                                    keyboardType="default"
                                    placeholder="Title"
                                    placeholderTextColor={"#ffffffff"}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={setTitle}
                                />
                                <TextInput style={styles.createText}
                                    multiline={false}
                                    autoCapitalize="none" 
                                    keyboardType="default"
                                    placeholder="Location"
                                    placeholderTextColor={"#ffffffff"}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={setLocation}
                                />

                                <View style={styles.datetimeBox}>
                                    <TextInput style={styles.createText}
                                        multiline={false}
                                        autoCapitalize="none" 
                                        keyboardType="default"
                                        placeholder="mm/dd/yyyy"
                                        placeholderTextColor={"#ffffffff"}
                                        returnKeyType="done"
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={setDate}
                                    />
                                    <Text style={styles.createText}>Time</Text>
                                </View>
                                
                                <Text style={styles.createTextDecS}>Subject</Text>
                                <TextInput style={styles.createTextDecSBox}
                                    multiline={true}
                                    autoCapitalize="none" 
                                    keyboardType="default"
                                    placeholder='Type something...'
                                    placeholderTextColor={"#ffffffff"}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={setSubject}
                                />
                                <Text style={styles.createTextDec}>Description</Text>
                                <TextInput style={styles.createTextDecBox}
                                    multiline={true}
                                    autoCapitalize="none" 
                                    keyboardType="default"
                                    placeholder='Type something...'
                                    placeholderTextColor={"#ffffffff"}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={setDescription}
                                />
                            </ScrollView>

                            <View style={styles.createButtonContainer}>
                                <TouchableOpacity onPress={handleCreateButton}><Text style={styles.createButton}>Cancel</Text></TouchableOpacity>
                                
                                <TouchableOpacity onPress={handleSubmit} disabled={!title || !subject}>
                                    <LinearGradient colors={['#d33c28e6','#a05fd8e6','#3DCDF5e6']}  start={{ x: 0.1, y: 0 }} end={{ x: 1.05, y: 1 }}
                                                    style={styles.createSubmitButton}>
                                        <Text style={styles.createButton}>Submit</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                ) : null}

            </View>
        </ImageBackground>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        left: 32,
        width: 45
    },
    titleTextBanner: {
        fontSize: 43,
        top: 91,
        right: 30, 
        fontFamily: "poppins",
        fontWeight: 600
    },
    listContainer: {
        width: 375,
        marginTop: 120,
        height: 470
    },
    addButtonIcon: {
        alignSelf: "flex-end",
        right: 30,
        top: 20,
        width: 70
    },
    createTaskContainer: {
        width: 375,
        position: "absolute",
        marginTop: 140,
        borderRadius: 50,
    },
    createTaskBox: {
        backgroundColor: "#000000bf",
        height: 653,
        borderRadius: 50,
        gap: 30
    },
    newTaskTitle: {
        textAlign: "right",
        right: 40,
        fontFamily: "poppins",
        fontSize: 33,
        color: "#ffffff",
        fontWeight: 600,
        textTransform: "uppercase",
        paddingTop: 20,

    },
    datetimeBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "43%",
        gap: 38
    },
    createText: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 19,
        left: 40,
        borderBottomWidth: 1,
        borderColor: "#ffffff",
        width: "79%",
        paddingBottom: 10,
        top: -20
    },
    createTextDecS: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 19,
        left: 40,
        top: -20
    },
    createTextDec: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 19,
        left: 40,
        top: -55
    },
    createTextDecSBox: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 15,
        left: 40,
        height: 70,
        top: -40,
        backgroundColor: "rgba(0, 0, 0, .23)",
        marginRight: 80,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ffffff",
        minHeight: 70,
        textAlignVertical: 'top',
        padding: 10
    },
    createTextDecBox: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 15,
        left: 40,
        height: 100,
        top: -75,
        backgroundColor: "rgba(0, 0, 0, .23)",
        marginRight: 80,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ffffff",
        minHeight: 70,
        textAlignVertical: 'top',
        padding: 10
    },
    createButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        top: -40,
        gap: 20
    },
    createButton: {
        fontFamily: "poppins",
        color: "#ffffff",
        fontSize: 18,
        textAlign: "center",
        fontWeight: 500
    },
    createSubmitButton: {
        width: 120,
        borderRadius: 20,
        height: 33,
        justifyContent: "center",
        bottom: 4
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
    filterIcon: {
        alignSelf: "flex-end",
        marginTop: -10,
        top: 90,
        right: 30
    },
    filterContainer: {
        width: 330,  
        position: "absolute",
        marginTop: 200,
        borderRadius: 50,
        alignSelf: "center"
    },
    filterBox: {
        backgroundColor: "#000000bf",
        height: 473,
        borderRadius: 50,
        gap: 30
    }
})