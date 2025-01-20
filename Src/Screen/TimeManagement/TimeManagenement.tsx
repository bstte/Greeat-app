import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Modal, TextInput, Button, Alert, Image } from 'react-native';
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
import CustomImageModal from '../../Component/CustomImageModal';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageResizer from 'react-native-image-resizer';

const TimeManagement = (props) => {
    const [weekRange, setWeekRange] = useState('');
    const userData = useSelector((state) => state.user.userData);
    const [scheduleData, setScheduleData] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('isoWeek'));
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible_without_schedule, setModalVisible_without_schedule] = useState(false);
    const [date, setDate] = useState('');
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [shift_id, setshift_id] = useState('');
    const [user_id, seuser_id] = useState('');
    const [selectedOption, setSelectedOption] = useState(null); 

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
        setDate(selectedDate); 
        setModalVisible_without_schedule(true);
    };

    const handleSaveNote_without_schedule = async () => {
        console.log("selectedOption", selectedOption)
        console.log("selectedImage", selectedImage)
        // setModalVisible_without_schedule(false);
        if (!note) {

            ErrorMessage({

                message: "Notes is Required "
            });
            return;
        }
        if (selectedOption === "Sick" && !selectedImage) {

            ErrorMessage({
                message: translate('AddInvoice.Photo_required')
            });
            return;
        }

          const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('note', note);
        formData.append('type', selectedOption==='Leave'?1:2);
        if (selectedImage) {
            formData.append('file', {
                uri: selectedImage.uri,
                name: selectedImage.uri.split('/').pop(),
                type: selectedImage.type
            });
        }
        formData.append('date', date);

        const token = await fetchToken();
        if (token) {
            console.log("formdata",formData)
            try {
                const response = await api.Leave_without_schedule(token, formData)
                console.log(response.data)
                updateWeekRange(currentWeekStart);
                setModalVisible_without_schedule(false);
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
        console.log("selectedOption", selectedOption)
        console.log("selectedImage", selectedImage)
        // setModalVisible(false);

        if (!note) {

            ErrorMessage({

                message: "Notes is Required "
            });
            return;
        }
        if (selectedOption === "Sick" && !selectedImage) {

            ErrorMessage({
                message: translate('AddInvoice.Photo_required')
            });
            return;
        }

        // const formData = new FormData();
        // formData.append('shift_id', shift_id);
        // formData.append('note', note);
        // if (selectedImage) {
        //     formData.append('file', {
        //         uri: selectedImage.uri,
        //         name: selectedImage.uri.split('/').pop(),
        //         type: selectedImage.type
        //     });
        // }

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

    const handleImageModalVisible = () => {
        setImageModalVisible(!isImageModalVisible);
    };


    const handelImage = async (item) => {
        let resizedImage;

        try {

            const originalWidth = item.width;
            const originalHeight = item.height;

            // Set a maximum width and height for resizing
            const maxWidth = 1100; // Maximum desired width
            const maxHeight = 1100; // Maximum desired height

            // Calculate the target dimensions while maintaining the aspect ratio
            let targetWidth = originalWidth;
            let targetHeight = originalHeight;

            if (originalWidth > maxWidth || originalHeight > maxHeight) {
                if (originalWidth > originalHeight) {
                    targetWidth = maxWidth;
                    targetHeight = Math.round((maxWidth / originalWidth) * originalHeight);
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round((maxHeight / originalHeight) * originalWidth);
                }
            }



            // Resize the image
            resizedImage = await ImageResizer.createResizedImage(
                item.path,
                targetWidth,
                targetHeight,
                'JPEG',
                90 // Compression quality (90% recommended for good quality)
            );

            console.log("Resized image:", resizedImage);
        } catch (error) {
            console.error('Image resizing error:', error);
            return; // Exit if resizing fails
        }

        const imageType = resizedImage.mime || 'image/jpeg';

        setSelectedImage({ ...resizedImage, type: imageType });

        handleImageModalVisible();
    }

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
                                                            <Text style={styles.leaveButtonText}>Assenza</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.noSchedule}>{translate('TimeManagement.No_Schedule')}</Text>
                                    {userData && userData.id === item.id && (
                                        <TouchableOpacity
                                            style={styles.leaveButton_withoutschedule}
                                            onPress={() => openLeaveModal_without_schedule(item.id, dayDate)} // Pass the specific day date here
                                        >
                                            <Text style={styles.leaveButtonText}>Assenza</Text>
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
                <View style={styles.modalContainer} >
                    <View style={styles.modalContent} >

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 13 }}>
                            <Text style={styles.modalTitle}>Lascia una nota</Text>
                            <TouchableOpacity onPress={() => {setModalVisible(false),setNote(''),setSelectedOption(null),setSelectedImage(null)}}>
                                <Text style={{ color: Prime_Color, fontSize: 19, fontWeight: "bold" }}>X</Text>

                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Motivazione (Ferie, Malattia, ROL, etc."
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />

                        {/* Checkboxes */}

                        <View style={{ flexDirection: "row" }}>
                            <View style={[styles.checkboxContainer, { marginRight: 10 }]}>
                                <CheckBox
                                    isChecked={selectedOption === 'Sick'}
                                    onClick={() => setSelectedOption('Sick')}
                                    checkedCheckBoxColor="#007BFF"
                                    uncheckedCheckBoxColor="#ccc"
                                />
                                <Text style={styles.checkboxLabel}>Malattia</Text>
                            </View>

                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    isChecked={selectedOption === 'Leave'}
                                    onClick={() => setSelectedOption('Leave')}
                                    checkedCheckBoxColor="#007BFF"
                                    uncheckedCheckBoxColor="#ccc"
                                />
                                <Text style={styles.checkboxLabel}>Ferie</Text>
                            </View>

                        </View>
                        <TouchableOpacity style={styles.ImageContainer} onPress={handleImageModalVisible}>
                            <Text style={{ fontSize: 16, color: "#333" }}>Scatta foto</Text>
                            <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
                        </TouchableOpacity>


                        {selectedImage && (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: selectedImage.uri }}
                                    style={styles.imagePreview}
                                />
                                <Text>{selectedImage.mime}</Text>
                            </View>
                        )}

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
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 13 }}>
                            <Text style={styles.modalTitle}>Lascia una nota</Text>
                            <TouchableOpacity onPress={() => {setModalVisible_without_schedule(false),setNote(''),setSelectedOption(null),setSelectedImage(null)}}>
                                <Text style={{ color: Prime_Color, fontSize: 19, fontWeight: "bold" }}>X</Text>

                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Motivazione (Ferie, Malattia, ROL, etc.)"
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />

                        <View style={{ flexDirection: "row" }}>
                            <View style={[styles.checkboxContainer, { marginRight: 10 }]}>
                                <CheckBox
                                    isChecked={selectedOption === 'Sick'}
                                    onClick={() => setSelectedOption('Sick')}
                                    checkedCheckBoxColor="#007BFF"
                                    uncheckedCheckBoxColor="#ccc"
                                />
                                <Text style={styles.checkboxLabel}>Malattia</Text>
                            </View>

                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    isChecked={selectedOption === 'Leave'}
                                    onClick={() => setSelectedOption('Leave')}
                                    checkedCheckBoxColor="#007BFF"
                                    uncheckedCheckBoxColor="#ccc"
                                />
                                <Text style={styles.checkboxLabel}>Ferie</Text>
                            </View>

                        </View>
                        <TouchableOpacity style={styles.ImageContainer} onPress={handleImageModalVisible}>
                            <Text style={{ fontSize: 16, color: "#333" }}>Scatta foto</Text>
                            <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
                        </TouchableOpacity>


                        {selectedImage && (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: selectedImage.uri }}
                                    style={styles.imagePreview}
                                />
                                <Text>{selectedImage.mime}</Text>
                            </View>
                        )}

                        <Button title="Salva" onPress={handleSaveNote_without_schedule} />
                    </View>
                </View>
            </Modal>
            <CustomImageModal
                togglevisible={isImageModalVisible}
                onclose={handleImageModalVisible}
                multipleImage={false}
                Galleryvalidation={true}
                handelImage={(item) => handelImage(item)}
            />
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
        // alignItems: 'center',
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

    checkbox: {
        marginBottom: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#000',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
    ImageContainer: {
        marginVertical: responsiveHeight(1),
        marginTop: 15,
        marginBottom: 25,
        // marginHorizontal: responsiveHeight(1),
        borderRadius: responsiveHeight(1),
        padding: responsiveHeight(.5),
        paddingLeft: responsiveHeight(1.7),
        borderWidth: 1,
        borderColor: "#797979",
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    imagePreview: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    imagePreviewContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default TimeManagement;
