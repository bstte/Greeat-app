import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import SimpleHeader from '../../Component/SimpleHeader';
import { fetchToken, fetchUserId } from '../Helpers/fetchDetails';
import api from '../../API/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { viewFullImage } from '../../Component/viewFullImage';
import CustomImageModal from '../../Component/CustomImageModal';
import SuccessMessage from '../../Component/CustomTostMessage';
import Loader from '../../Component/Loader';
import { Prime_Color } from '../../Colour/Colour';
import ImageResizer from 'react-native-image-resizer'

const Task = (props) => {
    const route = useRoute();
    const { ShopId, title, date } = route.params;
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [amounts, setAmounts] = useState({}); // New state for amounts
    const [selectedImages, setSelectedImages] = useState({});
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Imageloading, setImageloading] = useState(false);
    useEffect(() => {
        console.log(date)
        getTask();
    }, []);
    const getTask = async () => {
        const token = await fetchToken();
        const formattedDate = formatDate(date); // Format date
        if (token) {
            try {
                setIsLoading(true)
                const response = await api.task(token, ShopId, formattedDate);
                console.log(response.data)
                setIsLoading(false)
                setTasks(response.data.data);
            } catch (error) {
                console.log("task error:", error);
            }
        }
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };
    const handleCheckboxChange = (taskId) => {
        setSelectedTasks(prevSelectedTasks => {
            const taskIndex = prevSelectedTasks.findIndex(task => task.sopId === taskId);
            if (taskIndex !== -1) {
                return prevSelectedTasks.filter(task => task.sopId !== taskId);
            } else {
                return [...prevSelectedTasks, { sopId: taskId, amount: amounts[taskId] || null, image: selectedImages[taskId] || '' }];
            }
        });
    };

    const handleAmountChange = (taskId, amount) => {
        setAmounts(prevAmounts => ({
            ...prevAmounts,
            [taskId]: amount
        }));
    };

    const handleImageSelection = async (taskId, image) => {
            console.log("image", image);

            try {
                const { width, height, path } = image;
    
                const maxWidth = 1200; 
                const maxHeight = 1200;
    
                let targetWidth = width;
                let targetHeight = height;
    
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        targetWidth = maxWidth;
                        targetHeight = Math.round((maxWidth / width) * height);
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round((maxHeight / height) * width);
                    }
                }
    
                const resizedImage = await ImageResizer.createResizedImage(
                    path,
                    targetWidth,
                    targetHeight,
                    'JPEG',
                    90
                );
                const imageType = resizedImage.mime || 'image/jpeg'; // Default to 'image/jpeg' if mime type

                setSelectedImages(prev => ({
                    ...prev,
                    [taskId]: {...resizedImage, type: imageType },
                }));
                handleImageModalVisible();

    
            } catch (error) {
                console.error('Error resizing image:', error);
                Alert.alert('Error', 'Failed to resize image.');
            }

        // setSelectedImages(prevSelectedImages => ({
        //     ...prevSelectedImages,
        //     [taskId]: image
        // }));
    };

    const handleImageModalVisible = () => {
        setImageModalVisible(!isImageModalVisible);
    };
    const storeTaskData = async () => {
        if (selectedTasks.length === 0) {
            Alert.alert("Error", "Please select data");
            return;
        }

      

        console.log("selectedTasks", selectedTasks);

        // Create a new FormData object
        const formData = new FormData();

        // Add tasks data to FormData
        selectedTasks.forEach((task, index) => {
            const selectedImage = selectedImages[task.sopId];

            // Append task data including image details if available
            formData.append(`tasks[${index}][sopId]`, task.sopId);
            formData.append(`tasks[${index}][amount]`, amounts[task.sopId] || ''); // Ensure amount is included

            if (selectedImage) {
                formData.append(`tasks[${index}][image]`, {
                    uri: selectedImage.uri,
                    name: selectedImage.uri.split('/').pop(),
                    type: selectedImage.type
                });
            } else {
                formData.append(`tasks[${index}][image]`, ''); // Handle case with no image
            }
        });

        // Log FormData contents for debugging
        // console.log('FormData contents:', formData);

        const token = await fetchToken();
        const userIdstr = ShopId; // Ensure this is a function call

        // console.log(userIdstr)
        if (token && userIdstr) {
            try {
                setIsLoading(true)
                const response = await api.storetask(token, parseInt(userIdstr), formData); // Ensure the API function handles FormData
                console.log(response.data);
                if (response.data.status === 200) {
                    SuccessMessage({
                        message: response.data.message
                    });
                    setIsLoading(false)
                    getTask();
                    setSelectedTasks([])
                }
            } catch (error) {
                console.log("Error saving tasks:", error);
                Alert.alert("Error", "An error occurred while saving tasks");
            }
        }
    };



    const renderTask = ({ item: task }) => {
        const { id, user_id, amount, task: taskDescription, image, updated_at, category,flag,image_quantity,quantity } = task;
        const isEditable = flag === 0;
     

        return (
            <View key={id} style={[styles.taskContainer,{ borderColor:category===1?'#ddd':Prime_Color,}]}>
                {/* <Text style={[styles.title, category !== 1 ? { fontWeight: "700", color: "black" } : null]}>Task Allotted:</Text> */}
                <Text style={[styles.taskDescription, category !== 1 ? { fontWeight: "bold", color:Prime_Color, } : null]}>
                    {taskDescription}
                </Text>


             
                {category === 1 && quantity===1 ? (
                    <>
                       <Text style={styles.title}>Amount:</Text>
                        {isEditable ? (
                            <TextInput
                                style={[styles.amountInput, { backgroundColor: "white" }]}
                                defaultValue={amount !== null ? amount.toString() : ''}
                                placeholder='Enter Amount'
                                onChangeText={(text) => handleAmountChange(id, text)}
                            />
                        ) : (
                            <Text style={styles.amountInput}>{amount !== undefined && amount !== 0 ? amount : ''}</Text>

                        )}

                    </>
                ) : <>
                    <Text style={styles.emptyamountInput}></Text>
                </>}

               
                {category === 1  && image_quantity===1? (
                    <> 
                    <Text style={styles.title}>Image:</Text>
                        {isEditable ? (
                            <>
                                <TouchableOpacity style={{ flexDirection: "row", marginTop: 10 }} onPress={() => { setSelectedTaskId(id); handleImageModalVisible(); }}>
                                    <Icon name='file-upload-outline' size={responsiveFontSize(4)} />
                                    <Text style={[styles.title, { justifyContent: "center", alignSelf: "center", fontSize: 16 }]}>Upload Image</Text>
                                </TouchableOpacity>
                                {selectedImages[id] && (
                                    <TouchableOpacity>
                                        <Image
                                            source={{ uri: selectedImages[id].uri }}
                                            style={styles.taskImage}
                                        />
                                        <Text>{selectedImages[id].type}</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <>
                                {image ? (
                                    <TouchableOpacity onPress={() => viewFullImage({ fullImage: image ? `https://gestione.greeat.it/public/sops/item/${image}` : null, setLoading: setImageloading})}>
                                        <Image source={{ uri: `https://gestione.greeat.it/public/sops/item/${image}` }} style={styles.taskImage} />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.placeholderImage} />
                                )}
                            </>
                        )}
                    </>
                ) : <>
                    <Text style={styles.emptyamountInput}></Text>
                </>}


                {/* <Text style={[styles.title, { marginTop: 10 }]}>Options:</Text> */}
                {category === 1 ? (
                    <>
                        {isEditable ? (
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    isChecked={selectedTasks.some(task => task.sopId === id)}
                                    onClick={() => handleCheckboxChange(id)}
                                />
                                <Text style={styles.checkboxLabel}>Tick For Completion</Text>
                            </View>
                        ) : (
                            <Text style={styles.completedText}>Task Completed by {user_id} at {updated_at}</Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text style={styles.emptyamountInput}></Text>
                    </>
                )}
  {Imageloading && <Loader Loading={Imageloading} />}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <SimpleHeader props={props} title={title} />
            <View style={styles.header}>
                        <Text style={styles.mainTitle}>{title}</Text>
                        <TouchableOpacity onPress={storeTaskData} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTask}
                contentContainerStyle={styles.taskList}
              
            />
            <CustomImageModal
                togglevisible={isImageModalVisible}
                onclose={handleImageModalVisible}
                multipleImage={false}
                handelImage={(image) => handleImageSelection(selectedTaskId, image)}
            />
              {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }
        </SafeAreaView>
    );
};

export default Task;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    taskList: {
        padding: 16,
    },
    taskContainer: {
        marginBottom: 16,
        padding: 16,
     
        borderWidth: 1,
        borderRadius: 8,
    },
    taskDescription: {
        fontSize: 16,
        marginBottom: 8,
    },
    amountInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        padding:  Platform.OS === 'android' ? responsiveHeight(.5) : responsiveHeight(1),

        fontSize: 14, // Smaller font size
        marginBottom: 8,
        backgroundColor: "#e9ecef",
        textAlign:"center",
        width: 200, // Adjust the width to your desired size
    }
,    
    emptyamountInput: {
        // borderColor: '#ddd',
        // borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        marginBottom: 8,
        // backgroundColor: "#e9ecef"
    },
    taskImage: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: '#ddd',
        marginTop: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    completedText: {
        fontSize: 16,
        color: 'green',
        marginTop: 8,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 16,
    },
    mainTitle: {
        fontSize: 20, flex: 1,
        fontWeight: 'bold',
    }
});
