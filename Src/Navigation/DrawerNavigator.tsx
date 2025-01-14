import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
// import BottomNavigator from '../BottomNavigator/BottomNavigator';

import CustomDrawNavigator from './CustomDrawNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useSelector } from 'react-redux';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import Dashbord from '../Screen/Dashbord/Dashbord';
import { Prime_Color } from '../Colour/Colour';
import AddInvoice from '../Screen/Invoice/AddInvoice';
import LIstInvoice from '../Screen/Invoice/LIstInvoice';
import Document from '../Screen/Documnet/Document';
import Supplier from '../Screen/Supplier/Supplier';
import Closer from '../Screen/Closer/Closer';
import TimeManagenement from '../Screen/TimeManagement/TimeManagenement';

import { translate } from '../i18n/Language/useTranslation';

const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {

    const userData = useSelector((state: any) => state.user.userData)





    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerLabelStyle: {
                    fontSize: 14,

                    color: "#000"
                    // fontWeight:"500"
                },
                drawerActiveTintColor: Prime_Color, // Set the selected (active) text color
            }}
            drawerContent={(props) => <CustomDrawNavigator {...props} />} >


            <Drawer.Screen name={translate('dashboard.title')} component={Dashbord}
                options={{
                    drawerIcon: ({ focused, color, size }) => (
                        <Icon name="dashboard" size={responsiveHeight(3.3)} color={focused ? Prime_Color : 'black'} />
                    )
                }}
            />
              <Drawer.Screen name={translate('TimeManagement.title')} component={TimeManagenement}
              

                options={{
                    drawerIcon: ({ focused }) => (
                        <Image
                            source={require('../Assets/Icons/Scheduling.png')}
                            style={{
                                width: responsiveHeight(3.3),
                                height: responsiveHeight(3.3),
                                tintColor: focused ? Prime_Color : 'black'
                            }}
                            resizeMode="contain"
                        />
                    )
                }}
            />

            <Drawer.Screen name={translate('Invoice.Drawer_Title')} component={LIstInvoice}
              
              options={{
                drawerIcon: ({ focused }) => (
                    <Image
                        source={require('../Assets/Icons/Fatture.png')}
                        style={{
                            width: responsiveHeight(3.3),
                            height: responsiveHeight(3.3),
                            tintColor: focused ? Prime_Color : 'black'
                        }}
                        resizeMode="contain"
                    />
                )
            }}
            />
                <Drawer.Screen name={translate('Closer.title')} component={Closer}
              
              options={{
                drawerIcon: ({ focused }) => (
                    <Image
                        source={require('../Assets/Icons/Chiusure.png')}
                        style={{
                            width: responsiveHeight(3.3),
                            height: responsiveHeight(3.3),
                            tintColor: focused ? Prime_Color : 'black'
                        }}
                        resizeMode="contain"
                    />
                )
            }}
            />
            <Drawer.Screen name={translate('Document.title')} component={Document}
               
               options={{
                drawerIcon: ({ focused }) => (
                    <Image
                        source={require('../Assets/Icons/Documenti.png')}
                        style={{
                            width: responsiveHeight(3.3),
                            height: responsiveHeight(3.3),
                            tintColor: focused ? Prime_Color : 'black'
                        }}
                        resizeMode="contain"
                    />
                )
            }}
            />

            {/* <Drawer.Screen name="Supplier" component={Supplier}
                options={{
                    drawerIcon: ({ focused, color, size }) => (
                        <Icon name="money" size={responsiveHeight(3.3)} color={focused ? Prime_Color : 'black'} />
                    )
                }}
            /> */}
            
                


        </Drawer.Navigator>
    );
}

export default DrawerNavigator