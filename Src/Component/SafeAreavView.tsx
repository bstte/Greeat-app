import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

const SafeAreavView = ({ children }) => {
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"white",alignItems:"center"}}>
            {children}
        </SafeAreaView>
    )
}

export default SafeAreavView