import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import DrawerComponent from '../../Component/DrawerComponent';
import { fetchToken } from '../Helpers/fetchDetails';
import api from '../../API/api';
import { Prime_Color } from '../../Colour/Colour';
import { useRoute } from '@react-navigation/native';
import Textlabel from '../../Component/Textlabel';
import DateFormatter from '../../Component/DateFormatter';
import XLSX from 'xlsx'; // For generating Excel file
import { readFile, writeFile, DownloadDirectoryPath, DocumentDirectoryPath } from 'react-native-fs'; // File system module
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import CustomDatePicker from '../../Component/CustomDatePicker';
import Loader from '../../Component/Loader';
import FileViewer from 'react-native-file-viewer';

import moment from 'moment'; // Import moment.js for date formatting
import { translate } from '../../i18n/Language/useTranslation';

import { check, PERMISSIONS, request } from 'react-native-permissions'; // Permissions
import { useSelector } from 'react-redux';


const Closer = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const userData = useSelector((state) => state.user.userData);
    const [Supplier, setSupplier] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [dropdowsiftid, setdropdownsiftId] = useState(null);
    const [fromDate, setFromDate] = useState(null); // For from date
    const [toDate, setToDate] = useState(null); // For to date
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false); // For from date picker visibility
    const [openEndDatePicker, setOpenEndDatePicker] = useState(false); // For to date picker visibility
    const route = useRoute();

    useEffect(() => {
        console.log("userData", userData.user_type)
        getSupplier()
    }, [route.params?.newCloser]);

    const getSupplier = async () => {
        setIsLoading(true);
        const token = await fetchToken();

        if (token) {
            try {
                const response = await api.closer_list(token);
                // console.log(response.data.data)
                let data = response.data.data;

                // Check if data is not an array, convert it to an array
                if (!Array.isArray(data)) {
                    data = [data];
                }

                console.log("check", data); // Verify the structure of data
                setSupplier(data);
            } catch (error) {
                console.error('Error fetching document:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error('Token or LocationId is null');
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getSupplier();
        // getLocation();
    }, []);

    const formatDate = (dateString) => {
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split('/');

        // Reformat to 'DD/MM/YY'
        return `${day}/${month}/${year}`;
    };

    const searchformatDate = (dateString) => {
        // Split the date string (assuming it's in 'YYYY/MM/DD' format)
        const [year, month, day] = dateString.split('/');

        // Reformat to 'DD/MM/YY'
        return `${year}-${month}-${day}`;
    };




    const clear = () => {
        setFromDate(null)
        setToDate(null)
        setdropdownsiftId(null)

        getSupplier()
    }

    // console.log("Supplier",Supplier)
    const addCloser = () => {
        props.navigation.navigate("AddCloser")
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

    const exportToExcel = async () => {
        // Prepare data for Excel export
        const dataToExport = Supplier.map((item) => ({
            Location: item.location_id || "N/A",
            Staf: "",
            Shift: item.shift || "N/A",
            Date: item.date || "N/A",
            Dark: item.dark
                ? {
                    l: {
                        Target: `https://teamwebdevelopers.com/greeat/public/images/dark/${encodeURIComponent(item.dark)}`,
                        Tooltip: "Dark Image",
                    },
                    v: "Dark Image",
                }
                : { v: "No Image" },
            Pos: item.pos
                ? {
                    l: {
                        Target: `https://teamwebdevelopers.com/greeat/public/images/pos/${encodeURIComponent(item.pos)}`,
                        Tooltip: "Pos Image",
                    },
                    v: "Pos Image",
                }
                : { v: "No Image" },
            Fiscal: item.fiscal
                ? {
                    l: {
                        Target: `https://teamwebdevelopers.com/greeat/public/images/fiscal/${encodeURIComponent(item.fiscal)}`,
                        Tooltip: "Fiscal Image",
                    },
                    v: "Fiscal Image",
                }
                : { v: "No Image" },
            Ticket: item.ticket
                ? {
                    l: {
                        Target: `https://teamwebdevelopers.com/greeat/public/images/ticket/${encodeURIComponent(item.ticket)}`,
                        Tooltip: "Ticket Image",
                    },
                    v: "Ticket Image",
                }
                : { v: "No Image" },
            Banconote: item.fondo_cassa !== null ? item.fondo_cassa : 0,
            Monete: item.monete !== null ? item.monete : 0,
            Versato: item.versato !== null ? item.versato : 0,
            Notice: item.notice || "N/A",
            Cassaforte: (item.fondo_cassa || 0) + (item.monete || 0) + (item.versato || 0),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        // Define styles
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },  // White bold font
            fill: { fgColor: { rgb: "4CAF50" } },           // Green background
            alignment: { horizontal: "center" },            // Centered text
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        const bodyStyle = {
            font: { color: { rgb: "000000" } },              // Black font
            fill: { fgColor: { rgb: "FFFFE0" } },            // Light yellow background
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };

        // Apply header styles
        ['A1', 'B1', 'C1', 'D1', 'E1'].forEach(cell => {
            ws[cell].s = headerStyle;
        });

        // Apply body styles to all cells below the header
        const range = XLSX.utils.decode_range(ws['!ref']);  // Get the range of the sheet
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {  // Start from row 2 (R = 1)
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = bodyStyle;
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, "CloserData");

        const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });

        // Get current date and time in "YYYY-MM-DD_HH-mm-ss" format
        const currentDate = moment().format('YYYY-MM-DD_HH-mm-ss');

        // Define file path with title and date
        const fileName = `CloserData_${currentDate}.xlsx`;
        const filePath = `${Platform.OS === 'android' ? DownloadDirectoryPath : DocumentDirectoryPath}/${fileName}`;

        try {
            if (Platform.OS === 'android') {
                const isPermitedExternalStorage = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );

                if (!isPermitedExternalStorage) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );

                    // Uncomment to enforce permission requirement
                    // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    //     return Alert.alert("Permission Denied", "Storage permission is required to export the file.");
                    // }
                }
            }

            await writeFile(filePath, wbout, 'ascii');

            Alert.alert(
                "Success",
                `Excel file has been exported: ${fileName}`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // Optionally, perform any action after user acknowledges the alert
                            // For example, reopen the file:
                            FileViewer.open(filePath, { showOpenWithDialog: true })
                                .then(() => {
                                    console.log('File opened successfully');
                                })
                                .catch(error => {
                                    console.error('Error opening file:', error);
                                    Alert.alert(
                                        "Error",
                                        "Cannot open the Excel file. Please install an app that can open Excel files."
                                    );
                                });
                        }
                    }
                ]
            );
        } catch (error) {
            console.log("Error exporting file", error);
            Alert.alert("Error", "Failed to export file");
        }
    };


    const Shiftdata = [
        { label: 'Breakfast', value: 0 },
        { label: 'Lunch', value: 1 },
        { label: 'Dinner', value: 2 },
    ];
    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>

            <Textlabel title={translate('Closer.Date')} value={<DateFormatter date={item.date} time={false} />} />
            <Textlabel title={translate('Closer.Shift')} value={item.shift} />

            <Textlabel title={translate('Closer.Fondo_Cassa')} value={item.fondo_cassa} />
            <Textlabel title={translate('Closer.Monete')} value={item.monete} />
            <Textlabel title={translate('Closer.Versato')} value={item.versato} />


        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <DrawerComponent props={props} title={translate('Closer.title')} color={Prime_Color} onRefresh={getSupplier} />
            <View style={[styles.buttonRow, { marginBottom: 15 }]}>


                {/* 
                {userData && userData.user_type !== "Staff" ? (
                    <TouchableOpacity style={[styles.button, { backgroundColor: Prime_Color, paddingVertical: Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.6), }]} onPress={() => exportToExcel()}>
                        <Text style={{ color: "white", fontSize: 15 }}>
                            {translate('Closer.Export_to_Excel')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.button, { borderColor: "white" }]} >

                    </TouchableOpacity>
                )} */}
                <TouchableOpacity style={[styles.button, { borderColor: "white" }]} >

                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: Prime_Color, paddingVertical: Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.6), }]} onPress={() => addCloser()}>
                    <Text style={{ color: "white", fontSize: 15 }}>
                        {translate('Closer.Add_Closer')}

                    </Text>
                </TouchableOpacity>

            </View>



            <View style={styles.content}>

                <View style={{ flex: 1 }}>

                    <FlatList
                        data={Supplier}

                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={<Text style={styles.noDataText}>No Data</Text>}
                    />
                    {/* )} */}
                </View>
            </View>
            {
                isLoading ? (
                    <Loader Loading={isLoading} />
                ) : null
            }
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
        </SafeAreaView>
    )

}

export default Closer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        marginHorizontal: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        // alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 10
    },
    textInput: {
        flex: 1,
        marginRight: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
    },
    dropdown: {
        flex: 1,
        height: Platform.OS === 'android' ? responsiveHeight(5.8) : responsiveHeight(5.8),
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    icon: {
        marginRight: 5,
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
        alignItems: 'center',
        marginTop: 8,
    },
    documentText: {
        fontSize: 16,
        marginRight: 8,
        color: "#000",
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
    searchButton: {

        // paddingVertical: 11,
        paddingHorizontal: 17,
        backgroundColor: Prime_Color, // Adjust color
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    buttonText: {
        color: 'white', // Button text color
        // fontSize: 16,
    },


})