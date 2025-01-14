import Toast from 'react-native-toast-message';

export const SuccessMessage = ({ message }) => {
  Toast.show({
    type: "success",
    text1: message,
    autoHide: true,
    visibilityTime: 2000,
  });
};

export const ErrorMessage = ({ message }) => { // Destructure the message from props
  Toast.show({
    type: "error",
    text1: message, // Use the message directly
    autoHide: true,
    visibilityTime: 2000,
  });
};


export default SuccessMessage;