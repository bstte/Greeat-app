import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ImageBackground, FlatList, BackHandler, RefreshControl } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Prime_Color } from '../../Colour/Colour';
import api from '../../API/api';
import DrawerComponent from '../../Component/DrawerComponent';
import { LocationId, fetchToken, fetchUserId } from '../Helpers/fetchDetails';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment'; // Install moment.js for date formatting
import Loader from '../../Component/Loader';
import { translate } from '../../i18n/Language/useTranslation';



const Dashboard = (props) => {
  const [isPunchedIn, setIsPunchedIn] = useState(false); // True if punched in, false if punched out
  const [punchState, setPunchState] = useState(1); // 1 = Punch In, 2 = Punch Out
  const [data, setData] = useState('');
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [getScheduleDate, setgetScheduleDate] = useState();
  const [checklistData, setChecklistData] = useState([]);
  const [Notice, setNotice] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  };
  const [internalDate, setInternalDate] = useState(getTodayDate());





  const getPunchState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = userData?.id || '';

      if (token && userId) {
        const response = await api.getpunchdata(token, userId);
        console.log("fetch respone data punch ",response.data)

      if (response?.data?.data?.punch_out===null) {
    
        setIsPunchedIn(true);
      } else if (response?.data?.data?.punch_out) {
  
        setIsPunchedIn(false);
      } else {
    
        setIsPunchedIn(false);
      }
      }
    } catch (error) {
      console.error('Error fetching punch state:', error);
      setPunchState(1); // Default to Punch In in case of error
    }
  };


  useEffect(() => {

    getPunchState();
    getSchedule();
    getNotice();
    getCalendar(internalDate);

  }, []);

  useEffect(() => {
    getCalendar(internalDate);
  }, [internalDate]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isScannerVisible) {
        setScannerVisible(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isScannerVisible]);



  const onSuccess = async (e) => {
    const scannedData = e.data.trim(); // Trim any extra spaces
    const [scannedDate, scannedTime] = scannedData.split(' ');

    const formattedDate = moment(scannedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');


    setData(scannedData);
      
    const punchType = isPunchedIn ? 'out' : 'in';


    await savePunchData(formattedDate, scannedTime, punchType);
  };

  const handlePunchIn = () => {
    setScannerVisible(!isScannerVisible);
  };

  const handlePunchOut = () => {
    setScannerVisible(!isScannerVisible);
  };

  const getCalendar = async (date) => {
    const token = await fetchToken();

    if (token) {
      try {
        const response = await api.getcalender(token, date);
        console.log("Calendar", response.data.data)
        setChecklistData(response.data.data);
      } catch (error) {
        console.error('Calendar error:', error);
      }
    }
  };

  const getNotice = async () => {
    const token = await fetchToken();


    if (token) {
      try {
        setIsLoading(true)
        const response = await api.notice(token);
        //  console.log(response.data)
        setNotice(response.data.data)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error('notice error:', error);
      }
    }
  }

  const getSchedule = async () => {
    const token = await fetchToken();


    if (token) {

      try {
        const response = await api.getevent(token);
        setgetScheduleDate(response.data.data)

      } catch (error) {
        console.error('getSchedule error:', error);
      }
    }
  }


  const refreshdata = () => {
    getSchedule();
    getNotice();
    getPunchState();
    getCalendar(internalDate);
  }
  const savePunchData = async (date, time, punchType) => {
    try {
      const userId = userData?.id || '';
      const punch = punchType === 'in' ? 1 : 2;
      const token = await AsyncStorage.getItem('token');
      const credential = {
        user_id: userId,
        date: date,
        time: time,
        punch: punch,
      };

      if (token) {
        const response = await api.SavedPunchData(token, credential);
       console.log("respone punch ",response.data)
  
       if(response?.data?.status===200){
        getPunchState()
       }
  
        const message = punchType === 'in' ? translate('dashboard.Punch_In_Success') : translate('dashboard.Punch_Out_Success');
        Alert.alert('Success', message, [{ text: 'OK', onPress: () => setScannerVisible(false) }]);
      }
    } catch (error) {
      Alert.alert(translate('dashboard.Invalid_QR_title'), translate('dashboard.Invalid_QR_MSG'), [{ text: 'OK', onPress: () => setScannerVisible(false) }]);
      console.error('Failed to save punch data:', error);
      
        console.error('Error response:', error);
      
    }
  };
  const italianDaysOfWeek = {
    Monday: 'Lunedì',
    Tuesday: 'Martedì',
    Wednesday: 'Mercoledì',
    Thursday: 'Giovedì',
    Friday: 'Venerdì',
    Saturday: 'Sabato',
    Sunday: 'Domenica'
  };

  const formatDayOfWeek = (dateString) => {
    const dayInEnglish = moment(dateString).format('dddd'); // Get the day of the week in English
    return italianDaysOfWeek[dayInEnglish]; // Return the corresponding Italian day
  };

  const formatTime = (timeString) => {
    // console.log("timestring",timeString)
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={[styles.checklistTitle, { marginBottom: 15 }]}>{translate('dashboard.Your_next_shift')}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.cardLabel}>{formatDate(item.date)}</Text>
        <Text style={[styles.cardLabel, { marginBottom: 10 }]}>{formatDayOfWeek(item.date)} </Text>

        <Text style={styles.cardLabel}>{formatTime(item.start_time)} - {formatTime(item.end_time)}</Text>




      </View>
    </View>
  );

  const renderCalendarItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.cardLabel}>{item.text}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => props.navigation.navigate("Task", { ShopId: item.id, title: item.text, date: internalDate })}
        >
          <Text style={styles.viewButtonText}>{translate('dashboard.View')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const formatDate = (dateString) => {
    // console.log(dateString)
    // Split the date string (assuming it's in 'YYYY/MM/DD' format)
    const [year, month, day] = dateString.split(/[/\-]/);

    // Reformat to 'DD/MM/YY'
    return `${day}/${month}/${year}`;
  };



  const renderNoticeItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.cardLabel, { justifyContent: "center", alignSelf: "center", textAlign: "justify" }]}>{item.notice} ({formatDate(item.date)} - {item.time})</Text>
    </View>
  );


  const handleDateChange = (date) => {
    setInternalDate(date);
  };

  const renderHeader = () => (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.punchButton,
            isPunchedIn ? styles.inactiveButton : styles.activeButton,
          ]}
          onPress={handlePunchIn}
          disabled={isPunchedIn}
        >
          <Text style={styles.buttonText}>{translate('dashboard.Punch_In')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.punchButton,
            isPunchedIn ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handlePunchOut}
          disabled={!isPunchedIn}
        >
          <Text style={styles.buttonText}>{translate('dashboard.Punch_Out')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <>
      <View style={[styles.checklistContainer, { marginTop: 10 }]}>
        <Text style={styles.checklistTitle}>{translate('dashboard.What_Happens')}</Text>

        <FlatList
          data={Notice}
          renderItem={renderNoticeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ backgroundColor: 'white', paddingBottom: 20 }}
        />
      </View>
      <View style={styles.calendarContainer}>
        <DatePicker
          mode="calendar"
          selected={internalDate}
          onDateChange={handleDateChange}
          onSelectedChange={handleDateChange}
          options={{
            backgroundColor: '#ffffff',
            textHeaderColor: Prime_Color,
            textDefaultColor: '#000000',
            selectedTextColor: '#fff',
            mainColor: Prime_Color,
            textSecondaryColor: Prime_Color,
            borderColor: 'rgba(122, 146, 165, 0.1)',
          }}
        />
      </View>
      <View style={styles.checklistContainer}>
        <Text style={styles.checklistTitle}>{translate('dashboard.Check_List')}</Text>

        <FlatList
          data={checklistData}
          renderItem={renderCalendarItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ backgroundColor: 'white', paddingBottom: 20 }}
        />

      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Greeat V=3.3</Text>
      </View>
    </>

  );
  const getScheduleData = getScheduleDate ? [
    { id: 1, date: getScheduleDate.date, start_time: getScheduleDate.start_time, end_time: getScheduleDate.end_time },
  ] : [];


  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../Assets/Images/background_image.jpeg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <DrawerComponent props={props} title={'Dashboard'} color={'white'} onRefresh={refreshdata} />

        <FlatList
          data={getScheduleData}
          refreshControl={<RefreshControl refreshing={IsLoading} onRefresh={() => refreshdata()} />}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.flatListContent}
        />
        {isScannerVisible && (
          <QRCodeScanner
            onRead={onSuccess}
            containerStyle={styles.qrScanner}
            showMarker={true}

          />
        )}
        {/* )} */}
      </ImageBackground>
      {
        IsLoading ? (
          <Loader Loading={IsLoading} />
        ) : null
      }
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  itemContainer: {
    padding: responsiveWidth(4),
    marginVertical: responsiveHeight(0.5),
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure space between text and button
  },
  rowContainer: {
    flex: 1, // Ensure it takes all available space
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: responsiveFontSize(2),
    color: Prime_Color,
    fontWeight: 'bold',
    flex: 1, // Allow the text to take available space and wrap
    flexWrap: 'wrap', // Allow text to wrap

  },
  viewButton: {
    backgroundColor: Prime_Color,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 10,
    minWidth: responsiveWidth(20), // Ensure button has a minimum width
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: responsiveFontSize(1.8),
    color: '#FFF',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(2),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginVertical: responsiveHeight(1),
  },

  cardValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginTop: responsiveHeight(0.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(2),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  punchButton: {
    flex: 1,
    paddingVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Prime_Color,
  },
  inactiveButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    color: '#FFF',
    fontWeight: 'bold',
  },
  checklistContainer: {

    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginVertical: responsiveHeight(1),
  },
  checklistTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: Prime_Color,
  },


  textContainer: {
    flex: 1,
    marginRight: responsiveWidth(2), // Space between text and button
  },

  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: responsiveWidth(4),
    marginVertical: responsiveHeight(2),
  },
  qrScanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
