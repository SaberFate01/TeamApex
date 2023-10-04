import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';


const Create = ({ navigation }) => {
  const [chosenDate, setChosenDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  const handleDayPress = (day) => {
    setChosenDate(new Date(day.timestamp));
  };

  const handleCreateActivity = () => {
    // Pass the data to the next screen
    navigation.navigate('CreateNext', {
      chosenDate: chosenDate,
      title: title,
      timeFrame: timeFrame,
    });
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => handleDayPress(day)}
        markedDates={{
          [chosenDate.toISOString().split('T')[0]]: {selected: true},
        }}
      />
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Time Frame"
        value={timeFrame}
        onChangeText={setTimeFrame}
        style={styles.input}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateActivity}>
        <Text style={styles.buttonText}>CREATE ACTIVITY</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: 'red',
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Create;
