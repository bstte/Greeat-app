import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigator from './Src/Navigation/AppNavigator'
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { toastConfig } from './toastConfig';
import Toast from 'react-native-toast-message';
import store from './Src/Reducer/rootReducer';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import { I18nextProvider } from 'react-i18next';
import i18n from './Src/i18n/i18n';
const App = () => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Code to be executed after the timeout
      SplashScreen.hide();
    }, 2000);
  }, []);


  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
      
          <AppNavigator />
     
        <Toast config={toastConfig} />
      </Provider>
      </I18nextProvider>

  );
}

export default App