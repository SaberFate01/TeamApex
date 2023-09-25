import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import axios from 'axios';
import OpenAI from 'openai';
//const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
const cal = require("./GPT.js")

const ChatGPT = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const apiKey = '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'; // Replace with your OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/completions'; // Adjust the endpoint as needed
    const openai = new OpenAI({
             apiKey: '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' // This is also the default, can be omitted
           });

    const sendMessage = async () => {
        const newChat = [...chat, { role: 'user', content: message }];
        setChat(newChat);
        setMessage('');

        try {
            const main=cal.main();
            //console.log();
            const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',});
            console.log("2");
            console.log(chatCompletion.choices);
            const reply = chatCompletion.choices[0].message;
            console.log(reply);
            newChat.push({ role: 'assistant', content: reply });
            setChat(newChat);
        } catch (error) {
          console.error('Error fetching ChatGPT response:', error);
        }
      };

  return (
    <View>
      <FlatList
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatGPT;


//            const completion = await openai.chat.completions.create({
//                model: 'gpt-3.5-turbo',
//                messages: [
//                      { "role": 'user', "content": 'Hello!' }
//                    ],
//            });
//            console.log("1");
//            console.log(chatCompletion.choices[0].message);