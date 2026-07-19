import icons from '@/constrants/icons';
import images from '@/constrants/images';
import { DATABASE_ID, databases, TASKS_ID } from '@/lib/appwrite';
import { Tasks } from '@/types/database.type';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskDetails () {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Tasks|null>();

  type StatusType = 'New' | 'In-Progress' | 'Done';

  const STATUS_OPTIONS: Record<StatusType, { default: any; selected: any }> = {
    New:  {
      default: icons.unselectedCheckBox,
      selected: icons.selectedCheckBox,
    },
    'In-Progress':  {
      default: icons.unselectedCheckBox,
      selected: icons.selectedCheckBox,
    },
    Done:  {
      default: icons.unselectedCheckBox,
      selected: icons.selectedCheckBox,
    }
  };

  const isStatusType = (value: any): value is StatusType => {
    return ['New', 'In-Progress', 'Done'].includes(value);
  };

  const [selectedStatus, setSelectedStatus] = useState<StatusType>();

  useEffect(() => {
    const getTask = async () => {
      if (typeof id !== 'string') return;

      try {
        const doc = await databases.getDocument(
          DATABASE_ID, 
          TASKS_ID, 
          id,
        )

        setTask(doc as Tasks)

      } catch (error) {
        console.error("failed to load desired task:", error)
      }
    }

    if (id) getTask()
    
  }, [id])

  useEffect(() => {
    if (task && isStatusType(task.status)) {
      setSelectedStatus(task.status);
    }
  }, [task]);

  useEffect(() => {
    const updateStatus = async () => {
      if (!task || !selectedStatus || selectedStatus === task.status) return;

      try {
        await databases.updateDocument(DATABASE_ID, TASKS_ID, task.$id, {
          status: selectedStatus,
        });
        console.log('Status updated');
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    };

  updateStatus();
  }, [selectedStatus]);

  return (
    <SafeAreaView className="bg-white h-full flex-1" edges={['left', 'right']}>
            <ImageBackground source={images.gradientHomeBackground} resizeMode="contain" className='flex-1' style={styles.gradientHomeBackground}>
                <View style={styles.screenContainer}> 

                  {/* Tasks Content */}
                  <View style={styles.taskContentContainer}>
                    <ScrollView contentContainerStyle={{ paddingTop: 5, paddingBottom: 190 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.taskTitle}>{task?.title}</Text>

                    {/* Location Title + Icon */}
                    <View style={styles.taskDetailsBox}>
                      <Image source={icons.mapGradientIcon} style={styles.pressableButton} resizeMode="contain"/>
                      <Text style={styles.taskDetailsTitle}>{!task?.location ? "N/A" : task.location}</Text>
                    </View>

                    {/* Date Tile + Icon */}
                    <View style={styles.taskDetailsBox}>
                      <Image source={icons.calendarGradientIcon} style={styles.pressableButton} resizeMode="contain"/>
                      <Text style={styles.taskDetailsTitle}>{!task?.date ? "N/A" : task.date}</Text>
                    </View>

                    {/* Time Title + Icon */}
                    <View style={styles.taskDetailsBox}>
                      <Image source={icons.clockGradientIcon} style={styles.pressableButton} resizeMode="contain"/>
                      <Text style={styles.taskDetailsTitle}>{!task?.time ? "N/A" : task.time}</Text>
                    </View>

                    <View style={styles.taskDescriptionsBox}>
                      <Text style={styles.taskDescriptionsTitle}>Subject</Text>
                      <Text style={styles.taskDescriptionsText}>{task?.subject}</Text>

                      <Text style={styles.taskDescriptionsTitle}>Description</Text>
                      <Text style={styles.taskDescriptionsText}>{!task?.description ? "No description stated." : task.description}</Text>
                    </View>

                    {/* Tags Area */}

                    {/* Status Section */}
                    <Text style={styles.statusTitle}>Status</Text>
                    <View style={styles.statusBox}>

                      {(Object.keys(STATUS_OPTIONS) as StatusType[]).map((status, key) => (
                        <View style={styles.statusButtonBox} key={key}>
                          <TouchableOpacity key={status} onPress={() => setSelectedStatus(status)}>
                            <Image source={selectedStatus === status ? STATUS_OPTIONS[status].selected : STATUS_OPTIONS[status].default} style={styles.pressableStatusButton} resizeMode="contain"/>
                          </TouchableOpacity>
                          <Text style={styles.statusButtonText}>{status}</Text>
                        </View>
                      ))}
                      
                    </View>

                    </ScrollView>
                  </View>

                  {/* Close / Delete Button */}
                  <View style={styles.buttonGrid}>
                    <TouchableOpacity onPress={() => router.back()}><Image source={icons.xIcon} style={styles.pressableButton} resizeMode="contain"/></TouchableOpacity>
                    <TouchableOpacity><Image source={icons.redTrashCan} style={styles.pressableButton} resizeMode="contain"/></TouchableOpacity>
                  </View>

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
  screenContainer: {
    margin: 20,
    marginTop: -260,
    height: 660,
    padding: 30,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    flexDirection: "row"
  },
  buttonGrid: {
    flexDirection: "column",
    gap: 35,
    top: 10
  },
  pressableButton: {
    width: 30,
    height: 20
  },
  taskContentContainer: {
    maxWidth: 250
  },
  taskTitle: {
    fontFamily: "poppins",
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 20,
  },
  taskDetailsBox: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 15,
    maxWidth: 200
  },
  taskDetailsTitle: {
    fontFamily: "poppins",
    fontSize: 16,
    fontWeight: 400,
    color: "#00000080",
  },
  taskDescriptionsBox: {
    marginTop: 15,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: "#00000080",

  },
  taskDescriptionsTitle: {
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 5,
    marginTop: 30,
  },
  taskDescriptionsText: {
    fontFamily: "poppins",
    fontSize: 15,
    fontWeight: 400,
    color: "#00000080",
  },
  statusBox: {
    flexDirection: "row",
    marginLeft: -11,
    justifyContent: "flex-start",
  },
  statusTitle: {
    fontFamily: "poppins",
    fontSize: 18,
    fontWeight: 500,
    marginTop: 15,
  },
  statusButtonBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  statusButtonText: {
    fontFamily: "poppins",
    fontSize: 15,
    fontWeight: 500,
  },
  pressableStatusButton: {
    width: 40,
    alignSelf: "flex-start",
    marginRight: -7
  }
})
