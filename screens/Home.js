// screens/Home.js
import React from 'react';
//import { View, Button, StyleSheet, Dimensions } from 'react-native';
//import { View, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, ScrollView, Button, Modal} from 'react-native';
import { useState, useEffect } from 'react';
//import logo from '../data/Image';
import logo from '../assets/logo.jpg';
import {EVENT_URL} from '../data/Global'

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchedEventIDs, setFetchedEventIDs] = useState([]);

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
            query: "",
            num_return: "100",
          }),
        });
        const result = await response.json();
        const newEvents = result.filter(event => !fetchedEventIDs.includes(event.eventID));
        setData(prevData => [...prevData, ...newEvents]);
        setFetchedEventIDs(prevIDs => [...prevIDs, ...newEvents.map(event => event.eventID)]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const hideModal = () => {
    setSelectedEvent(null);
  };

  const handlePress = (item) => {
    setSelectedEvent(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.eventID.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          console.log("Reached end of list"); // Just for debugging
          setPage(prevPage => prevPage + 1);
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<View style={{ height: 50 }} />} // Adding a footer
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.clickableItemContainer}>
            <Image source={{ uri: item.eventImage }} style={styles.image} />
            <View style={styles.descriptionContainer}>
              <Text numberOfLines={3} ellipsizeMode="tail">{item.description}</Text>
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
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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


/**
 * const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://acoustic-cirrus-396009.ts.r.appspot.com/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: "",
            num_return: "5",
          }),
        });
        const result = await response.json();
        setData(prevData => [...prevData, ...result]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.eventID.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={() => setPage(prevPage => prevPage + 1)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.eventImage.url }} style={styles.image} />
            <View style={styles.descriptionContainer}>
              <Text>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

 */

const { width, height } = Dimensions.get('window');

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'  // semi-transparent background
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  backButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: "#2196F3",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});


export default Home;



/**
 * import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import logo from '../assets/logo.jpg';

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
    <Image source={logo} style={styles.logo} />
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.buttonText}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Create')}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 20,
  }
});

export default CustomHeader;
 */