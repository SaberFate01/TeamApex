import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const CreateNext = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Fetching data from previous screen
  const { chosenDate, title, timeFrame } = route.params;

  const [imageUri, setImageUri] = useState(null);
  const [introduction, setIntroduction] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const chooseImage = () => {
    launchImageLibrary({}, response => {
      if (response.uri) {
        setImageUri(response.uri);
      }
    });
  };

  const handleSubmit = () => {
    // Combine all data and navigate or do something with it
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
    // Navigate or send data to API...
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TouchableOpacity 
        style={{ height: height / 4, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderWidth: 1 }}
        onPress={chooseImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Text style={{ fontSize: 24 }}>+ IMAGE</Text>
        )}
      </TouchableOpacity>

      <TextInput 
        style={{ height: height / 3.5, borderColor: 'gray', borderRadius:10,borderWidth: 1, marginTop: 10 }}
        multiline
        placeholder="Introduction"
        value={introduction}
        onChangeText={setIntroduction}
      />

      <TextInput 
        style={{ height: 40, borderColor: 'gray', borderRadius:10,borderWidth: 1, marginTop: 10 }}
        placeholder="Contact number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <TextInput 
        style={{ height: 40, borderColor: 'gray', borderRadius:10,borderWidth: 1, marginTop: 10 }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput 
        style={{ height: 40, borderColor: 'gray', borderRadius:10,borderWidth: 1, marginTop: 10 }}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity 
        style={{ backgroundColor: 'red', height: 40, right:-80,width:200,borderRadius:20,justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
        onPress={handleSubmit}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNext;