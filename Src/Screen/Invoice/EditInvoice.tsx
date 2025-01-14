import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import SimpleHeader from '../../Component/SimpleHeader';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Component/CustomTextInput';
import CustomDatePicker from '../../Component/CustomDatePicker';
import CustomEditDropdown from '../../Component/CustomEditDropdown';
import { fetchToken } from '../Helpers/fetchDetails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api, { Image_Base_Url } from '../../API/api';
import { Prime_Color } from '../../Colour/Colour';
import CustomImageModal from '../../Component/CustomImageModal';
import CustomButton from '../../Component/CustomButton';
import SuccessMessage from '../../Component/CustomTostMessage';
import { useRoute } from '@react-navigation/native';
import Loader from '../../Component/Loader';


const EditInvoice = (props) => {
    const route = useRoute();
    const { invoice } = route.params;
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [Title, setTitle] = useState(invoice.title || '');
    const [Amount, setAmount] = useState(invoice.amount || '');
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [locations, setLocations] = useState([]);
    const [invoiceadddata, setinvoiceadddata] = useState({ supplier: [], dataType: [] });
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(invoice.document ? { path: `${Image_Base_Url}/invoice/${invoice.document}`, mime: 'image/jpeg' } : null);
    const [selectedLocation, setSelectedLocation] = useState(invoice.location_id);
    const [selectedDocumentType, setSelectedDocumentType] = useState(invoice.document_type_id);
    const [selectedSupplier, setSelectedSupplier] = useState(invoice.supplier_id);
    const [selectedStatus, setSelectedStatus] = useState(invoice.status);

    const [originalLocation, setOriginalLocation] = useState(invoice.location_id);
    const [originalDocumentType, setOriginalDocumentType] = useState(invoice.document_type_id);
    const [originalSupplier, setOriginalSupplier] = useState(invoice.supplier_id);
    const [originalStatus, setOriginalStatus] = useState(invoice.status);

    const [RepairDate, setRepairDate] = useState(invoice.date);
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
        setSelectedImage(item);
        handleImageModalVisible();
    };

    const handleUpdateInvoice = async () => {
        if (!Title.trim()) {
            Alert.alert('Validation Error', 'Please enter a document number.');
            return;
        }
        if (!Amount.trim()) {
            Alert.alert('Validation Error', 'Please enter an amount.');
            return;
        }
        if (!selectedLocation) {
            Alert.alert('Validation Error', 'Please select a location.');
            return;
        }
        if (!selectedDocumentType) {
            Alert.alert('Validation Error', 'Please select a document type.');
            return;
        }
        if (!selectedSupplier) {
            Alert.alert('Validation Error', 'Please select a supplier.');
            return;
        }
        if (!selectedStatus) {
            Alert.alert('Validation Error', 'Please select a status.');
            return;
        }
        
        const formData = new FormData();
        formData.append('title', Title);
        formData.append('amount', Amount);
        formData.append('date', RepairDate);

        if (selectedLocation !== originalLocation) {
            formData.append('location_id', selectedLocation);
        }
        if (selectedDocumentType !== originalDocumentType) {
            formData.append('document_type_id', selectedDocumentType);
        }
        if (selectedSupplier !== originalSupplier) {
            formData.append('supplier_id', selectedSupplier);
        }
        // if (selectedStatus !== originalStatus) {
        //     formData.append('status', selectedStatus);
        // }

        if (selectedImage && selectedImage.path !== `${Image_Base_Url}/invoice/${invoice.document}`) {
            formData.append('file', {
                uri: selectedImage.path,
                name: selectedImage.path.split('/').pop(),
                type: selectedImage.mime
            });
        }

        console.log("form data",formData)
    
            setIsLoading(true)
            const token = await fetchToken();
            const invoiceId=await invoice?invoice.id:'';
            console.log("invoiceId",invoiceId)
            if (token && invoiceId) {
                try {
                    console.log(invoice)
                const response = await api.updateInvoice(token, invoiceId, formData);
                if (response.data.status === 200) {
                    setIsLoading(false)
                    console.log(response.data.data)
                    SuccessMessage({
                        message: response.data.message
                    });
                    props.navigation.navigate('  Invoice', { updatedInvoice: response.data.data });
                } else {
                    Alert.alert('Error', response.data.message);
                }
            } catch (error) {
                setIsLoading(false)
                console.error(error)
                Alert.alert('Error', 'Failed to update invoice');
            }
            } else {
                Alert.alert('Error', 'Unable to retrieve token');
            }
     
    };

    const formatDate = (dateString) => {
        // console.log(dateString)
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split(/[/\-]/);
    
        // Reformat to 'DD/MM/YY'
        return `${day}/${month}/${year}`;
    };
    return (
        <SafeAreaView style={styles.container}>
            <SimpleHeader props={props} title='Edit Invoice' />
            <ScrollView style={styles.textinputcontainer} keyboardShouldPersistTaps='handled'>
                <CustomTextInput
                    title='Document Number'
                    value={Title}
                    placeholder='Enter Document Number'
                    onChangeText={(Title) => setTitle(Title)}
                    required={true}
                />

                <View style={styles.inputView}>
                    <Text style={styles.textinputlabel}>Date <Text style={{color:"red"}}>*</Text></Text>
                    <TouchableOpacity style={styles.inputText} onPress={handleonpresstartdata}>
                        <Text style={styles.datetext}>{formatDate(RepairDate) || "Select Date"}</Text>
                    </TouchableOpacity>
                </View>

                <CustomEditDropdown
                    data={locations.map(loc => ({ label: loc.location, value: loc.id.toString() }))}
                    placeholder='Select Location'
                    title='Location'
                    selectedValue={selectedLocation}
                    onSelect={handleLocation}
                    required={true}
                />

                <CustomTextInput
                    title='Amount'
                    value={Amount}
                    placeholder='Enter Amount'
                    keyboardTypevalue='numeric'
                    onChangeText={(Amount) => setAmount(Amount)}
                    required={true}
                />

                {invoiceadddata.dataType && (
                    <CustomEditDropdown
                        data={invoiceadddata.dataType.map((dataType) => ({ label: dataType.document_type, value: dataType.id }))}
                        placeholder='Select Document Type'
                        title='Document Type'
                        selectedValue={selectedDocumentType}
                        onSelect={handleDoctype}
                        required={true}
                    />
                )}

                {invoiceadddata.supplier && (
                    <CustomEditDropdown
                        data={invoiceadddata.supplier.map((supplier) => ({ label: supplier.name, value: supplier.id }))}
                        placeholder='Select Supplier'
                        title='Supplier'
                        selectedValue={selectedSupplier}
                        onSelect={handlesupplier}
                        required={true}
                    />
                )}

                {/* <CustomEditDropdown
                    data={status}
                    placeholder='Select Status'
                    title='Status'
                    selectedValue={selectedStatus.toString()==="1"?"Active":"Inactive"}
                    onSelect={handlestatus}
                    required={true}
                /> */}

                <View style={styles.inputView}>
                    <Text style={styles.textinputlabel}>Upload Document</Text>
                    <TouchableOpacity style={styles.uploadview} onPress={handleImageModalVisible}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage.path }} style={styles.uploadedImage} />
                        ) : (
                            <Icon name='file-upload-outline' size={responsiveFontSize(4)} />
                        )}
                    </TouchableOpacity>
                </View>
                <CustomDatePicker visible={openStartDatePicker} selectedDate={RepairDate} onClose={handleChangestartdate} />
                <CustomButton title='Update Invoice' handleform={handleUpdateInvoice} />
            </ScrollView>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    uploadview: {
        
        // alignItems: 'center',
        // justifyContent: 'center',
        marginHorizontal: responsiveHeight(1.5),
        height: responsiveHeight(20),
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 5
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    submitButton: {
        marginTop: 20
    }
});

export default EditInvoice;
