import { View, Text,StyleSheet } from 'react-native'
import { responsiveHeight, responsiveWidth ,responsiveFontSize} from 'react-native-responsive-dimensions';
import React from 'react'

interface TextLabelProps {
    title: string;
    value: string;
  }
  
  const Textlabel: React.FC<TextLabelProps> = ({ title, value }) => {
    return (
      <View style={styles.nameContainer}>
        <Text style={styles.nametitle}>{title}</Text>
        <Text style={styles.namevalue}>{value}</Text>
      </View>
    );
  };
  


const styles = StyleSheet.create({

    nameContainer: {
      flex:1,
        flexDirection: "row",
        alignItems: "center",
        // marginLeft: 12,
        // marginTop:responsiveHeight(1)
    },
    nametitle: {
        marginRight: responsiveHeight(1),
        fontSize:responsiveFontSize(2),
        fontWeight:"600",
        color:"#202020",
        marginBottom:13
    },
    namevalue:{
      flex:1,
        fontSize: responsiveFontSize(2),
        color:"#202020",
        marginBottom:13
    }
})
export default Textlabel