import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth ,responsiveFontSize} from 'react-native-responsive-dimensions';

const Horizontal_line = () => {
  return (
    <View style={styles.maincontainer} />
  )
}

export default Horizontal_line

const styles=StyleSheet.create({
    maincontainer:{
        width: "100%", height: responsiveHeight(0.2), backgroundColor: "gray", marginTop: responsiveHeight(2)
    },
})