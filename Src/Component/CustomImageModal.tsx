import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform,PermissionsAndroid,PermissionStatus } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableWithoutFeedback } from 'react-native';
import { Prime_Color } from '../Colour/Colour';
import { translate } from '../i18n/Language/useTranslation'

interface ImageModal {
    togglevisible: any;
    handelImage: any;
    onclose: any;
    multipleImage:boolean
}


const CustomImageModal: React.FC<ImageModal> = ({ togglevisible,onclose, handelImage,multipleImage }) => {

    const toggleModal = () => {
        onclose(false);
      };

    const Camera = async () => {
        try {
            const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

            const permissionResult = await request(cameraPermission);

                console.log('Camera permission granted');

                const response = await ImagePicker.openCamera({
                    width: 250,
                    height: 250,
                    cropping: false,
                });

              
                handelImage(response)

        } catch (error) {
            console.error('Camera Error:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Modal
                visible={togglevisible}
                animationType="slide"
                transparent={true}

            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <View style={{alignItems:"center"}}>
                        <View style={styles.separator} />
                        </View>
                 

                        <TouchableOpacity onPress={Camera} style={styles.cameraContainer}>
                            <Icon color={Prime_Color} name='camera' size={33} style={{ width: 40 }} />
                            <Text style={styles.text}>{translate('AddInvoice.Take_Photo')}</Text>
                        </TouchableOpacity>

                    </View>
                   
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default CustomImageModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: "center",
        justifyContent: "flex-end",
    },
    modal: {
        width: responsiveWidth(100),
        // height: responsiveHeight(30),
        backgroundColor: 'white',
        paddingHorizontal: responsiveHeight(2.3),
        borderTopLeftRadius: responsiveHeight(2),
        borderTopRightRadius: responsiveHeight(2),
        paddingBottom: responsiveHeight(2.3),
    },
    separator: {
        width: '15%',
        height: responsiveHeight(0.4),
        justifyContent: 'center',
        alignSelf:"center",
        backgroundColor: '#ccc',
        display:"flex",
        marginTop: 10,
        marginBottom: 20,
    },
    cameraContainer:{
        flexDirection: "row", alignItems: "center", marginBottom: 14
    },
    GalleryContainer:{
        flexDirection: "row", alignItems: "center"
    },
    text:{
        fontSize: 18, color: "#000"
    },
    closeButton: {
        marginTop: responsiveHeight(3.2),
        padding: responsiveHeight(1.3),
        borderWidth: 1,
        borderRadius: responsiveHeight(0.5),
       alignItems:"center",
        borderColor: '#ccc',
      },
})