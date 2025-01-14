import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Modal, TextInput, Button, Alert } from 'react-native';
import { fetchToken } from '../Helpers/fetchDetails';
import api from '../../API/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import DrawerComponent from '../../Component/DrawerComponent';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import Loader from '../../Component/Loader';
import { Prime_Color } from '../../Colour/Colour';
import { useSelector } from 'react-redux';
import { translate } from '../../i18n/Language/useTranslation';
import { ErrorMessage } from '../../Component/CustomTostMessage';

const TimeManagement = (props) => {
    const [weekRange, setWeekRange] = useState('');
    const userData = useSelector((state) => state.user.userData);
    const [scheduleData, setScheduleData] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('isoWeek'));
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible_without_schedule, setModalVisible_without_schedule] = useState(false);
    const [date, setDate] = useState('');


    const [shift_id, setshift_id] = useState('');
    const [user_id, seuser_id] = useState('');

    const [note, setNote] = useState('');

    useEffect(() => {
        updateWeekRange(currentWeekStart);
    }, [currentWeekStart]);

    const updateWeekRange = (weekStart) => {
        const startOfWeek = weekStart;
        const endOfWeek = weekStart.clone().endOf('isoWeek');
        const formattedWeekRange = `${startOfWeek.format('MMM DD, YYYY')} - ${endOfWeek.format('MMM DD, YYYY')}`;
        setWeekRange(formattedWeekRange);
        // setDate(startOfWeek.format('YYYY-MM-DD'))
        Timemanagement(startOfWeek);
    };

    const Timemanagement = async (weekStartDate) => {
        const token = await fetchToken();
        if (token) {
            try {
                setIsLoading(true);
                // console.log(weekStartDate.format('YYYY-MM-DD'))
                const response = await api.schedule(token, weekStartDate.format('YYYY-MM-DD'));
                setIsLoading(false);
                setScheduleData(response.data.data);
                console.log("user", response.data.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const openLeaveModal = (shift_id) => {
        setshift_id(shift_id);
        setModalVisible(true);
    };

    const openLeaveModal_without_schedule = (user_id, selectedDate) => {
        seuser_id(user_id);
        setDate(selectedDate); // Set the specific selected date
        setModalVisible_without_schedule(true);
    };

    const handleSaveNote_without_schedule=async ()=>{
    
        setModalVisible_without_schedule(false);
        if (!note) {

            ErrorMessage({

                message: "Notes is Required "
            });
            return;
        }
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.Leave_without_schedule(token, { user_id: user_id, note: note,date:date })
                console.log(response.data)
                updateWeekRange(currentWeekStart);
                Alert.alert('Success', 'Richiesta aggiunta con successo');
               
                setNote('');
            } catch (error) {
                setModalVisible_without_schedule(false);
                console.error("leave no schedule error", error)
                Alert.alert('Error', 'Something went wrong');
            }

        }
        
    }
    const handleSaveNote = async () => {
        // console.log("shift_id:", shift_id);
        // console.log("Note:", note);
        setModalVisible(false);

        if (!note) {

            ErrorMessage({

                message: "Notes is Required "
            });
            return;
        }
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.Leave(token, { shift_id: shift_id, note: note })
                // console.log(response.data)
                updateWeekRange(currentWeekStart);
                Alert.alert('Success', 'Richiesta aggiunta con successo');
              
                setNote('');
            } catch (error) {
                setModalVisible(false);

                console.error("leave error", error)
                Alert.alert('Error', 'Something went wrong');
            }

        }



    };

    const renderSchedule = ({ item }) => {
        const days = [translate('TimeManagement.Monday'), translate('TimeManagement.Tuesday'), translate('TimeManagement.Wednesday'), translate('TimeManagement.Thursday'), translate('TimeManagement.Friday'), translate('TimeManagement.Saturday'), translate('TimeManagement.Sunday')];
        
        return (
            <View style={styles.userContainer}>
                <Text style={styles.userName}>{translate('TimeManagement.User')}: {item.user}</Text>
                {days.map((day, index) => {
                    // Calculate the specific date for each day of the week
                    const dayDate = currentWeekStart.clone().add(index, 'days').format('YYYY-MM-DD');
    
                    return (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={styles.dayName}>{day}:</Text>
                            {item[index] && item[index].length > 0 ? (
                                item[index].map((schedule, idx) => (
                                    <View key={idx} style={styles.scheduleRow}>
                                        <View style={styles.scheduleDataContainer}>
                                            <View>
                                                <Text style={styles.scheduleData}>
                                                    {formatTime(schedule.schedule.split('-')[0])} - {formatTime(schedule.schedule.split('-')[1])}
                                                </Text>
                                                <Text style={styles.locationData}>{schedule.location}</Text>
                                            </View>
                                            {userData && userData.id === schedule.user_id && (
                                                <View>
                                                    {schedule.status === 1 ? (
                                                        <Text style={styles.approvareButton}>In attesa di</Text>
                                                    ) : schedule.status === 2 ? (
                                                        <Text style={styles.approvareButton}>Approvata</Text>
                                                    ) : schedule.status === 3 ? (
                                                        <Text style={styles.approvareButton}>Disapprovata</Text>
                                                    ) : (
                                                        <TouchableOpacity
                                                            style={styles.leaveButton}
                                                            onPress={() => openLeaveModal(schedule.shift_id)}
                                                        >
                                                            <Text style={styles.leaveButtonText}>Partire</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <Text style={styles.noSchedule}>{translate('TimeManagement.No_Schedule')}</Text>
                                    {userData && userData.id === item.id && (
                                        <TouchableOpacity
                                            style={styles.leaveButton_withoutschedule}
                                            onPress={() => openLeaveModal_without_schedule(item.id, dayDate)} // Pass the specific day date here
                                        >
                                            <Text style={styles.leaveButtonText}>Partire</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <DrawerComponent props={props} title={translate('TimeManagement.Weekly_Schedule')} color={Prime_Color} onRefresh={() => updateWeekRange(currentWeekStart)} />
            <View style={styles.navigationContainer}>
                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.navigationButton} onPress={() => setCurrentWeekStart(prev => prev.clone().subtract(1, 'week'))}>
                        <MaterialIcons color={"white"} name="navigate-before" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentWeekStart(moment().startOf('isoWeek'))}>
                        <Text style={styles.currentButtonText}> {translate('TimeManagement.Current')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigationButton} onPress={() => setCurrentWeekStart(prev => prev.clone().add(1, 'week'))}>
                        <MaterialIcons color={"white"} name="navigate-next" size={20} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.weekRangeText}>{weekRange}</Text>
            </View>

            <FlatList
                data={scheduleData}
                renderItem={renderSchedule}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => updateWeekRange(currentWeekStart)} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
            />

            {/* Modal for Adding Leave Note */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Lascia una nota </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Inserisci qui la tua nota..."
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                        <Button title="Salva" onPress={handleSaveNote} />
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible_without_schedule}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible_without_schedule(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Lascia una nota </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Inserisci qui la tua nota..."
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                        <Button title="Salva" onPress={handleSaveNote_without_schedule} />
                    </View>
                </View>
            </Modal>

            {/* {isLoading && <Loader Loading={isLoading} />} */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginTop: 15,
        marginBottom: 10,
    },
    navigationButtons: {
        flexDirection: "row",
    },
    navigationButton: {
        backgroundColor: Prime_Color,
        padding: 5,
    },
    currentButtonText: {
        backgroundColor: "#6c757d",
        fontSize: 17,
        color: "white",
        marginHorizontal: 8,
        padding: 5,
    },
    weekRangeText: {
        fontSize: responsiveFontSize(2),
        color: "#333",
        marginLeft: 6,
    },
    listContainer: {
        paddingBottom: 20,
    },
    userContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginHorizontal: 8,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    dayContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
    dayName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2980b9',
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    scheduleLabelContainer: {
        flex: 1,
    },

    scheduleLabel: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
        color: "#202020",
    },
    locationLabel: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
        color: "#202020",
    },
    scheduleData: {
        fontSize: 14,
        color: '#2c3e50',
    },
    locationData: {
        fontSize: 14,
        color: '#2c3e50',
    },
    noSchedule: {
        fontSize: 14,
        color: '#b0b0b0',
    },
    scheduleDataContainer: {
        flex: 1,
        backgroundColor: '#dddddd',
        padding: 4,
        borderRadius: 4,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: 'space-between', // Adjusted to spread content evenly
        alignItems: 'center', // Vertically centers items
        flexWrap: 'wrap', // Allows content to wrap to the next line if needed
    },

    // Adjusted the "Approvare" text style to wrap if necessary
    approvareButton: {
        fontSize: 16,
        color: "black",
        // backgroundColor: Prime_Color,
        padding: 5,
        borderRadius: 4,
        flexShrink: 1, // Allows the button to shrink if necessary
    },

    // Adjust the leave button style to fit within the container
    leaveButton: {
        backgroundColor: Prime_Color,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginTop: 8,
        alignSelf: 'flex-start', // Prevents it from pushing out of the container
        maxWidth: '100%', // Ensures the button doesn't exceed container width
    },

    leaveButton_withoutschedule: {
        backgroundColor: Prime_Color,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        // marginTop: 8,
        alignSelf: 'flex-start', // Prevents it from pushing out of the container
        maxWidth: '100%', // Ensures the button doesn't exceed container width
    },
    leaveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textInput: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
});

export default TimeManagement;
