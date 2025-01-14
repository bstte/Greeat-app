import { View, Text, Alert, Modal, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import api from '../../API/api';
import { AxiosError } from 'axios';
import { setUser } from '../../Reducer/slices/userSlice';

import Toast from 'react-native-toast-message';
import { Prime_Color } from '../../Colour/Colour';


interface authuser {
  navigation: any
}
const Authuser: React.FC<authuser> = ({ navigation }) => {



  React.useEffect(() => {
    get_user();
   
    
  }, []);
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setModalVisible(true)
    }, 2000);


    return () => {
      clearTimeout(timeout);
      
    };

  }, []);


 

  const get_user = async () => {
    // setModalVisible(true)
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
      
        const response = await api.get_user(token);
          if (response && response.data) {
            dispatch(setUser(response.data));
            console.log("auth",response.data)
            navigation.replace('Home');
          }
      } catch (error) {
     
        Alert.alert("Session Expired Please Login Again for Security Reasons")
         navigation.replace('Login');
      }
    } else {
      setModalVisible(false)
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }


  }


  // Return a JSX element (View) to satisfy the component requirement
  return (
    <View style={{ width: "100%", height: "100%", justifyContent: "center", }}>
      {modalVisible ? (
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => console.log()}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View>
                <ActivityIndicator size={'large'} color={Prime_Color} />
              </View>

              <Text style={{ alignSelf: "center", fontSize: 18, marginLeft: 30 }}>Authenticate </Text>

            </View>
          </View>


        </Modal>
      ) : null}

    </View>
  );
};

export default Authuser;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row"
  },

})
