import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SimpleHeader from '../../Component/SimpleHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Component/CustomTextInput';
import CustomDropdown from '../../Component/CustomDropdown';
import { fetchToken } from '../Helpers/fetchDetails';
import api from '../../API/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDatePicker from '../../Component/CustomDatePicker';
import { Prime_Color } from '../../Colour/Colour';
import CustomImageModal from '../../Component/CustomImageModal';
import CustomButton from '../../Component/CustomButton';
import SuccessMessage, { ErrorMessage } from '../../Component/CustomTostMessage';
import Loader from '../../Component/Loader';
import { translate } from '../../i18n/Language/useTranslation';

import ImageResizer from 'react-native-image-resizer';


const AddCloser = (props) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [dropdowsiftid, setdropdownsiftId] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [darkImage, setDarkImage] = useState(null);
  const [posImage, setPosImage] = useState(null);
  const [fiscalImage, setFiscalImage] = useState(null);
  const [ticketImage, setTicketImage] = useState(null);
  const [fondo_cassa, setfondo_cassa] = useState('');
  const [monete, setmonete] = useState('');
  const [versato, setversato] = useState('');

  var date = String(new Date().getDate()).padStart(2, '0'); // Ensures the day is two digits
  var month = String(new Date().getMonth() + 1).padStart(2, '0'); // Ensures the month is two digits
  var year = new Date().getFullYear(); // Year is already four digits
  const currentDate = `${year}/${month}/${date}`;
  const [RepairDate, setRepairDate] = useState(currentDate);
  const [note, setNote] = useState('');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const token = await fetchToken();
    if (token) {
      try {
        const response = await api.location(token);
        setLocations(response.data.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    } else {
      console.error('Token is null');
    }
  };



  function handleLocation(item) {
    setSelectedLocation(item.value);
  }

  const status = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];

  function handleShift(item) {
    setdropdownsiftId(item.value);
  }

  const handleonpresstartdata = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const Shiftdata = [
    { label: translate('Closer.AddCloser.Breakfast'), value: 0 },
    { label: translate('Closer.AddCloser.Dinner'), value: 2 },
  ];

  function handleChangestartdate(propData) {

    setRepairDate(propData)

    setOpenStartDatePicker(!openStartDatePicker);
  }



  const handleImageModalVisible = (imageType) => {
    setSelectedImageType(imageType);
    setImageModalVisible(!isImageModalVisible);
  };

  const handelImage = async (item) => {
    // console.log("item", item);
    let resizedImage;

    try {
      // Original image dimensions
      const originalWidth = item.width;
      const originalHeight = item.height;

      // Set a maximum width and height for resizing
      const maxWidth = 1100; // Maximum desired width
      const maxHeight = 1100; // Maximum desired height

      // Calculate the target dimensions while maintaining the aspect ratio
      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        if (originalWidth > originalHeight) {
          targetWidth = maxWidth;
          targetHeight = Math.round((maxWidth / originalWidth) * originalHeight);
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round((maxHeight / originalHeight) * originalWidth);
        }
      }

      // console.log(`Resizing to: ${targetWidth}x${targetHeight}`);

      // Resize the image
      resizedImage = await ImageResizer.createResizedImage(
        item.path,
        targetWidth,
        targetHeight,
        'JPEG',
        90 // Compression quality (90% recommended for good quality)
      );

      // console.log("Resized image:", resizedImage);
    } catch (error) {
      console.error('Image resizing error:', error);
      return; // Exit if resizing fails
    }

    console.log("Resize image", resizedImage);

    const imageType = resizedImage.mime || 'image/jpeg'; // Default to 'image/jpeg' if mime type is not available

    switch (selectedImageType) {
      case 'dark':
        setDarkImage({ ...resizedImage, type: imageType }); // Add type to the object
        break;
      case 'pos':
        setPosImage({ ...resizedImage, type: imageType });
        break;
      case 'fiscal':
        setFiscalImage({ ...resizedImage, type: imageType });
        break;
      case 'ticket':
        setTicketImage({ ...resizedImage, type: imageType });
        break;
      default:
        break;
    }
    setImageModalVisible(false);
  };



  const handleform = async () => {
    const token = await fetchToken();
    if (selectedLocation === null) {
      ErrorMessage({
        message: translate('Closer.AddCloser.Location_required')
      });
      return;
    }



    if (dropdowsiftid === null) {
      ErrorMessage({

        message: translate('Closer.AddCloser.Shift_required')
      });
      return;
    }



    if (darkImage === null) {
      ErrorMessage({

        message: translate('Closer.AddCloser.Dark_required')
      });
      return;
    }

    if (fondo_cassa === '') {
      ErrorMessage({

        message: translate('Closer.AddCloser.Fondo_Cassa_required')
      });
      return;
    }

    if (monete === '') {
      ErrorMessage({

        message: translate('Closer.AddCloser.Monete_required')
      });
      return;
    }


    if (versato === '') {
      ErrorMessage({

        message: translate('Closer.AddCloser.Versato_required')
      });
      return;
    }

    setIsLoading(true)

    const formData = new FormData();
    formData.append('location_id', selectedLocation);
    formData.append('date', RepairDate);
    formData.append('shift', dropdowsiftid);

    formData.append('fondo_cassa', fondo_cassa);
    formData.append('monete', monete);
    formData.append('versato', versato);
    formData.append('notice', note);

    if (darkImage) {
      formData.append('dark', {
        uri: darkImage.uri,
        name: 'dark.jpg',
        type: darkImage.type,
      });
    }

    if (posImage) {
      formData.append('pos', {
        uri: posImage.uri,
        name: 'pos.jpg',
        type: posImage.type,
      });
    }

    if (fiscalImage) {
      formData.append('fiscal', {
        uri: fiscalImage.uri,
        name: 'fiscal.jpg',
        type: fiscalImage.type,
      });
    }

    if (ticketImage) {
      formData.append('ticket', {
        uri: ticketImage.uri,
        name: 'ticket.jpg',
        type: ticketImage.type,
      });
    }
    if (token) {
      try {
        const response = await api.submitcloser(token, formData)
        if (response.data.status) {
          SuccessMessage({
            message: response.data.message
          });
          setIsLoading(false)
          props.navigation.navigate(translate('Closer.title'), { newCloser: response.data.data });
        }
           

      } catch (error) {
        setIsLoading(false)

        console.error("add closer issue:", error)
        Alert.alert('Error', 'Something went wrong');
      }

    } else {
      console.error('Token is null');
    }
  };
  const formatDate = (dateString) => {

    const [year, month, day] = dateString.split('/');

    // Reformat to 'DD/MM/YY'
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SimpleHeader props={props} title={translate('Closer.AddCloser.Add_Closer')} />
      <ScrollView style={styles.textinputcontainer} keyboardShouldPersistTaps='handled'>

        <CustomDropdown
          data={locations.map(loc => ({ label: loc.location, value: loc.id.toString() }))}
          placeholder={translate('Closer.AddCloser.Select_Location')}
          title={translate('Closer.AddCloser.Location')}
          onSelect={handleLocation}
          required={true}
        />

        <View style={styles.inputView}>
          <Text style={styles.textinputlabel}>{translate('Closer.AddCloser.Date')} <Text style={{ color: "red" }}>*</Text></Text>
          <TouchableOpacity
            style={styles.inputText}
            onPress={handleonpresstartdata}
          >
            <Text style={styles.datetext}>{formatDate(RepairDate) || "Select Date"}</Text>
          </TouchableOpacity>
        </View>

        <CustomDropdown
          data={Shiftdata.map(Shiftdata => ({ label: Shiftdata.label, value: Shiftdata.value }))}
          placeholder={translate('Closer.AddCloser.Select_Shift')}
          title={translate('Closer.AddCloser.Shift')}
          onSelect={handleShift}
          required={true}
        />


        {/* Dark Section */}


        <Text style={styles.textinputlabel}>{translate('Closer.AddCloser.Dark')} <Text style={{ color: "red" }}>*</Text></Text>

        <TouchableOpacity onPress={() => handleImageModalVisible('dark')} style={styles.ImageContainer}>
          <Text style={{ fontSize: 17, color: "#333" }}>{translate('Closer.AddCloser.Dark')}</Text>
          <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
        </TouchableOpacity>



        {darkImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: darkImage.uri }}
              style={styles.imagePreview}
            />
            <Text>{darkImage.type}</Text>
          </View>
        )}


        {/* Pos Section */}
        <Text style={styles.textinputlabel}>{translate('Closer.AddCloser.Pos')}</Text>
        <TouchableOpacity onPress={() => handleImageModalVisible('pos')} style={styles.ImageContainer}>
          <Text style={{ fontSize: 17, color: "#333" }}>{translate('Closer.AddCloser.Pos')}</Text>
          <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
        </TouchableOpacity>
        {posImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: posImage.uri }}
              style={styles.imagePreview}
            />
            <Text>{posImage.type}</Text>
          </View>
        )}

        {/* Fiscal Section */}
        <Text style={styles.textinputlabel}>{translate('Closer.AddCloser.Fiscal')}</Text>
        <TouchableOpacity onPress={() => handleImageModalVisible('fiscal')} style={styles.ImageContainer}>
          <Text style={{ fontSize: 17, color: "#333" }}>{translate('Closer.AddCloser.Fiscal')}</Text>
          <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
        </TouchableOpacity>
        {fiscalImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: fiscalImage.uri }}
              style={styles.imagePreview}
            />
            <Text>{fiscalImage.type}</Text>
          </View>
        )}


        {/* Ticket Section */}
        <Text style={styles.textinputlabel}>{translate('Closer.AddCloser.Ticket')}</Text>
        <TouchableOpacity onPress={() => handleImageModalVisible('ticket')} style={styles.ImageContainer}>
          <Text style={{ fontSize: 17, color: "#333" }}>{translate('Closer.AddCloser.Ticket')}</Text>
          <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
        </TouchableOpacity>
        {ticketImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: ticketImage.uri }}
              style={styles.imagePreview}
            />
            <Text>{ticketImage.type}</Text>
          </View>
        )}
        <CustomTextInput
          title={translate('Closer.AddCloser.Fondo_Cassa')}
          value={fondo_cassa}
          placeholder={translate('Closer.AddCloser.Enter_Fondo_Cassa')}
          onChangeText={(fondo_cassa) => setfondo_cassa(fondo_cassa)}
          required={true}
          keyboardTypevalue='numeric'
        />

        <CustomTextInput
          title={translate('Closer.AddCloser.Monete')}
          value={monete}
          placeholder={translate('Closer.AddCloser.Enter_Monete')}
          onChangeText={(Monete) => setmonete(Monete)}
          required={true}
          keyboardTypevalue='numeric'
        />

        <CustomTextInput
          title={translate('Closer.AddCloser.Versato')}
          value={versato}
          placeholder={translate('Closer.AddCloser.Enter_Versato')}
          onChangeText={(Versato) => setversato(Versato)}
          required={true}
          keyboardTypevalue='numeric'
        />

        <CustomTextInput
          title={translate('Closer.AddCloser.Note')}
          value={note}
          placeholder={translate('Closer.AddCloser.Enter_Note')}
          onChangeText={(text) => setNote(text)}
          required={false}

        />

        <CustomButton title={translate('Closer.AddCloser.Submit_Closer')} handleform={handleform} />

      </ScrollView>
      <CustomDatePicker visible={openStartDatePicker} selectedDate={RepairDate} onClose={handleChangestartdate} />
      {isImageModalVisible && (
        <CustomImageModal
          togglevisible={isImageModalVisible}
          onclose={handleImageModalVisible}
          multipleImage={false}
          handelImage={(item) => handelImage(item)}
        />
      )}

      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }
    </SafeAreaView>
  );
};

export default AddCloser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textinputcontainer: {
    marginTop: responsiveHeight(2)
  },
  inputView: {
    width: responsiveWidth(95),
    marginRight: responsiveHeight(2),
    position: "relative",

  },
  textinputlabel: {
    marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18"
  },
  inputText: {
    width: responsiveWidth(95),
    height: responsiveHeight(7),

    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),

    elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
    shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
    borderWidth: 1, // Adding a border for clarity on iOS
    borderColor: '#ddd', // Light border color
    // fontSize: 16, // Font size for text input
    color: '#333', // Text color

  },
  datetext: {
    marginTop: responsiveHeight(1)
  },
  ImageContainer: {
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.3),
    paddingLeft: responsiveHeight(1.7),
    borderWidth: 1,
    borderColor: "#797979",
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imagePreviewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
})