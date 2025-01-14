import {BaseToast, ErrorToast} from 'react-native-toast-message';
import { Prime_Color } from './Src/Colour/Colour';


export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{height: 50, borderLeftWidth: 10, borderLeftColor: Prime_Color}}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};
