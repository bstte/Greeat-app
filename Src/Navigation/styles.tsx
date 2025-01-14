import { StyleSheet } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";


const styles=StyleSheet.create({
     container:{
     flexDirection:"row",
     justifyContent:"space-between",
     alignItems:"center",
     backgroundColor:"#f6f6f6",
     padding:responsiveHeight(2.3),
     marginBottom:responsiveHeight(2.3),
   
     
     },
    profile_img:{
        flex:1,

    resizeMode: 'cover',
        width: responsiveHeight(9), height: responsiveHeight(9), borderRadius: responsiveWidth(9)
},
title:{
 
    fontSize:responsiveFontSize(2),
    fontWeight:"400",
    color:"#000",

},
email:{
 
    fontSize:responsiveFontSize(2),
    fontWeight:"400",
    color:"#000",
},
footer:{
    position:"absolute",
    right:0,
    left:0,
    bottom:responsiveHeight(5.2),
    backgroundColor:"#f6f6f6",
    padding:responsiveHeight(2.2),
    

},
logtext:{
    fontSize:responsiveFontSize(2),

  color:"#000",
    marginLeft:responsiveHeight(1.4)
}
})

export default styles;