// screens/Home.js
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import {ActivityIndicator} from 'react-native';
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
  const navigation = useNavigation();

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
          onRequestClose={hideModal}
          style={styles.modal} // Ensure the modal itself has styles to take full width
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.row1}>
                  <Image
                    source={{uri: selectedEvent.eventImage}}
                    style={styles.rowImage}
                  />
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                </View>
                <View style={styles.row2}>
                  <Text>{selectedEvent.description}</Text>
                </View>
                <View style={styles.row3}>
                  <Text style={styles.modalTitle}>
                    Cost: {selectedEvent.cost}
                  </Text>
                  <Text style={styles.modalTitle}>
                    Age: {selectedEvent.age}
                  </Text>
                  <Text style={styles.modalTitle}>
                    Location: {selectedEvent.location}
                  </Text>
                  <Text style={styles.modalTitle}>
                    Start Date: {selectedEvent.startDateTime}
                  </Text>
                  <Text style={styles.modalTitle}>
                    End Date: {selectedEvent.endDateTime}
                  </Text>
                </View>
                <View style={styles.row4}>
                  <TouchableOpacity
                    style={[styles.button, styles.joinButton]}
                    onPress={() => {
                      setModalVisible(false); // Close the modal
                      navigation.navigate('Profile', {
                        screen: 'Profile',
                        params: {event: selectedEvent},
                      });
                    }}>
                    <Text style={styles.buttonText}>Join</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.shareButton]}
                    onPress={() => {
                      setModalVisible(false); // Close the modal
                      navigation.navigate('Chat', {
                        eventId: selectedEvent.eventID,
                      });
                    }}>
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>
                </View>
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
    width: '100%', // full width
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
  modal: {
    margin: 0, // Ensure there's no margin
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%', // Ensure the content takes the full width
    backgroundColor: 'white',
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
    width: '100%', // Ensure this takes the full width
    backgroundColor: 'white',
    // Remove or adjust the following properties that might be causing white space:
    // margin: 20,
    // borderRadius: 20,
    //]] padding: 35,
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
  row1: {
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  row2: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    width: '100%',
  },
  row3: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    width: '100%',
  },
  rowImage: {
    width: '100%',
    height: 200, // Adjusted height
    resizeMode: 'cover',
  },
  row4: {
    backgroundColor: '#fff2e6',
    alignItems: 'center', // Center the buttons horizontally
    padding: 10,
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1, // Add flex to adjust width according to available space
    paddingVertical: 10,
    width: 100,
    paddingHorizontal: 10, // Reduce horizontal padding if needed
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center', // Center text vertically
  },
  joinButton: {
    backgroundColor: 'red',
    marginRight: 5, // Adjust spacing between buttons
  },
  shareButton: {
    backgroundColor: 'red',
    marginLeft: 5, // Adjust spacing between buttons
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
    textAlign: 'left', // Align text to the left
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
