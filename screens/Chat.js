import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ChatPage from './ChatPage';
import ChatGPT from './ChatGPT';
import {UserContext} from '../userContext';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [usernames, setUsernames] = useState({});
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const {user} = useContext(UserContext);
  const [groupData, setGroupData] = useState([]);

  const gptData = [
    {
      otherID: '3',
      usernames: 'GPT',
      rows: [
        {
          message: 'Chat with GPT!',
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ];
  const filteredData = data.filter(item => {
    const username = usernames[item.otherID] || 'Unknown User';
    return username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/get',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userID: user.userid,
            }),
          },
        );
        const result = await response.json();

        // Fetch usernames for all otherIDs
        const otherIDs = result.map(chatData => chatData.otherID);
        const usernames = await fetchUsernames(otherIDs);

        // Add GPT to usernames
        usernames['3'] = 'GPT';

        setUsernames(usernames);

        // Merge gptData and fetched data
        setData([...gptData, ...result]);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchData();

    const fetchGroupData = async () => {
      try {
        const response = await fetch(
          'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/group_chat/get',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userID: user.userid,
            }),
          },
        );
        const result = await response.json();
        setGroupData(result.inter_chat);
      } catch (error) {
        console.error('Error fetching group chat data:', error);
      }
    };

    fetchGroupData();
  }, []);

  const fetchUsernames = async otherIDs => {
    try {
      // Fetch usernames for all otherIDs and return an object mapping otherID to username
      const usernames = {};
      for (const otherID of otherIDs) {
        const response = await fetch(
          'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/database',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: 'root',
              pass: 'root',
              db_name: 'users',
              query: `SELECT * FROM userprofiles WHERE userid='${otherID}'`,
            }),
          },
        );
        const result = await response.json();
        usernames[otherID] = result[0]?.username || 'Unknown User';
      }
      return usernames;
    } catch (error) {
      console.error('Error fetching usernames:', error);
      return {};
    }
  };
  const handlePersonalChatClick = item => {
    const username = usernames[item.otherID] || 'Unknown User';
    if (item.otherID === '3') {
      navigation.navigate('ChatGPT', {chatData: item});
    } else {
      navigation.navigate('ChatPage', {chatData: item, username: username});
    }
  };
  const handleGroupChatClick = chatRoom => {
    console.log({chatRoom, userID: user.userid, username: user.username});
    navigation.navigate('ChatPageGroup', {
      chatRoom,
      userID: user.userid,
      username: user.username,
    });
  };

  return (
    <View style={styles.container}>
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
      <FlatList
        data={[...data, ...groupData]}
        keyExtractor={item => item.otherID || item.chatRoom.toString()}
        renderItem={({item}) => {
          if (item.otherID) {
            // Render personal chat
            const username = usernames[item.otherID] || 'Unknown User';
            const lastMessage = item.rows?.reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp)
                ? message
                : latest;
            }, item.rows[0]) || {message: 'No messages'};
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handlePersonalChatClick(item)}>
                <View style={styles.logo}></View>
                <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{username}</Text>
                  <Text style={styles.messageText}>{lastMessage.message}</Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            // Render group chat
            const lastMessage = item.rows?.reduce((latest, message) => {
              return new Date(message.timestamp) > new Date(latest.timestamp)
                ? message
                : latest;
            }, item.rows[0]) || {message: 'No messages'};
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleGroupChatClick(item.chatRoom)}>
                <View style={styles.logo}></View>
                <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{lastMessage.chatName}</Text>
                  <Text style={styles.messageText}>{lastMessage.message}</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
};
/**
 * 
 * <TouchableOpacity style={styles.createButton}>
<Text style={styles.createButtonText}>Create</Text>
</TouchableOpacity>
 */

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
  searchBar: {
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
    top: 15,
    right: 25,
  },
});

export default HomePage;
