import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import {UserContext} from '../userContext';
import axios from 'axios';

const ChatPageGroup = ({route, navigation}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const {chatRoom, userID, username} = route.params;
  const [groupData, setGroupData] = useState([]);
  const {user} = useContext(UserContext);
  //console.log(chatRoom,userID,username);

  useEffect(() => {
    // Fetch initial messages
    fetchGroupMessage();

    // Fetch messages every 5 seconds
    const intervalId = setInterval(() => {
      fetchGroupMessage();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchGroupMessage = async () => {
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
            chatRoom: chatRoom,
          }),
        },
      );
      const result = await response.json();
      // Ensure that the messages are in the correct format and update the `messages` state
      if (result.inter_chat && result.inter_chat.length > 0) {
        setMessages(result.inter_chat[0].rows);
      }
    } catch (error) {
      console.error('Error fetching group chat data:', error);
    }
  };

  const formatTimestamp = date => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    console.log(`${yyyy}/${mm}/${dd} ${hh}:${min}:${sec}`)
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
  };
  const handleSubmit = async () => {
    if (input) {
      try {
        // Send message to server
        await axios.post(
          'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/group_chat/send',
          {
            senderID: user.userid,
            chatRoom: chatRoom,
            chatName: "TestMessage",
            timestamp: formatTimestamp(new Date()),
            message: input,
            type: "event", // Ensure this is correct for your use case
            EventId: 1001, // Ensure this is correct for your use case
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        // Add message to local state and clear input
        setMessages(prevMessages => [
          ...prevMessages,
          {
            senderID: user.userid,
            chatRoom: chatRoom,
            timestamp: new Date().toISOString(),
            message: input,
          },
        ]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };  

  const BOT_IMG =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png';
  const PERSON_IMG =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png';
  const BOT_NAME = username;
  const PERSON_NAME = user.username;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={
              msg.senderID === user.userid ? styles.rightMsg : styles.leftMsg
            }>
            <Image
              source={{
                uri: msg.senderID === user.userid ? PERSON_IMG : BOT_IMG,
              }}
              style={styles.msgImg}
            />
            <View
              style={
                msg.senderID === user.userid
                  ? styles.rightBubble
                  : styles.leftBubble
              }>
              <Text style={styles.msgName}>
                {msg.senderID === user.userid ? PERSON_NAME : BOT_NAME}
              </Text>
              <Text style={styles.msgText}>{msg.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Enter your message..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chat: {
    flex: 1,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'grey',
    marginRight: 10,
  },
  leftMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  rightMsg: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  msgImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  leftBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ececec',
  },
  rightBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#579ffb',
  },
  msgName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  msgText: {
    fontSize: 16,
  },
  inputArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
});

export default ChatPageGroup;
