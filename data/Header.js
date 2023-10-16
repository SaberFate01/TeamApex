import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Linking } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import logo from '../assets/logo.jpg';

const CustomHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const state = useNavigationState(state => state);

  const handleEmergencyCall = () => {
    Linking.openURL('tel:999');
  };

  const isRouteActive = (routeName) => {
    return state.routes[state.index].name === routeName;
  };

  const renderTab = (routeName, label) => {
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate(routeName)}
        style={styles.tab}
      >
        <Text style={styles.buttonText}>{label}</Text>
        {isRouteActive(routeName) && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    );
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
          <Text style={styles.exclamationText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        {renderTab('Home', 'Events')}
        {renderTab('Chat', 'Chat')}
        {renderTab('Create', 'Create')}
        {renderTab('Profile', 'Profile')}
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
  tab: {
    alignItems: 'center',
  },
  activeTabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
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
