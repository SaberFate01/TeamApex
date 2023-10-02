import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Linking } from 'react-native';
import logo from '../assets/logo.jpg';

const CustomHeader = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);

  const handleEmergencyCall = () => {
    Linking.openURL('tel:999');
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={showModal}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleEmergencyCall}>
              <Text style={styles.modalButtonText}>Call Emergency</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => { /* Share location logic */ }}>
              <Text style={styles.modalButtonText}>Share Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <TouchableOpacity 
          style={styles.exclamationButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.exclamationText}>!</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  exclamationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclamationText: {
    fontSize: 24,
    color: 'white',
  },
  buttonText: {
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomHeader;
