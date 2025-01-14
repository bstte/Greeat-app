import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import DrawerComponent from '../../Component/DrawerComponent';
import CustomDropdown from '../../Component/CustomDropdown';
import { Prime_Color } from '../../Colour/Colour';

import { LocationId, fetchToken, fetchUserId } from '../Helpers/fetchDetails';
import api, { Image_Base_Url } from '../../API/api';
import { viewFullImage } from '../../Component/viewFullImage';
import { useRoute } from '@react-navigation/native';
import Loader from '../../Component/Loader';
import Textlabel from '../../Component/Textlabel';
import Icon from 'react-native-vector-icons/EvilIcons';
import DateFormatter from '../../Component/DateFormatter';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import CustomDatePicker from '../../Component/CustomDatePicker';
import { translate } from '../../i18n/Language/useTranslation';

const ListInvoice = (props) => {
    const route = useRoute();
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [dropdowlocationId, setdropdowlocationId] = useState(null);
    const [filteredInvoice, setFilteredInvoice] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [Imageloading, setImageloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState(null); // For from date
    const [toDate, setToDate] = useState(null); // For to date
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false); // For from date picker visibility
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false); // For to date picker visibility
    const NEC_data = ["500", "505",]

   

    const getInvoice = async () => {
        setIsLoading(true)
        const token = await fetchToken();
        const LocationIdstr = await LocationId();

        if (token && LocationIdstr) {
            const LocationId = parseInt(LocationIdstr, 10);
            if (!isNaN(LocationId)) {
                try {
                    const response = await api.Invoice(token, LocationId);
                    console.log("invoice", response.data.data);
                    setFilteredInvoice(response.data.data)
                } catch (error) {
                    console.error('Error fetching invoice:', error);
                }
                finally {
                    setIsLoading(false);
                }
            } else {
                console.error('Invalid userId:', UserId);
            }
        } else {
            console.error('Token or userId is null');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check if newInvoice data is present
        // if (route.params?.newInvoice) {
        //     setFilteredInvoice(prevInvoices => [route.params.newInvoice, ...prevInvoices]);
        // }
        getInvoice()
    }, [route.params?.newInvoice]);

    useEffect(() => {

        getInvoice()
    }, [route.params?.updatedInvoice]);

    React.useEffect(() => {
        getInvoice();
        // getLocation();
    }, []);

    const addInvoice = () => {
        props.navigation.navigate("AddInvoice")
    }

    const handleEdit = (item) => {
        props.navigation.navigate("EditInvoice", { invoice: item });
    };


    const clear = () => {
        setSearchQuery("")
        setdropdowlocationId(null)
        setFromDate(null);
        setToDate(null);
        getInvoice()
    }

    // Handle Date Picker Selection
    const handleStartDateChange = (date) => {
        setFromDate(date);
        setOpenStartDatePicker(false);
    };

    const handleEndDateChange = (date) => {
        setToDate(date);
        setOpenEndDatePicker(false);
    };

    const searchformatDate = (dateString) => {
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split('/');

        // Reformat to 'DD/MM/YY'
        return `${year}-${month}-${day}`;
    };

    const handlesearching = async () => {
        const title = searchQuery;
        const fdate=fromDate ?searchformatDate(fromDate):''
        const tdate=toDate ?searchformatDate(toDate):''
        
        // const location = dropdowlocationId;
        const token = await fetchToken();
        const userId = await fetchUserId()
        if (!title && !fdate && !tdate) {
            Alert.alert('Please provide at least one filter: Document Number, from date to date.');
            return; // Exit the function if none of the fields is provided
        }
       
       const params= {
            title: title,
            tdate:tdate,
            fdate:fdate,
            
          }
        if (token) {
            try {
                setIsLoading(true)
                const response = await api.searchInvoice(token,params )
                // console.log("response =", response.data.data)
                setFilteredInvoice(response.data.data)
                setIsLoading(false)

            } catch (error) {
                setIsLoading(false)
                console.log("searching error:", error)
            }
        }
    }
    const formatDate = (dateString) => {
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split('/');

        // Reformat to 'DD/MM/YY'
        return `${day}/${month}/${year}`;
    };


    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            {/* <Textlabel title='Serial Number:' value={index + 1} /> */}
            <Textlabel title={translate('Invoice.Document_Number')} value={item.title} />
            <Textlabel title={translate('Invoice.Location')} value={item.location_id || ''} />
            <Textlabel title={translate('Invoice.Amount')}  value={item.amount} />
            <Textlabel title={'Note: '}  value={item.note} />

            <Textlabel title={translate('Invoice.Date')} value={<DateFormatter date={item.date} time={false} />} />


{/* 
            <View style={styles.documentContainer} >
                <Text style={styles.documentText}>{translate('Invoice.Document')}</Text>
                <View
                    style={[
                        styles.statusContainer,
                        {
                            backgroundColor: 'green',
                        },
                    ]}
                >
                    <TouchableOpacity onPress={() => viewFullImage({ fullImage: item.document ? `${Image_Base_Url}/invoice/${item.document}` : null, setLoading: setImageloading, })}>
                    <Text style={[styles.statusText]}>{translate('Invoice.DOWNLOAD_DOCUMENT')}</Text>
                    </TouchableOpacity>
                </View>
            </View> */}

            {/* <View style={styles.statusWrapper}>
                <Text style={styles.statusTitle}>Status:</Text>
                <View
                    style={[
                        styles.statusContainer,
                        {
                            backgroundColor: parseInt(item.status) === 1 ? 'green' : 'red',
                        },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {item.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View> */}

            {/* <View style={styles.actionContainer}>
                <Text style={styles.actionText}>Action:</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <DrawerComponent
                props={props}
                title=  {translate('Invoice.title')}
                color={Prime_Color}
                onRefresh={getInvoice}  // Pass the function reference here
            />


            <View style={[styles.buttonRow, { marginBottom: 15 }]}>
                <View style={[styles.button, { borderColor: "white",paddingVertical:  Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.7), }]} >
                    {/* <Text>Clear</Text> */}
                </View>

                <TouchableOpacity style={[styles.button, { backgroundColor: Prime_Color, paddingVertical :Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.5), }]} onPress={() => addInvoice()}>
                    <Text style={{ color: "white", fontSize: 15 }}>
                    {translate('Invoice.Add_Invoice')}
                        
                    </Text>
                </TouchableOpacity>
            </View>

            {/* <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.dateText}>
                            {fromDate ? formatDate(fromDate) : "From Date"}
                        </Text>
                        <TouchableOpacity onPress={() => setOpenStartDatePicker(true)}>
                            <Icon color={Prime_Color} name="calendar" size={responsiveHeight(4)} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.button}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.dateText}>
                            {toDate ? formatDate(toDate) : "To Date"}
                        </Text>
                        <TouchableOpacity onPress={() => setOpenEndDatePicker(true)}>
                            <Icon color={Prime_Color} name="calendar" size={responsiveHeight(4)} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View> */}

            {/* <View style={styles.row}>
                <TextInput
                    placeholder='Enter Document Number'
                    style={styles.textInput}
                    value={searchQuery}
                    onChangeText={(value) => setSearchQuery(value)}
                />

                <TouchableOpacity style={styles.searchButton} onPress={() => handlesearching()}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View> */}


            <View style={styles.content}>


                <View style={{ flex: 1 }}>
                    {/* {isLoading ? (
                        <ActivityIndicator size="large" color={Prime_Color} />
                    ) : ( */}
                        <FlatList
                            data={filteredInvoice}
                            // refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getInvoice()} />}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                            ListEmptyComponent={<Text style={styles.noDataText}>No Data</Text>}
                        />
                    {/* )} */}

                    {
                        Imageloading ? (
                            <Loader Loading={Imageloading} />
                        ) : null
                    }
                    {/* Custom Date Pickers */}
                    <CustomDatePicker
                        visible={openStartDatePicker}
                        selectedDate={fromDate || new Date().toISOString().split('T')[0]}
                        onClose={handleStartDateChange}
                    />
                    <CustomDatePicker
                        visible={openEndDatePicker}
                        selectedDate={toDate || new Date().toISOString().split('T')[0]}
                        onClose={handleEndDateChange}
                    />
                    {
                        isLoading ? (
                            <Loader Loading={isLoading} />
                        ) : null
                    }
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    datetext: {
        marginTop: responsiveHeight(1)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        marginHorizontal: 8,
    },
    searchButton: {

        // paddingVertical: 11,
        paddingHorizontal: 17,
        backgroundColor: Prime_Color, // Adjust color
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white', // Button text color
        // fontSize: 16,
    },
    content: {
        flex: 1,
        marginHorizontal: 8,
    },
    textInput: {
        flex: 1,
        marginRight: 5,
        padding:  Platform.OS === 'android' ? responsiveHeight(1.2) : responsiveHeight(2),
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    locationButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    dropdown: {
        flex: 1,
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: Platform.OS === 'android' ? responsiveHeight(1.2) : responsiveHeight(1.3), 
        borderWidth: 1,
        borderColor: Prime_Color,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%", // Ensure the button content uses the full width of the button
        paddingHorizontal: 10, // Add padding to keep text and icon away from edges
    },
    dateText: {
        fontSize: responsiveFontSize(2),
        color: "#000", // Customize text color if needed
    },


    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    itemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    itemText: {
        fontSize: 16,
        marginTop: 8,
        color: "#000",
    },
    noDataText: {
        justifyContent: "center",
        alignSelf: "center",
        fontSize: 16,
        color: "#000",
        marginTop: 10,
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#202020",
        marginRight: 8,
    },
    statusContainer: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
    },
    documentContainer: {
        flexDirection: 'row',
     justifyContent:"space-between",
        marginTop: 8,
    },
    documentText: {
        fontSize: 16,
        marginRight: 8,

        fontWeight: "600",
        color: "#202020",
    },

    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        justifyContent: 'space-between',
    },
    actionText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#202020",
    },
    editButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default ListInvoice;
