import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Prime_Color } from '../Colour/Colour';

interface headerprops{
    props:any,
    title:string
}

const SimpleHeader:React.FC<headerprops> = ({props,title}) => {
  return (
    <View style={styles.DrawerIcon}>
    <TouchableOpacity style={styles.backIcon} onPress={() => props.navigation.goBack()}>
      {/* You can replace this with your back button icon */}
      <MaterialIcons name="arrow-back" size={responsiveHeight(3.5)} color="white" />
    </TouchableOpacity>
    <View style={styles.headerContainer}>

      <Text style={{ color: "white",fontSize:responsiveFontSize(2.5) }}>{title}</Text>

    </View>
  </View>
  )
}

export default SimpleHeader
const styles=StyleSheet.create({
    drawerButton: {
        padding: 0,
        marginTop:responsiveHeight(1.1)
    },
    DrawerIcon: {
        flexDirection: "row", justifyContent: "space-between",backgroundColor:Prime_Color,
     
      
    },
    backIcon:{
        marginTop:responsiveHeight(2.5),
        marginLeft:responsiveHeight(0.5)
    },
    headerContainer:{
        flex: 1, flexDirection: "column", marginLeft: responsiveHeight(3.7), marginTop:responsiveHeight(2.5), marginBottom: responsiveHeight(2.5) 
    }
})