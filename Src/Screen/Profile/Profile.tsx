import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import SimpleHeader from '../../Component/SimpleHeader';
import { Prime_Color } from '../../Colour/Colour';
import CustomTextInput from '../../Component/CustomTextInput';
import CustomDatePicker from '../../Component/CustomDatePicker';
import CustomEditDropdown from '../../Component/CustomEditDropdown';
import CustomButton from '../../Component/CustomButton';
import { fetchToken, fetchUserId } from '../Helpers/fetchDetails';
import api from '../../API/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SuccessMessage from '../../Component/CustomTostMessage';
import { setUser } from '../../Reducer/slices/userSlice';
import DateFormatter from '../../Component/DateFormatter';
import { translate } from '../../i18n/Language/useTranslation';

const Profile = (props) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [name, setName] = useState(userData.name || '');
    const [email, setEmail] = useState(userData.email || '');
    const [phone, setPhone] = useState(userData.phone || '');
    const [address, setAddress] = useState(userData.address || '');
    const [dob, setDob] = useState(userData.dob || '');
    const [nationality, setNationality] = useState(userData.nationality || '');
    const [city, setCity] = useState(userData.city || '');
    const [state, setState] = useState(userData.state || '');
    const [zipCode, setZipCode] = useState(userData.zip_code || '');
    const [idType, setIdType] = useState(userData.id_type || '');
    const [idNumber, setIdNumber] = useState(userData.id_number || '');
    const [country, setCountry] = useState();
    const [selectedCountryLabel, setSelectedCountryLabel] = useState(''); // For displaying selected country name
    const [gender, setGender] = useState(userData.gender !== null ? userData.gender.toString() : ''); // Ensure gender is a string
    const [countryData, setCountryData] = useState([]);

    const handleonpresstartdata = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    const handleChangestartdate = (propData) => {
        setDob(propData);
        setOpenStartDatePicker(false);
    };

    useEffect(() => {
        // console.log("userdata",userData);
        const fetchCountryData = async () => {
            const token = await fetchToken();
            if (token) {
                try {
                    const response = await api.country(token);
                    setCountryData(response.data.data.map(country => ({ label: country.name, value: country.id })));

                    // Set the initial selected country label based on the stored value

                } catch (error) {
                    console.error("country error:", error);
                }
            }
        };
        fetchCountryData();
    }, []);

    const genderOptions = [
        { label:translate('Profile.Male'), value: "1" },
        { label: translate('Profile.Female'), value: "0" }
    ];

    const handleCountrySelect = (item) => {
        setSelectedCountryLabel(item.label); // Set the label to display in the dropdown
        setCountry(item.value); // Set the value for updating profile
    };

    const handleProfileUpdate = async () => {
        // Create a new FormData object
        const formData = new FormData();

        // Append each field to the FormData object
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('dob', dob);
        formData.append('nationality', nationality);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('zip_code', zipCode);
        formData.append('id_type', idType);
        formData.append('gender', gender);
        formData.append('id_number', idNumber);
        if (country) {
            formData.append('country', country);
        }
        formData.append('password', password);

        console.log('FormData:', formData);

        const token = await fetchToken();
        const useridstr = await fetchUserId();
        if (token && useridstr) {
            try {
                // Pass FormData in the API request
                const response = await api.updateProfile(token, parseInt(useridstr), formData);
                if (response.data.status === 200) {
                    SuccessMessage({
                        message: translate('Profile.Profile_update_successfully')
                    })
                    dispatch(setUser(response.data.data));

                }
                console.log(response.data);
            } catch (error) {
                console.error("update profile issue", error);
            }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <SimpleHeader props={props} title={translate('Profile.title')} />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.profileContainer}>
                    <Text style={styles.profileTitle}>{translate('Profile.Profile_title')}</Text>

                    <CustomTextInput
                        title={translate('Profile.name')}
                        value={name}
                        placeholder={translate('Profile.Enter_name')}
                        onChangeText={setName}
                        required={true}
                    />

                    <CustomTextInput
                        title={translate('Profile.email')}
                        value={email}
                        placeholder={translate('Profile.Enter_email')}
                        onChangeText={setEmail}
                        required={true}
                    />

                    <View style={styles.inputView}>
                        <Text style={styles.textinputlabel}>{translate('Profile.Date_of_Birth')}</Text>
                        <TouchableOpacity style={styles.inputText} onPress={handleonpresstartdata}>
                            <Text style={styles.datetext}>
                                {dob ? <DateFormatter date={dob} time={false} /> : "Select Date"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <CustomEditDropdown
                        data={genderOptions}
                        placeholder={translate('Profile.Select_Gender')}
                        title={translate('Profile.Gender')}
                        selectedValue={gender === "1" ? translate('Profile.Male') : gender === "0" ?translate('Profile.Female') : ''}
                        onSelect={(item) => setGender(item.value)}
                        required={true}
                    />


                    <CustomTextInput
                        title={translate('Profile.Nationality')}
                        value={nationality}
                        placeholder={translate('Profile.Enter_Nationality')}
                        onChangeText={setNationality}
                        required={true}
                    />
                    <CustomTextInput
                        title={translate('Profile.Mobile_Phone')}
                        value={phone}
                        placeholder={translate('Profile.Enter_Phone')}
                        onChangeText={setPhone}
                        required={true}
                    />

                    <CustomTextInput
                        title={translate('Profile.Address')}
                        value={address}
                        placeholder={translate('Profile.Enter_Address')}
                        onChangeText={setAddress}
                        required={true}
                    />


                    <CustomTextInput
                        title={translate('Profile.City')}
                        value={city}
                        placeholder={translate('Profile.Enter_City')}
                        onChangeText={setCity}
                        required={true}
                    />

                    <CustomTextInput
                        title={translate('Profile.Zip_Code')}
                        value={zipCode}
                        placeholder={translate('Profile.Enter_Zip_Code')}
                        onChangeText={setZipCode}
                        required={true}
                    />


                    <CustomTextInput
                        title={translate('Profile.State')}
                        value={state}
                        placeholder={translate('Profile.Enter_State')}
                        onChangeText={setState}
                        required={true}
                    />

                    <CustomEditDropdown
                        data={countryData}
                        placeholder={translate('Profile.Select_Country')}
                        title={translate('Profile.Country')}
                        selectedValue={selectedCountryLabel ? selectedCountryLabel : userData.country} // Display selected label
                        onSelect={handleCountrySelect} // Handle selection
                        required={true}
                    />




                    <CustomTextInput
                        title={translate('Profile.ID_Type')}
                        value={idType}
                        placeholder={translate('Profile.Enter_ID_Type')}
                        onChangeText={setIdType}
                        required={true}
                    />

                    <CustomTextInput
                        title={translate('Profile.ID_Number')}
                        value={idNumber}
                        placeholder={translate('Profile.Enter_ID_Number')}
                        onChangeText={setIdNumber}
                        required={true}
                    />

                    <View style={styles.inputView}>
                        <Text style={styles.textinputlabel}>{translate('Profile.Password')}</Text>
                        <TextInput placeholder={translate('Profile.Enter_Your_Password')} style={styles.psswordtextinput}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={password}
                            secureTextEntry={!showPassword}
                            onChangeText={setPassword} />
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#aaa"
                            style={styles.icon}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.textinputlabel}>{translate('Profile.Location')}</Text>
                        <Text style={[styles.psswordtextinput, { backgroundColor: "#e9ecef", justifyContent: "center", color: "black" }]}>{userData.location_id}</Text>
                    </View>

                    <View style={styles.inputView}>
                        <Text style={styles.textinputlabel}>{translate('Profile.Role')}</Text>
                        <Text style={[styles.psswordtextinput, { backgroundColor: "#e9ecef", justifyContent: "center", color: "black" }]}>{userData.user_type}</Text>
                    </View>

                    <CustomButton title={translate('Profile.Update_Profile')} handleform={handleProfileUpdate} />
                </View>
            </ScrollView>
            <CustomDatePicker visible={openStartDatePicker} selectedDate={dob} onClose={handleChangestartdate} />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        padding: responsiveWidth(5),
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        color: Prime_Color,
        marginBottom: responsiveHeight(2),
    },
    profileSection: {
        width: '100%',
        marginBottom: responsiveHeight(1.5),
    },
    profileLabel: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: '#333',
    },
    profileValue: {
        fontSize: responsiveFontSize(2),
        color: '#666',
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

    psswordtextinput: {
        width: responsiveWidth(95),
    height: responsiveHeight(7.2),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),
    
    // Platform-specific shadows and elevation
    elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
    shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
    shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
    
    // Border and text styling
    borderWidth: 1, // Adding a border for clarity on iOS
    borderColor: '#ddd', // Light border color
    fontSize: 16, // Font size for text input
    color: '#333', // Text color


    },
    icon: {
        position: "absolute",
        right: responsiveHeight(2),
        top: responsiveHeight(5.9)
    },

});

export default Profile;
