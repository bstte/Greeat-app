import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
// import AgreeCheckbox from '../../components/AgreeCheckbox';
import api from '../../API/api';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from '../../Component/Loader';

import { useDispatch } from 'react-redux';
import { setUser } from '../../Reducer/slices/userSlice';
import SuccessMessage, { ErrorMessage } from '../../Component/CustomTostMessage';
import Toast from 'react-native-toast-message';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Prime_Color } from '../../Colour/Colour';
import SafeAreavView from '../../Component/SafeAreavView';
import { translate } from '../../i18n/Language/useTranslation';




interface loginprops {
  navigation: any
}

const Login: React.FC<loginprops> = (props) => {
  // const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       // try {
  //       //   const response = await api.get_user(token);
  //       //   if (response && response.data) {
  //       //     dispatch(setUser(response.data));
  //           props.navigation.replace('Home');
  //       //   }
  //       // } catch (error) {
  //       //   console.log("Error fetching user data", error);
  //       // }
  //     }
  //     setIsLoading(false); // Set loading to false after attempting to fetch data
  //   };

  //   fetchData();
  // }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [remember, setIsRemember] = React.useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checksaveCredentials()
  }, [])

  const dispatch = useDispatch()
  const checksaveCredentials = async () => {
    try {
      const saveCredentials = await AsyncStorage.getItem("saveCredentials");
      if (saveCredentials) {
        const { email, password } = JSON.parse(saveCredentials);
        setEmail(email);
        setPassword(password)
      }

    } catch (error) {
      console.log(error)
    }

  }

  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };






  const handleLogin = async () => {
    // await requestUserPermission();

    // Alert.alert('deviceToken',deviceToken)

    if (email === '') {

      ErrorMessage({
        message: translate('login.Email_is_required')
      })
      return

    } else if (!isEmailValid(email)) {

      ErrorMessage({
        message:translate('login.Invalid_email_format')
      })

      return;
    }

    if (password === '') {

      ErrorMessage({
        message:translate('login.Password_is_required')
      })

      return
    }


    const credentials = {
      email: email,
      password: password,

    }

    try {
      setIsLoading(true)

      // here check remember auth
      if (remember) {
        const saveCredentials = JSON.stringify(credentials);
        await AsyncStorage.setItem("saveCredentials", saveCredentials);

      } else {
        await AsyncStorage.removeItem("saveCredentials")

      }





      // here check login credential
      const response = await api.login(credentials);
      // console.log(response.data)
      if (response.data.status === 400) {
        setIsLoading(false)
        ErrorMessage({
          message: response.data.error
        })
      }
      else if (response.data.status === 200) {
        setIsLoading(false)
        console.log("login",response.data.data)
        // dispatch(setUser(response.data.data.user))
        const token = response.data.data.token;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", `${response.data.data.id}`);
        await AsyncStorage.setItem("LocationId", `${response.data.data.location_id}`);
        // await AsyncStorage.setItem("UserType",response.data.data.user.type)
        get_user(token)
      }

    } catch (error) {
      setIsLoading(false)
      console.log(error)
      const axioserror = error as AxiosError;
      if (axioserror.response && axioserror.response.status === 400) {

        Alert.alert(
          translate('login.Login_Failed'),
   
          translate('login.Login_Failed_MSG'),
          [
            {
              text: 'OK',
            },
          ],
          { cancelable: false }
        );
        return;
      } else {
        console.log("login error", error)
        Alert.alert(
          translate('login.Login_Failed'),
   
          translate('login.Login_Failed_MSG'),
          [
            {
              text: 'OK',
            },
          ],
          { cancelable: false }
        );
      }

    }
    // props.navigation.navigate('Dashbord');

    // console.log('form data:', { email, password })
  };
  const get_user = async (token) => {

    try {
      const response = await api.get_user(token)
      console.log("second hit", response.data)
      // if (response.data.status === 200) {
      setIsLoading(false)
      // await AsyncStorage.setItem("userId", `${response.data.user.id}`)
      // setUserData(response.data.user)
      SuccessMessage({
        message:   translate('login.Login_SUCCESS'),
      })
      //   console.log("here user data",response.data.user)
      dispatch(setUser(response.data))
      props.navigation.replace('Home');

      // }
    } catch (error) {

    }


  }


  const onPressForgotPassword = () => {
    props.navigation.navigate("ForgotPassword")
    // Alert.alert("Work going on")
  };

  // here remember me function value set function
  const handleCheckboxChange = (value: boolean) => {
    setIsRemember(value);
  };

  // for close popup modal
  const closeModal = () => {
    setModalVisible(false);
  };



  // here user  login code

  return (
    <>
      <SafeAreavView >

        <Image source={require('../../Assets/Images/logo.png')} style={styles.logo} />
        {/* <Text style={styles.title}>Sign In</Text>
                <Text style={styles.title2}>Hi! Welcome back</Text> */}
        <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>{translate('login.Email')}</Text>


          <TextInput
            style={styles.inputText}
            autoCapitalize='none'
            autoCorrect={false}
            value={email}
            placeholder={translate('login.Enter_Your_Email')}
            onChangeText={(email) => setEmail(email)} />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.textinputlabel}>Password</Text>
          <TextInput placeholder={translate('login.Enter_Your_Password')} style={styles.psswordtextinput}
            autoCapitalize='none'
            autoCorrect={false}
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)} />
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
        {/* <View style={styles.bottom}>

                    <AgreeCheckbox label="Remember me" onChange={handleCheckboxChange} />
                    <TouchableOpacity
                    style={{marginLeft:100,flex:1}}
                        onPress={onPressForgotPassword}>
                        <Text style={styles.forgotAndSignUpText}>Forgot Password?</Text>
                    </TouchableOpacity>


                </View> */}


        <TouchableOpacity
          onPress={handleLogin}
          style={styles.loginBtn}>
          <Text style={styles.loginText}>{translate('login.Sign_In')}</Text>
        </TouchableOpacity>



      </SafeAreavView>

      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }

    </>

  );
};

export default Login;

const styles = StyleSheet.create({



  title: {
    fontWeight: "500",
    fontSize: responsiveFontSize(4),
    color: "#1A1A18",
    marginBottom: responsiveHeight(2.5),
    marginTop: responsiveHeight(2.2)
  },
  inputView: {
    width: responsiveWidth(95),
    marginRight: 20,
    position: "relative",

  },
  inputText: {
     width: responsiveWidth(95),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding:  Platform.OS === 'android' ? responsiveHeight(1.5) : responsiveHeight(2.2),
        elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
        shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
        shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
        borderWidth: 1, // Adding a border for clarity on iOS
      borderColor: '#ddd', // Light border color
    //   fontSize: 16, // Font size for text input
      color: '#333', // Text color
  },
  psswordtextinput: {
    width: responsiveWidth(95),
    height: responsiveHeight(7.2),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),
    
    // Platform-specific shadows and elevation
    elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
    shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
    
    // Border and text styling
    borderWidth: 1, // Adding a border for clarity on iOS
    borderColor: '#ddd', // Light border color
    fontSize: 16, // Font size for text input
    color: '#333', // Text color

  },
  forgotAndSignUpText: {
    color: Prime_Color,
    fontSize: responsiveFontSize(2)
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
    color: "#FFF",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
  },
  ortext: {
    marginTop: responsiveHeight(2.1),
    fontSize: responsiveFontSize(2.5),
    marginBottom: responsiveHeight(2.5)

  },
  title2: {
    fontSize: responsiveFontSize(2),
    color: "#797979",
    fontWeight: "300",
    marginBottom: responsiveHeight(4.2)
  },
  submitloader: {
    flex: 1, width: "100%", height: "100%", justifyContent: "center", position: "absolute", backgroundColor: "#89898frgba(0, 0, 0, 0.5)", zIndex: 999
  },
  resettext: {
    fontSize: (responsiveFontSize(1.5))
  },
  successmsg: {
    fontSize: (responsiveFontSize(1.5)),
    color: "green",
  },
  icon: {
    // marginLeft: 10,
    position: "absolute",
    right: responsiveHeight(2),
    top: responsiveHeight(5.9)
  },
  bottom: {
    marginLeft: 30, flexDirection: "row", marginTop: responsiveHeight(1.3), width: '100%',
  },
  textinputlabel: {
    marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18"
  },
  logo: {
    // flex:1,
    width: 400,
    height: 150,
    marginTop: 30,
    resizeMode: 'contain', // Ensure the image is fully visible
    marginBottom: 20, // Add some space below the logo
  },
})