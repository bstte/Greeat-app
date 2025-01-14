import React from 'react';
import { Text } from 'react-native';

const DateFormatter = ({ date, time }) => {
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toLocaleDateString('en-GB'); // dd-mm-yyyy format
    
    if (time) {
      const formattedTime = dateObj.toLocaleTimeString('en-GB'); // hh:mm:ss format
      return `${formattedDate} ${formattedTime}`;
    } else {
      return formattedDate;
    }
  };

  return <Text>{formatDate(date)}</Text>;
};

export default DateFormatter;
