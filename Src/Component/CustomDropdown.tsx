import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    SectionList,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Prime_Color } from '../Colour/Colour';



interface DropdownProps {
    data: any[];
    placeholder: string;
    title:string;
    onSelect: (value: any) => void;
    required:boolean;
    width:number
}

const CustomDropdown: React.FC<DropdownProps> = ({ data, placeholder,title, onSelect,required,width }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');




    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setSearchTerm('');
    };

    const handleSelectItem = (item: any) => {
        setSelectedItem(item);
        onSelect(item);
        toggleModal();
        Keyboard.dismiss();
    };

    const filteredData = data.filter((item) =>
    item.label && item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textinputlabel}>{title} {required?<Text style={{color:"red"}}>*</Text>:null}</Text>
                <View style={[styles.dropdowncontainer,{width: responsiveWidth(width?width:95),}]}>
                    <TouchableOpacity onPress={toggleModal} style={styles.dropdownContent}>
                        <Text style={styles.dropdownText}>{selectedItem ? selectedItem.label : placeholder}</Text>
                        <Icon name="caret-down" size={responsiveFontSize(2)} style={styles.dropdownIcon} />
                    </TouchableOpacity>
                </View>
            </View>


            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>

                <View style={[styles.modalContainer, styles.modalContainerCentered]}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.modal, { width: responsiveWidth(100), height: responsiveHeight(60) }]}>
                            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                            <View style={{ width: '15%', height: responsiveHeight(0.4), backgroundColor: '#ccc', marginTop: 10, marginBottom: 20 }} />
                            </View>
                            

                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                            <SectionList
                                sections={[{ data: filteredData }]}
                                keyExtractor={(item) => item.value}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                    onPress={() => handleSelectItem(item)}
                                    style={[
                                        styles.modalItem,
                                        selectedItem && selectedItem.value === item.value && styles.selectedItem,
                                    ]}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                                )}
                            />

                            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                                <Text style={{ color: Prime_Color,fontSize:responsiveFontSize(2) }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerCentered: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdowncontainer: {
        
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding:  Platform.OS === 'android' ? responsiveHeight(1.8) : responsiveHeight(2.2),
        elevation: Platform.OS === 'android' ? 2 : 0, // Elevation for Android
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent', // Shadow color for iOS
        shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : {}, // Shadow offset for iOS
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Shadow opacity for iOS
        shadowRadius: Platform.OS === 'ios' ? 3 : 0, // Shadow radius for iOS
        borderWidth: 1, // Adding a border for clarity on iOS
      borderColor: '#ddd', // Light border color
    //   fontSize: 16, // Font size for text input
      color: '#333', // Text color
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: responsiveFontSize(2),
    },
    dropdownIcon: {
        marginLeft: responsiveWidth(2),
    },


    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        backgroundColor: 'white',
    
        borderTopLeftRadius:responsiveHeight(2) ,
        borderTopRightRadius: responsiveHeight(2) ,
        paddingHorizontal: responsiveHeight(2.3),

        paddingBottom:responsiveHeight(2.3),

    },
    textinputlabel: {
        marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18"
    },
    searchInput: {
        borderWidth: responsiveHeight(0.1),
        borderColor: '#ccc',
        borderRadius: responsiveHeight(0.5),
        padding:responsiveHeight(1.2),
        marginBottom: responsiveHeight(1.2),
    },
    modalItem: {
        padding: responsiveHeight(1.9),
        fontSize: responsiveFontSize(2),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: "#202020", fontWeight: "400"
    },
    closeButton: {
        marginTop: responsiveHeight(1.2),
        padding: responsiveHeight(1.3),
        borderWidth: 1,
        borderRadius: responsiveHeight(0.5),
        alignSelf: 'flex-end',
        borderColor: '#ccc', 
    },
    selectedItem: {
        backgroundColor: '#e6f7ff', // Add the background color you want for the selected item
    },
});

export default CustomDropdown;
