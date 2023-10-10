// screens/Home.js
import React from 'react';
//import { View, Button, StyleSheet, Dimensions } from 'react-native';
//import { View, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Button,
  Modal,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
//import logo from '../data/Image';
import logo from '../assets/logo.jpg';
import {EVENT_URL} from '../data/Global';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchedEventIDs, setFetchedEventIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(EVENT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '',
            num_return: '100',
          }),
        });
        const result = await response.json();
        const newEvents = result.filter(
          event => !fetchedEventIDs.includes(event.eventID),
        );
        setData(prevData => [...prevData, ...newEvents]);
        setFetchedEventIDs(prevIDs => [
          ...prevIDs,
          ...newEvents.map(event => event.eventID),
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      const results = data.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredData(results);
    }
  }, [searchTerm, data]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const hideModal = () => {
    setSelectedEvent(null);
  };

  const handlePress = item => {
    setSelectedEvent(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Image
          source={require('../assets/magnifying_glass.png')}
          style={styles.magnifyingGlass}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.eventID.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          console.log('Reached end of list'); // Just for debugging
          setPage(prevPage => prevPage + 1);
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<View style={{height: 50}} />} // Adding a footer
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.clickableItemContainer}>
            <Image source={{uri: item.eventImage}} style={styles.image} />
            <View style={styles.descriptionContainer}>
              <Text numberOfLines={3} ellipsizeMode="tail">
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={hideModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Title</Text>
                <Text>{selectedEvent.title}</Text>
                <Text style={styles.modalTitle}>Description</Text>
                <Text>{selectedEvent.description}</Text>
                <Text style={styles.modalTitle}>Cost</Text>
                <Text>{selectedEvent.cost}</Text>
                <Text style={styles.modalTitle}>Age</Text>
                <Text>{selectedEvent.age}</Text>
                <Text style={styles.modalTitle}>Location</Text>
                <Text>{selectedEvent.location}</Text>
                <Text style={styles.modalTitle}>Start Date & Time</Text>
                <Text>{selectedEvent.startDateTime}</Text>
                <Text style={styles.modalTitle}>End Date & Time</Text>
                <Text>{selectedEvent.endDateTime}</Text>
                {/* ... other fields */}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 140,
    height: 60,
  },
  alertButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: width, // full width
    height: height / 4, // one-quarter of the phone's height
    resizeMode: 'cover',
  },
  itemContainer: {
    //height: height / 4, // one-quarter of the phone's height
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  clickableItemContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'flex-start',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 4, // Adjusted flex to give more space to searchBar
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
  magnifyingGlass: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 20,
    right: 20, // Adjusted right position to be near the end of searchBar
  },
  createButton: {
    flex: 1, // Ensure that this stays 1 to take up remaining space
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginRight: 10, // Added marginRight for some spacing between button and side
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 18,
  },
});

export default Home;
