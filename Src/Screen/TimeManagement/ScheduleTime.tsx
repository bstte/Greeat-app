// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView } from 'react-native';
// import DatePicker from 'react-native-modern-datepicker';
// import CheckBox from 'react-native-check-box';
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // For watch icon
// import { Prime_Color } from '../../Colour/Colour';
// import CustomDropdown from '../../Component/CustomDropdown';

// const ScheduleTime = ({ modalVisible, setModalVisible, weekRange, userList }) => {
//     const [selectedDays, setSelectedDays] = useState([]);
//     const [startTime, setStartTime] = useState('');
//     const [endTime, setEndTime] = useState('');
//     const [showStartPicker, setShowStartPicker] = useState(false);
//     const [showEndPicker, setShowEndPicker] = useState(false);

//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//     const handleDayChange = (day) => {
//         if (selectedDays.includes(day)) {
//             setSelectedDays(selectedDays.filter(d => d !== day));
//         } else {
//             setSelectedDays([...selectedDays, day]);
//         }
//     };

//     const handleSubmit = () => {
//         const formData = {
//             user_id: 4, // example user_id
//             date: selectedDays.map(() => new Date().toISOString().split('T')[0]), // Mocking date format
//             start_time: startTime,
//             end_time: endTime,
//         };

//         console.log(formData);
//         setModalVisible(false);
//     };
//     function handleuser(item) {
//         console.log(item)
//     }

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//         >
//             <SafeAreaView style={styles.safeArea}>
//                 <ScrollView>
//                 <View style={styles.modalView}>
//                     {/* Close button */}
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                         <Text style={styles.closeButtonText}>X</Text>
//                     </TouchableOpacity>
//                     <View style={{ marginLeft: 20, marginRight: 20 }}>

//                         <CustomDropdown
//                             data={userList.map(user => ({ label: user.user, value: user.user }))}
//                             placeholder='Select Location'
//                             title='Location'
//                             onSelect={handleuser}
//                             required={true}
//                             width={88}
//                         />
//                     </View>

//                     {/* Days of the week checkboxes */}
//                     <Text style={styles.title}>Days: <Text style={{color:"red"}}>*</Text></Text>
//                     <View style={styles.daysContainer}>
//                         {daysOfWeek.map((day, index) => (
//                             <View key={index} style={styles.checkboxContainer}>
//                                 <CheckBox
//                                     isChecked={selectedDays.includes(day)}
//                                     onClick={() => handleDayChange(day)}
//                                 />
//                                 <Text>{day}</Text>
//                             </View>
//                         ))}
//                     </View>
//                     <Text style={styles.title}>Date: <Text style={{color:"red"}}>*</Text></Text>
//                     <View style={styles.timeBox} >
//                         <Text style={styles.timeText}>{weekRange}</Text>

//                     </View>
//                     {/* Start Time Input Box */}
//                     <Text style={styles.title}>Start Time: <Text style={{color:"red"}}>*</Text></Text>
//                     <TouchableOpacity style={styles.timeBox} onPress={() => setShowStartPicker(true)}>
//                         <Text style={styles.timeText}>{startTime || 'Select Start Time'}</Text>
//                         <Icon name="access-time" size={24} color="gray" style={styles.timeIcon} />
//                     </TouchableOpacity>

//                     {/* Start Time Picker Modal */}
//                     <Modal visible={showStartPicker} transparent={true} animationType="slide">
//                         <View style={styles.pickerModal}>
//                             <View style={styles.modelView}>
//                                 <DatePicker
//                                     mode="time"
//                                     minuteInterval={1}
//                                     onTimeChange={selectedTime => {
//                                         setStartTime(selectedTime);
//                                         setShowStartPicker(false); // Hide modal after selection
//                                     }}
//                                     options={styles.DatePickerOption}
//                                 />
//                             </View>
//                         </View>
//                     </Modal>

//                     {/* End Time Input Box */}
//                     <Text style={styles.title}>End Time: <Text style={{color:"red"}}>*</Text></Text>
//                     <TouchableOpacity style={styles.timeBox} onPress={() => setShowEndPicker(true)}>
//                         <Text style={styles.timeText}>{endTime || 'Select End Time'}</Text>
//                         <Icon name="access-time" size={24} color="gray" style={styles.timeIcon} />
//                     </TouchableOpacity>

//                     {/* End Time Picker Modal */}
//                     <Modal visible={showEndPicker} transparent={true} animationType="slide">
//                         <View style={styles.pickerModal}>
//                             <View style={styles.modelView}>
//                                 <DatePicker
//                                     mode="time"
//                                     minuteInterval={1}
//                                     onTimeChange={selectedTime => {
//                                         setEndTime(selectedTime);
//                                         setShowEndPicker(false); // Hide modal after selection
//                                     }}
//                                     options={styles.DatePickerOption}
//                                 />
//                             </View>
//                         </View>
//                     </Modal>

//                     {/* Submit Button */}
//                     <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                     </TouchableOpacity>
//                 </View>
//                 </ScrollView>
//             </SafeAreaView>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)', // Darken the background behind the modal
//     },
//     modalView: {
//         backgroundColor: 'white',
//         marginTop: responsiveHeight(10),
//         borderRadius: 20,
//         padding: 20,
//         marginHorizontal: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     closeButton: {
//         position: 'absolute',
//         right: 10,
//         top: 10,
//     },
//     closeButtonText: {
//         fontSize: 19,
//         fontWeight: 'bold',
//         color:Prime_Color
//     },
//     title: {
//         fontSize: responsiveFontSize(2), color: "#1A1A18",
//         fontWeight:"600",
//         marginVertical: 10,
//     },
//     daysContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap', // Wrap to next line if necessary
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 15,
//         marginBottom: 10,
//     },
//     pickerModal: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add background overlay
//     },
//     modelView: {
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 10,
//         padding: 20,
//         width: responsiveWidth(90),
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     timeBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 10,
//         paddingVertical: 15,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 8,
//         marginBottom: 20,
//     },
//     timeText: {
//         fontSize: 16,
//         color: '#333',
//     },
//     timeIcon: {
//         marginLeft: 10,
//     },
//     submitButton: {
//         backgroundColor: Prime_Color,
//         paddingVertical: 10,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     submitButtonText: {
//         color: 'white',
//         fontSize: 18,
//     },
//     DatePickerOption: {
//         backgroundColor: '#ffffff',
//         textHeaderColor: Prime_Color,
//         textDefaultColor: '#000000',
//         selectedTextColor: '#fff',
//         mainColor: Prime_Color,
//         textSecondaryColor: Prime_Color,
//         borderColor: 'rgba(122, 146, 165, 0.1)',
//     },
// });

// export default ScheduleTime;
