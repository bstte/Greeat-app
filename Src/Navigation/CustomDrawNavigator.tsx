import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import Loader from '../Component/Loader';
import { Prime_Color } from '../Colour/Colour';
import api from '../API/api';
import SuccessMessage from '../Component/CustomTostMessage';
import { setUser } from '../Reducer/slices/userSlice';

const CustomDrawNavigator = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Yes',
          onPress: async () => {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (token) {
              try {
                const response = await api.logout(token);
                if (response.data.success) {
                  setIsLoading(false);
                  SuccessMessage({ message: response.data.message });
                  await AsyncStorage.removeItem('token');
                  const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                  props.navigation.dispatch(resetAction);
                }
              } catch (error) {
                console.log('Logout error:', error);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const TruncateEmail = (email, length) => {
    if (email.length <= length) return email;
    return email.substring(0, length) + '...';
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://example.com/background-image-url.jpg' }} // Replace with your background image URL
        style={styles.background}
      >
        <DrawerContentScrollView {...props}>
          <View style={styles.headerContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData?.name || ''}</Text>
              <Text style={styles.userEmail}>{TruncateEmail(userData?.location_id || '', 19)}</Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate('Profile')} style={styles.editProfileButton}>
              <Icon name="account-edit" size={responsiveHeight(3.5)} color="#fff" />
            </TouchableOpacity>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </ImageBackground>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <View style={styles.logoutContainer}>
          <Icon name="logout" size={responsiveHeight(3.3)} color="#000" />
          <Text style={styles.logoutText}>Log Out</Text>
        </View>
      </TouchableOpacity>
      <Loader loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#00000080',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: responsiveFontSize(1.8),
    color: '#ddd',
    marginTop: 4,
  },
  editProfileButton: {
    padding: 10,
    backgroundColor: Prime_Color,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: responsiveFontSize(2.2),
    color: '#000',
  },
});

export default CustomDrawNavigator;
