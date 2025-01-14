import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import SimpleHeader from '../../Component/SimpleHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import CustomTextInput from '../../Component/CustomTextInput'
import CustomDatePicker from '../../Component/CustomDatePicker'
import CustomDropdown from '../../Component/CustomDropdown'
import { fetchToken, fetchUserId } from '../Helpers/fetchDetails'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../API/api'
import { Prime_Color } from '../../Colour/Colour'
import CustomImageModal from '../../Component/CustomImageModal'
import CustomButton from '../../Component/CustomButton'
import SuccessMessage, { ErrorMessage } from '../../Component/CustomTostMessage'
import { useRoute } from '@react-navigation/native'
import Loader from '../../Component/Loader'
import { translate } from '../../i18n/Language/useTranslation'
import ImageResizer from 'react-native-image-resizer'


const AddInvoice = (props) => {
    const [Title, setTitle] = useState('');
    const [Amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [locations, setLocations] = useState([]);
    const [invoiceadddata, setinvoiceadddata] = useState({ supplier: [], dataType: [] });
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [note, setNote] = useState('');

    var date = String(new Date().getDate()).padStart(2, '0'); // Ensures the day is two digits
    var month = String(new Date().getMonth() + 1).padStart(2, '0'); // Ensures the month is two digits
    var year = new Date().getFullYear(); // Year is already four digits
    const currentDate = `${year}/${month}/${date}`;

    const [RepairDate, setRepairDate] = useState(currentDate);

    const route = useRoute();
    useEffect(() => {
        getinvoiceData();
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
    const formatDate = (dateString) => {
        // console.log(dateString)
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split('/');

        // Reformat to 'DD/MM/YY'
        return `${day}/${month}/${year}`;
    };

    const getinvoiceData = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.Addinvoicedata(token);
                setinvoiceadddata(response.data.data || { supplier: [], dataType: [] });
            } catch (error) {
                console.log("get invoice data error:", error);
            }
        }
    };

    const status = [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" }
    ];

    const handleonpresstartdata = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };


    function handleChangestartdate(propData) {
        // Alert.alert(propData);
        console.log("date", propData)
        setRepairDate(propData)
        setOpenStartDatePicker(!openStartDatePicker);
    }


    const handleImageModalVisible = () => {
        setImageModalVisible(!isImageModalVisible);
    };

    function handleLocation(item) {
        setSelectedLocation(item.value);
    }

    function handleDoctype(item) {
        setSelectedDocumentType(item.value);
    }

    function handlesupplier(item) {
        setSelectedSupplier(item.value);
    }

    function handlestatus(item) {
        setSelectedStatus(item.value);
    }

    const handelImage = async (item) => {
        console.log("item", item);
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

            console.log(`Resizing to: ${targetWidth}x${targetHeight}`);

            // Resize the image
            resizedImage = await ImageResizer.createResizedImage(
                item.path,
                targetWidth,
                targetHeight,
                'JPEG',
                90 // Compression quality (90% recommended for good quality)
            );

            console.log("Resized image:", resizedImage);
        } catch (error) {
            console.error('Image resizing error:', error);
            return; // Exit if resizing fails
        }

        const imageType = resizedImage.mime || 'image/jpeg'; // Default to 'image/jpeg' if mime type

        // Set the resized image with additional type info
        setSelectedImage({ ...resizedImage, type: imageType });

        handleImageModalVisible();
    };


    const handleform = async () => {
        if (!Title || Title.trim() === '') {
            // Alert.alert('Error', 'Title is required');
            // return;
            ErrorMessage({
                message: translate('AddInvoice.Document_required')
            });
            return;
        }

        if (!selectedLocation) {
            // Alert.alert('Error', 'Location is required');
            // return;
            ErrorMessage({

                message: translate('AddInvoice.Location_required')
            });
            return;
        }

        if (!Amount || Amount.trim() === '') {
            // Alert.alert('Error', 'Amount is required');
            // return;
            ErrorMessage({

                message: translate('AddInvoice.Amount_required')
            });
            return;
        }

        if (!selectedSupplier) {

            ErrorMessage({

                message: translate('AddInvoice.Supplier_required')
            });
            return;
        }

        if (!selectedDocumentType) {
          
            ErrorMessage({

                message: translate('AddInvoice.Document_Type_required')
            });
            return;
        }
    
        if (!selectedImage) {
            ErrorMessage({
                message: translate('AddInvoice.Photo_required')
            });
            return;
        }
        const formData = new FormData();
        formData.append('location_id', selectedLocation);
        formData.append('document_type_id', selectedDocumentType);
        formData.append('supplier_id', selectedSupplier);
        formData.append('amount', Amount);
        formData.append('date', RepairDate);
        formData.append('title', Title);
        formData.append('note', note);

        // formData.append('status', selectedStatus);

        if (selectedImage) {
            formData.append('file', {
                uri: selectedImage.uri,
                name: selectedImage.uri.split('/').pop(),
                type: selectedImage.type
            });
        }

        console.log(formData)

        setIsLoading(true)
        const token = await fetchToken();
        const UserId = await fetchUserId();
        if (token && UserId) {
            try {
                const response = await api.submitInvoice(token, parseInt(UserId), formData);
                if (response.data.status === 200) {
                    setIsLoading(false)
                    SuccessMessage({
                        message: response.data.message
                    });
                    // Pass the new invoice data back to the previous screen
                    props.navigation.navigate(translate('Invoice.Drawer_Title'), { newInvoice: response.data.data });
                } else {
                    console.error('Form submission error:', response.data.message);
                    Alert.alert('Error', response.data.message);
                }
            } catch (error) {
                setIsLoading(false)
                console.error('Error submitting form:', error);
                Alert.alert('Error', 'Failed to submit form');
            }
        } else {
            console.error('Token or UserId is null');
            Alert.alert('Error', 'Unable to retrieve token or User ID');
        }

    };



    return (
        <SafeAreaView style={styles.container}>
            <SimpleHeader props={props} title={translate('AddInvoice.Add_Invoice')} />
            <ScrollView style={styles.textinputcontainer} keyboardShouldPersistTaps='handled'>
                <CustomTextInput
                    title={translate('AddInvoice.Document_Number')}
                    value={Title}
                    placeholder={translate('AddInvoice.Enter_Document_Number')}
                    onChangeText={(Title) => setTitle(Title)}
                    required={true}
                />

                <View style={styles.inputView}>
                    <Text style={styles.textinputlabel}>{translate('AddInvoice.Date')} <Text style={{ color: "red" }}>*</Text></Text>
                    <TouchableOpacity
                        style={styles.inputText}
                        onPress={handleonpresstartdata}
                    >
                        <Text style={styles.datetext}>
                            {RepairDate ? formatDate(RepairDate) : translate('AddInvoice.Select_Date')}
                        </Text>


                    </TouchableOpacity>
                </View>

                <CustomDropdown
                    data={locations.map(loc => ({ label: loc.location, value: loc.id.toString() }))}
                    placeholder={translate('AddInvoice.Select_Location')}
                    title={translate('AddInvoice.Location')}
                    onSelect={handleLocation}
                    required={true}
                />

                <CustomTextInput
                    title={translate('AddInvoice.Amount')}
                    value={Amount}
                    placeholder={translate('AddInvoice.Enter_Amount')}
                    keyboardTypevalue='numeric'
                    onChangeText={(Amount) => setAmount(Amount)}
                    required={true}
                />

                {invoiceadddata.dataType && (
                    <CustomDropdown
                        data={invoiceadddata.dataType.map((dataType) => ({ label: dataType.document_type, value: dataType.id }))}
                        placeholder={translate('AddInvoice.Select_Document_Type')}
                        title={translate('AddInvoice.Document_Type')}
                        onSelect={handleDoctype}
                        required={true}
                    />
                )}

                {invoiceadddata.supplier && (
                    <CustomDropdown
                        data={invoiceadddata.supplier.map((supplier) => ({ label: supplier.name, value: supplier.id }))}
                        placeholder={translate('AddInvoice.Select_Supplier')}
                        title={translate('AddInvoice.Supplier')}
                        onSelect={handlesupplier}
                        required={true}
                    />
                )}

               

                <Text style={styles.textinputlabel}>{translate('AddInvoice.Attach_Photo_Documento')} <Text style={{ color: "red" }}>*</Text></Text>
                <TouchableOpacity onPress={handleImageModalVisible} style={styles.ImageContainer}>
                    <Text style={{ fontSize: 17, color: "#333" }}>{translate('AddInvoice.Photo')}</Text>
                    <Icon color={Prime_Color} name="camera" size={responsiveHeight(4)} />
                </TouchableOpacity>
                {selectedImage && (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={styles.imagePreview}
                        />
                        <Text>{selectedImage.mime}</Text>
                    </View>
                )}

                <CustomTextInput
                    title={translate('Closer.AddCloser.Note')}
                    value={note}
                    placeholder={translate('Closer.AddCloser.Enter_Note')}
                    onChangeText={(text) => setNote(text)}
                    required={false}

                />

                <CustomButton title={translate('AddInvoice.Submit_Invoice')} handleform={handleform} />
            </ScrollView>

            <CustomDatePicker visible={openStartDatePicker} selectedDate={RepairDate} onClose={handleChangestartdate} />
            <CustomImageModal
                togglevisible={isImageModalVisible}
                onclose={handleImageModalVisible}
                multipleImage={false}
                handelImage={(item) => handelImage(item)}
            />
            {
                isLoading ? (
                    <Loader Loading={isLoading} />
                ) : null
            }
        </SafeAreaView>
    );
};

export default AddInvoice;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
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