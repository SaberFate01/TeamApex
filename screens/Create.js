import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';


const Create = ({ navigation }) => {
  const [chosenDate, setChosenDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  const handleDayPress = (day) => {
    setChosenDate(new Date(day.timestamp));
  };

  const isValidTime = (timeStr) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(timeStr);
  };
  const formatDateTime = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const h = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    const s = String(dateObj.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  };

  const handleCreateActivity = () => {
    const formattedChosenDate = formatDateTime(chosenDate);
    // Pass the data to the next screen
    const timeFrameDateObj = new Date(timeFrame);
    if (isNaN(timeFrameDateObj)) {
      // Inform the user that the timeFrame format is invalid
      Alert.alert("Invalid Date Format", "Please enter a valid date in 2023-10-07 10:00:00 format.");
      return;
    }
    const formattedTimeFrame = formatDateTime(timeFrameDateObj);
    console.log({
      chosenDate: formattedChosenDate,
      title: title,
      timeFrame: formattedTimeFrame,
    });
    navigation.navigate('CreateNext', {
      chosenDate: formattedChosenDate,
      title: title,
      timeFrame: formattedTimeFrame,
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
        placeholder="Start Time Frame"
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
