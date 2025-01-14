import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerComponent = ({ props, title, color, onRefresh }) => {
    return (
        <View style={styles.drawerButtonContainer}>
            <TouchableOpacity
                style={styles.drawerButton}
                onPress={() => props.navigation.openDrawer()}
            >
                <Icon name="menu-open" size={responsiveHeight(4.4)} color={color} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: color }]}>{title}</Text>
            
            <TouchableOpacity
                style={styles.drawerButton}
                onPress={onRefresh}  // Call the refresh function here
            >
                <Icon name="refresh" size={responsiveHeight(3.5)} color={color} />
            </TouchableOpacity>
        </View>
    )
}

export default DrawerComponent

const styles = StyleSheet.create({
    drawerButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: responsiveHeight(1),
        marginRight: responsiveHeight(2),
        paddingVertical: responsiveHeight(1.5), 
        alignItems: "center"
    },
    drawerButton: {
        padding: 0,
    },
    title: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
    },
});
