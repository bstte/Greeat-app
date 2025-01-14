import React from 'react';
import { StyleSheet, TextInput, View, Text, Platform } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

interface CustomTextInputProps {
  value: string;
  placeholder: string;
  title: string;
  onChangeText: (text: string) => void;
  required: boolean;
  keyboardTypevalue?: string; // Adjusted type here
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ title, value, placeholder, onChangeText, required, keyboardTypevalue, ...rest }) => {
  return (
    <View style={styles.inputView}>
      <Text style={styles.textinputlabel}>
        {title} {required ? <Text style={{ color: "red" }}>*</Text> : null}
      </Text>

      <TextInput
        style={styles.inputText}
        autoCapitalize='none'
        autoCorrect={false}
        value={value}
        keyboardType={keyboardTypevalue || "default"} // Default to "default" if not provided
        placeholder={placeholder}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

export default CustomTextInput;



const styles=StyleSheet.create({
    inputText: {
      width: responsiveWidth(95),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding:  Platform.OS === 'android' ? responsiveHeight(1.5) : responsiveHeight(2.2),
        elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
        shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
        shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
        borderWidth: 1, // Adding a border for clarity on iOS
      borderColor: '#ddd', // Light border color
      // fontSize: 16, // Font size for text input
      color: '#333', // Text color

    },
    textinputlabel:{
        marginLeft:responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18" 
    },
    inputView: {
        width: responsiveWidth(95),
        marginRight:responsiveHeight(2) ,
        position: "relative",
        

    },

})
