import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import SimpleHeader from '../../Component/SimpleHeader';

const ViewSupplier = (props) => {
    const route = useRoute();
    const { supplier } = route.params;

    // useEffect(() => {
    //     console.log(supplier);
    // }, [supplier]);
    
   
    return (
        <SafeAreaView style={styles.container}>
            <SimpleHeader props={props} title='Supplier Details' />
            <View style={styles.itemContainer}>
           
            <Text style={styles.itemText}>Name: {supplier.name}</Text>
            <Text style={styles.itemText}>Email: {supplier.email }</Text>
            <Text style={styles.itemText}>Contact person: {supplier.contact_person}</Text>
            <Text style={styles.itemText}>Phone: {supplier.phone}</Text>
            <Text style={styles.itemText}>Description: {supplier.description}</Text>
            <View style={styles.statusWrapper}>
                <Text style={styles.statusTitle}>Status:</Text>
                <View
                    style={[
                        styles.statusContainer,
                        {
                            backgroundColor: supplier.status === 1 ? 'green' : 'red',
                        },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {supplier.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
               
            </View>
  
        </View>
        </SafeAreaView>
    )
}

export default ViewSupplier

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    noDataText: {
        justifyContent: "center",
        alignSelf: "center",
        fontSize: 16,
        color: "#000",
        marginTop: 10,
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
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusTitle: {
        fontSize: 16,
        color: "#000",
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
})