import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { fetchUserId, fetchToken, LocationId } from '../Helpers/fetchDetails';
import api, { Image_Base_Url } from '../../API/api';
import DrawerComponent from '../../Component/DrawerComponent';
import { viewFullImage } from '../../Component/viewFullImage';
import Loader from '../../Component/Loader';
import Textlabel from '../../Component/Textlabel';
import { Prime_Color } from '../../Colour/Colour';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { translate } from '../../i18n/Language/useTranslation';

const Document = (props) => {
  const [selectedTab, setSelectedTab] = useState('manual');
  const [manualDocuments, setManualDocuments] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [Imageloading, setImageloading] = useState(false);

  const getDocument = async () => {
    setIsLoading(true);
    const token = await fetchToken();
    const LocationIdstr = await LocationId();

    if (token && LocationIdstr) {
      const LocationId = parseInt(LocationIdstr, 10);
      if (!isNaN(LocationId)) {
        try {
          console.log(LocationId)
          const response = await api.Document(token, LocationId);
          setManualDocuments(response.data.data.manual);
          setPersonalDocuments(response.data.data.personal);
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('Invalid LocationId:', LocationIdstr);
        setIsLoading(false);
      }
    } else {
      console.error('Token or LocationId is null');
      setIsLoading(false);
    }
  };


  const handlesearching = async () => {
    const title = searchQuery;
    const token = await fetchToken();
    const userId = await fetchUserId();
    if (token) {
      try {
        setIsLoading(true)
        const response = await api.searchDocument(token, parseInt(userId), title);
        setIsLoading(false)
        setManualDocuments(response.data.data.manual);
        setPersonalDocuments(response.data.data.personal);
      } catch (error) {
        console.log("searching error:", error);
      }
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      {/* <Textlabel title='Serial Number:' value={index + 1} /> */}
      {/* <Textlabel title='Location:' value={item.location_id || 'All Location'} /> */}
      <Textlabel title={translate('Document.Description')} value={item.description} />
      {/* <View style={styles.statusWrapper}>
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
      </View> */}
      <TouchableOpacity
        style={styles.documentContainer}
        onPress={() => viewFullImage({ fullImage: item.document ? `${Image_Base_Url}/document/${item.document}` : null, setLoading: setImageloading })}
      >
        <Text style={styles.documentText}>{translate('Document.Document')}</Text>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: 'green',
            },
          ]}
        >
          <Text style={styles.statusText}>{translate('Document.DOWNLOAD_DOCUMENT')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    const data = selectedTab === 'manual' ? manualDocuments : personalDocuments;
    return (
      <View style={{ flex: 1 }}>
        {/* {isLoading ? (
          <ActivityIndicator size="large" color={Prime_Color} />
        ) : ( */}
          <FlatList
            data={data}
            // refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getDocument()} />}

            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noDataText}>No Data</Text>}
          />
        {/* )} */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerComponent props={props} title={translate('Document.Document')} color={Prime_Color} onRefresh={getDocument}/>
      
      <View style={styles.content}>
    
        <View style={{}}>
          <View style={styles.row}>
            <TextInput
              placeholder={translate('Document.Enter_description')}
              style={styles.textInput}
              value={searchQuery}
              onChangeText={(value) => setSearchQuery(value)}
            />
            <TouchableOpacity style={styles.button} onPress={handlesearching}>
              <Text style={{color:"white"}}>{translate('Document.Search')}</Text>
            </TouchableOpacity>
          </View>
        
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'manual' && styles.activeTabButton]}
            onPress={() => setSelectedTab('manual')}
          >
            <Text style={selectedTab === 'manual' ? styles.activeTabText : styles.tabText}>{translate('Document.Manual')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'personal' && styles.activeTabButton]}
            onPress={() => setSelectedTab('personal')}
          >
            <Text style={selectedTab === 'personal' ? styles.activeTabText : styles.tabText}>{translate('Document.Personal')}</Text>
          </TouchableOpacity>
        </View>
        {renderTabContent()}
      </View>
      {Imageloading && <Loader Loading={Imageloading} />}
      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }
    </SafeAreaView>
  );
};

export default Document;

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
    alignItems: "center",
    marginVertical: 10,
  },
  textInput: {
    flex: 7, // 70% of the space
    padding: Platform.OS === 'android' ? responsiveHeight(1.3) : responsiveHeight(1.9),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    
  },
  button: {
    flex: 2, // 30% of the space
    paddingVertical: Platform.OS === 'android' ? responsiveHeight(1.8) : responsiveHeight(2),
   
    backgroundColor: Prime_Color,
  
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,

        marginLeft:3,

    borderWidth: 1,
    borderColor: 'gray',
    borderLeftWidth: 0, 
  },

  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: Prime_Color,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
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
    justifyContent:"space-between"
  },
  documentText: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: "600",
    color: "#202020",
  },
});
