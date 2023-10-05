import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button , StyleSheet, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateNext = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { chosenDate, title, timeFrame } = route.params;

  const [imageUri, setImageUri] = useState(null);
  const [introduction, setIntroduction] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      console.log('Image Picker Response: ', response); // Log the entire response
  
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // Check if the URI is being provided
        const uri = response.assets && response.assets[0].uri;
        console.log('Image URI: ', response.uri);
        
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };

  const handleSubmit = () => {
    const allData = {
      chosenDate,
      title,
      timeFrame,
      imageUri,
      introduction,
      contactNumber,
      name,
      address,
    };
    console.log(allData);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imagePicker}
        onPress={chooseImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.addImageText}>+ IMAGE</Text>
        )}
      </TouchableOpacity>

      <TextInput 
        style={styles.introductionInput}
        multiline
        placeholder="Introduction"
        value={introduction}
        onChangeText={setIntroduction}
      />

      <TextInput 
        style={styles.input}
        placeholder="Contact number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <TextInput 
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput 
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNext;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imagePicker: {
    height: height / 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addImageText: {
    fontSize: 24,
  },
  introductionInput: {
    height: height / 3.5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: 'red',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});