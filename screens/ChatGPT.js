import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, ScrollView, Image, Text } from 'react-native';
import OpenAI from 'openai';
const DATABASE_URL = 'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/database';
import {Id} from './AuthScreen.js';

const ChatGPT = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);


  const BOT_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";
  const PERSON_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";
  const BOT_NAME = "GPT-3";
  const PERSON_NAME = "Me";
  const apiKey = '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'; // Replace with your OpenAI API key
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const openai = new OpenAI({
               apiKey: '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' // This is also the default, can be omitted
             });
  const handleSubmit = () => {
    if (input) {
      setMessages(prevMessages => [...prevMessages, { name: PERSON_NAME, img: PERSON_IMG, side: 'right', text: input }]);
      setInput('');
      botResponse();
    }
  };

const botResponse = async () => {
    try {
        const id = Id();
        const query = `SELECT * FROM GPT WHERE senderID='${id}'`;

              console.log('SQL Query:', query); // Log the SQL query

              const response = await fetch(DATABASE_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user: 'root',
                  pass: 'root',
                  db_name: 'users',
                  query: query,
                }),
              });
              var main_message = "";
              const result = await response.json(); // Assuming server returns JSON
              console.log('Server Result:', result); // Log the server response
              if ( String(result) === ""){
                main_message = "";
                const query2 = `INSERT INTO GPT (senderID, message) VALUES ('${id}', '${main_message}')`;
                console.log('SQL Query:', query2); // Log the SQL query
                const response2 = await fetch(DATABASE_URL, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          user: 'root',
                          pass: 'root',
                          db_name: 'users',
                          query: query2,
                        }),
                      });
              }
              else{
                main_message = result[0].message;
                }
/////////////////////////////////////////////////////////////////////////////////////
                console.log("message",main_message);
                if (input.length + main_message.length >=300){
                    main_message = "";
                }
                const chatCompletion = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    messages: [{ role: 'user', content: main_message + input }],
                    model: 'gpt-3.5-turbo',
                  }),
                });
                const chatCompletionData = await chatCompletion.json();
                console.log(chatCompletionData);
                const reply = chatCompletionData.choices[0].message.content;
                const msgText = reply;
                console.log(reply);
                const textGPT = main_message + ' ' + input;
                console.log("text: ",textGPT);
////////////////////////////////////////////////////////////////////////////////////
                const query1 = `UPDATE GPT SET message ='${textGPT}' WHERE senderID='${id}'`;
                                console.log('SQL Query:', query); // Log the SQL query
                                const response1 = await fetch(DATABASE_URL, {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          user: 'root',
                                          pass: 'root',
                                          db_name: 'users',
                                          query: query1,
                                        }),
                                      });
///////////////////////////////////////////////////////////////////////////////////
                const delay = msgText.split(" ").length * 2;
                setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { name: BOT_NAME, img: BOT_IMG, side: 'left', text: msgText }]);
    }, delay);}catch (error) {
                                         console.error('Error fetching ChatGPT response:', error);
                                       }
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

export default ChatGPT;

//import React, { useState } from 'react';
//import { View, TextInput, Button, FlatList, Text } from 'react-native';
//import OpenAI from 'openai';
//const readlineSync = require("readline-sync");
//
//const ChatGPT = () => {
//    const [message, setMessage] = useState('');
//    const [chat, setChat] = useState([]);
//    const apiKey = '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'; // Replace with your OpenAI API key
//    const apiUrl = 'https://api.openai.com/v1/chat/completions';
//    const openai = new OpenAI({
//             apiKey: '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' // This is also the default, can be omitted
//           });
//
//    const sendMessage = async () => {
//        const newChat = [...chat, { role: 'user', content: message }];
//        setChat(newChat);
//        setMessage('');
//
//        try {
//            //const main=cal.main();
//            console.log(message);
//            const chatCompletion = await fetch(apiUrl, {
//              method: 'POST',
//              headers: {
//                'Content-Type': 'application/json',
//                'Authorization': `Bearer ${apiKey}`,
//              },
//              body: JSON.stringify({
//                messages: [{ role: 'user', content: message }],
//                model: 'gpt-3.5-turbo',
//              }),
//            });
//            const chatCompletionData = await chatCompletion.json();
//            console.log(chatCompletionData);
//            const reply = chatCompletionData.choices[0].message.content;
//            console.log(reply);
//            newChat.push({ role: 'assistant', content: reply });
//            setChat(newChat);
//        } catch (error) {
//          console.error('Error fetching ChatGPT response:', error);
//        }
//      };
//
//  return (
//    <View>
//      <FlatList
//        data={chat}
//        keyExtractor={(item, index) => index.toString()}
//        renderItem={({ item }) => <Text>{item.content}</Text>}
//      />
//      <TextInput
//        value={message}
//        onChangeText={(text) => setMessage(text)}
//      />
//      <Button title="Send" onPress={sendMessage} />
//    </View>
//  );
//};
//
//export default ChatGPT;