import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, ScrollView, Image, Text } from 'react-native';


const ChatPage = ({ route, navigation }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { chatData } = route.params;
  console.log(chatData);
  const BOT_MSGS = [
    "Hi, how are you?",
    "Ohh... I can't understand what you trying to say. Sorry!",
    "I like to play games... But I don't know how to play!",
    "Sorry if my answers are not relevant. :))",
    "I feel sleepy! :("
  ];

  const BOT_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";
  const PERSON_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";
  const BOT_NAME = "Fate";
  const PERSON_NAME = "Saber";

  const handleSubmit = () => {
    if (input) {
      setMessages(prevMessages => [...prevMessages, { name: PERSON_NAME, img: PERSON_IMG, side: 'right', text: input }]);
      setInput('');
      botResponse();
    }
  };

const botResponse = () => {
    const r = Math.floor(Math.random() * BOT_MSGS.length);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { name: BOT_NAME, img: BOT_IMG, side: 'left', text: msgText }]);
    }, delay);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((msg, index) => (
          <View key={index} style={msg.side === 'right' ? styles.rightMsg : styles.leftMsg}>
            <Image source={{ uri: msg.img }} style={styles.msgImg} />
            <View style={msg.side === 'right' ? styles.rightBubble : styles.leftBubble}>
              <Text style={styles.msgName}>{msg.name}</Text>
              <Text style={styles.msgText}>{msg.text}</Text>
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
    padding: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  chat: {
    flex: 1,
    padding: 10
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
    marginBottom: 10
  },
  rightMsg: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  msgImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  leftBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ececec'
  },
  rightBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#579ffb'
  },
  msgName: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  msgText: {
    fontSize: 16
  },
  inputArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee'
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd'
  }
});

export default ChatPage;
