import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatPage from './ChatPage';
import ChatGPT from './ChatGPT';

const data = [
  { id: '1', name: 'My family', message: 'William: For fishing!' },
  { id: '2', name: 'Mr. L Fruit Picking', message: 'Our event is on...' },
  { id: '3', name: 'Healthy Living care', message: 'Please note on the date of the event...' },
  { id: '4', name: 'Jetta travel', message: 'The shuttle is arriving at...' },
  { id: '5', name: 'GPT', message: 'You know who!' }
];

const HomePage = () => {
  const navigation = useNavigation();

  const handleItemClick = (itemName) => {
    if (itemName === 'My family') {
      navigation.navigate('ChatPageGroup'); // Navigate to ChatPageGroup if 'My family' is clicked
    }else if (itemName === 'GPT') {
           navigation.navigate('ChatGPT');
   }
    else {
      navigation.navigate('ChatPage'); // Default navigation to ChatPage for other items
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => handleItemClick(item.name)}
          >
            <View style={styles.logo}></View>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'grey',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: 'grey',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#128C7E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;