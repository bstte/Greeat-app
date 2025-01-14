import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Prime_Color } from '../Colour/Colour';



interface buttonprops {
    title: string,
    handleform: () => void;
}
const CustomButton: React.FC<buttonprops> = ({ title, handleform }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleform}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>{title}</Text>
            </TouchableOpacity>
        </View>

    )
}

export default CustomButton


const styles = StyleSheet.create({
    buttonContainer:{
        paddingLeft: responsiveHeight(2),
        paddingRight: responsiveHeight(2),
    },
    loginBtn: {
        width: responsiveWidth(92),
        backgroundColor: Prime_Color,
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveHeight(3),
        marginBottom: responsiveHeight(1.4)
    },
    loginText: {
        color: "white",
        fontSize: responsiveFontSize(2.3),
        fontWeight: "bold",
    },
})