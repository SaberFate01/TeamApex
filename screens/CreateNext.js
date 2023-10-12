import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';

const CreateNext = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {chosenDate, title, timeFrame} = route.params;
  console.log({chosenDate, title, timeFrame});
  const [imageUri, setImageUri] = useState(null);
  const [introduction, setIntroduction] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const chooseImage = () => {
    launchImageLibrary({}, response => {
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

  const formatDateTime = (date, time) => {
    // Ensure date and time are defined
    if (!date || !time) {
      //alert('Please ensure both date and time are selected.');
      //return null;
    }

    // Create a Date object
    const dateTime = new Date(date + 'T' + time + ':00'); // "T" and ":00" are added to create a valid ISO string

    // Validate date and time
    if (isNaN(dateTime)) {
      console.log(dateTime)
      //alert('Invalid date or time. Please try again.');
      //return null;
    }

    // Extract and format the date and time components
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getSeconds()).padStart(2, '0');

    // Construct the formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = () => {
    const eventData = {
      title: title,
      description: introduction,
      age: 'All ages',
      cost: 'Free',
      startDateTime: chosenDate,
      endDateTime: timeFrame,
      location: address,
      eventImage: imageUri,
    };
    console.log(eventData);

    // Send POST request
    fetch(
      'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),  
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Navigate to Homepage upon successful creation
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert(
          'Error',
          'There was an error creating the event. Please try again.',
        );
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={chooseImage}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.image} />
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNext;

const {height} = Dimensions.get('window');

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
