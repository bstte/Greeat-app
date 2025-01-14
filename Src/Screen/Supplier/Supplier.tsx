import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import DrawerComponent from '../../Component/DrawerComponent'
import { fetchToken } from '../Helpers/fetchDetails';
import api from '../../API/api';
import Textlabel from '../../Component/Textlabel';
import { Prime_Color } from '../../Colour/Colour';
import Loader from '../../Component/Loader';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const Supplier = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [Supplier, setSupplier] = useState([]);

    const getSupplier = async () => {
        setIsLoading(true);
        const token = await fetchToken();


        if (token) {


            try {
                const response = await api.supplier(token);
                //   console.log(response.data.data)
                setSupplier(response.data.data);
                //   setFilteredDocuments(response.data.data.manual); // Initially, filtered documents are the same as all documents
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

    const handlesearching = async() => {
        const title = searchQuery;
        // const location = dropdowlocationId;
        const token=await fetchToken();
        
        if(token){
          try{
            const response=await api.searchsupplier(token,title)
            // console.log("response searchsupplier =",response.data)
            setSupplier(response.data.data)
    
          }catch(error){
            console.log("searching error:",error)
          }
        }
      }

    const clear = () => {
        setSearchQuery("")

        getSupplier()
    }

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
             <Textlabel title='Serial Number:' value={index + 1} />
             <Textlabel title='Name:' value={item.name} />
             <Textlabel title='Email:' value={item.email} />
             <Textlabel title='Contact person:' value={item.contact_person} />
             <Textlabel title='Phone:' value={item.phone} />
          
            {/* <Text style={styles.itemText}>Serial Number: {index + 1}</Text> */}
            {/* <Text style={styles.itemText}>Name: {item.name}</Text>
            <Text style={styles.itemText}>Email: {item.email }</Text>
            <Text style={styles.itemText}>Contact person: {item.contact_person}</Text>
            <Text style={styles.itemText}>Phone: {item.phone}</Text> */}
            <View style={styles.statusWrapper}>
                <Text style={styles.statusTitle}>Status:</Text>
                <View
                    style={[
                        styles.statusContainer,
                        {
                            backgroundColor: item.status === 1 ? 'green' : 'red',
                        },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {item.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
               
            </View>
            <View style={[styles.documentContainer,{justifyContent:"space-between"}]} >
              
                    <Text style={styles.documentText}>Action:</Text>
                    <View
                        style={[
                            styles.statusContainer,
                            {
                                backgroundColor: 'green',
                              
                            },
                        ]}
                    >
                          <TouchableOpacity onPress={() => props.navigation.navigate("ViewSupplier",{supplier:item})}>
                          <Text style={[styles.statusText]}>View</Text>
                    </TouchableOpacity>
                    
                    </View>
                </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <DrawerComponent props={props} title={"Supplier"} color={Prime_Color} onRefresh={getSupplier}/>
            <View style={styles.content}>
                <View style={{}}>
                    <View style={styles.row}>
                        <TextInput
                            placeholder='Enter name'
                            style={styles.textInput}
                            value={searchQuery}
                            onChangeText={(value) => setSearchQuery(value)}
                        />

                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => handlesearching()}>
                            <Text>Search</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => clear()}>
                            <Text>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    {/* {isLoading ? (
                        <ActivityIndicator size="large" color={Prime_Color} />
                    ) : ( */}
                        <FlatList
                            data={Supplier}
                            // refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getSupplier()} />}

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
        </SafeAreaView>
    )
}

export default Supplier

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
        alignItems: "center",
        marginVertical: 10,
    },
    textInput: {
        flex: 1,
        marginHorizontal: responsiveHeight(.5),

        padding:  Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(2),
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
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
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical:  Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.7),
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
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
        justifyContent:"space-between",
        // marginTop: 6,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight:"600",
    color:"#202020",
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
        fontWeight:"600",
        color:"#202020",
    },
})