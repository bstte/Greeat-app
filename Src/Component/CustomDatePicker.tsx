
// CustomTextInput.js
import React from 'react';
import { TouchableOpacity, Text, Modal, View,StyleSheet } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Prime_Color } from '../Colour/Colour';

interface CustomDatePickerProps {
    visible: boolean,
    selectedDate: string,
    onClose:any

}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ visible, selectedDate, onClose }) => {

    const [internalDate, setInternalDate] = React.useState(selectedDate);

    const handleDateChange = (date) => {
        setInternalDate(date);
    };

    const handleOKPress = () => {
        onClose && onClose(internalDate);
    };
    return (
        <Modal animationType='slide' transparent={true} visible={visible}>
            <View style={styles.modelContainer}>
                <View style={styles.modelView}>
                    <DatePicker
                        mode='calendar'
                        selected={internalDate}
                        onDateChange={handleDateChange}
                        onSelectedChange={(date) => setInternalDate(date)}
                        options={styles.DatePickerOption}
                    />
                    <TouchableOpacity onPress={handleOKPress}>
                        <Text style={styles.oktext}>Select</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomDatePicker;


const styles = StyleSheet.create({
  modelContainer:{
    flex: 1, alignItems: 'center', justifyContent: 'center' 
  },
  modelView:{
    margin:responsiveHeight(2), backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderRadius: responsiveHeight(2), padding: responsiveHeight(3.5), width: responsiveWidth(90), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: responsiveHeight(0.5), elevation: responsiveHeight(0.2) 
  },
  DatePickerOption:{
    backgroundColor: '#ffffff',
    textHeaderColor: Prime_Color,
    textDefaultColor: '#000000',
    selectedTextColor: '#fff',
    mainColor: Prime_Color,
    textSecondaryColor: Prime_Color,
    borderColor: 'rgba(122, 146, 165, 0.1)',
  },
  oktext:{
    color: Prime_Color ,
    
    fontSize:responsiveFontSize(2.5)
  }
})
