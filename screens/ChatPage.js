import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {UserContext} from '../userContext';
import axios from 'axios';
import {event} from 'webix';

const ChatPage = ({route, navigation}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const {chatData, username} = route.params;
  const {user} = useContext(UserContext);
  const eventId = route.params?.eventId;
  const [eventData, setEventData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=${eventId}`,
        );
        setEventData(response.data); // Adjust according to actual API response structure
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  //console.log(chatData, username);

  useEffect(() => {
    if (eventId) {
      // Automatically send a message about the shared event
      handleSubmit('An event has been shared.', eventId);
    }
    // Fetch initial messages
    fetchMessages();

    // Fetch messages every 5 seconds
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.post(
        'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/get',
        {
          userID: user.userid, // Use actual user ID
          otherID: chatData.otherID,
        },
      );
      // Organize and set messages based on timestamp
      const fetchedMessages = response.data; // Adjust according to actual API response
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const formatTimestamp = date => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${sec}`;
  };

  const handleSubmit = async (messageText = input, eventID = null) => {
    if (messageText) {
      try {
        await axios.post(
          'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/chat/send',
          {
            senderID: user.userid,
            recipientID: chatData.otherID,
            timestamp: formatTimestamp(new Date()),
            message: messageText,
            eventID: eventID,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        setMessages(prevMessages => [
          ...prevMessages,
          {
            senderID: user.userid,
            recipientID: chatData.otherID,
            timestamp: new Date().toISOString(),
            message: messageText,
            eventID: eventID,
          },
        ]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleEventClick = async eventId => {
    try {
      const response = await axios.get(
        `https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/events/get?eventID=${eventId}`,
      );
      // Set the fetched event data and open the modal
      setEventData(response.data); // Adjust according to actual API response
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching event data:', error);
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
            {msg.eventID ? (
              <TouchableOpacity
                onPress={() => handleEventClick(msg.eventID)}
                style={[
                  msg.senderID === user.userid
                    ? styles.rightBubble
                    : styles.leftBubble,
                  styles.eventMessage,
                ]}>
                <Text style={styles.msgName}>
                  {msg.senderID === user.userid ? PERSON_NAME : BOT_NAME}
                </Text>
                <Text style={styles.msgText}>{msg.message}</Text>
              </TouchableOpacity>
            ) : (
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
            )}
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
      {eventData && modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={styles.modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.row1}>
                  <Image
                    source={{uri: eventData.eventImage}}
                    style={styles.rowImage}
                  />
                  <Text style={styles.modalTitle}>{eventData.title}</Text>
                </View>
                <View style={styles.row2}>
                  <Text>{eventData.description}</Text>
                </View>
                <View style={styles.row3}>
                  <Text style={styles.modalTitle}>Cost: {eventData.cost}</Text>
                  <Text style={styles.modalTitle}>Age: {eventData.age}</Text>
                  <Text style={styles.modalTitle}>
                    Location: {eventData.location}
                  </Text>
                  <Text style={styles.modalTitle}>
                    Start Date: {eventData.startDateTime}
                  </Text>
                  <Text style={styles.modalTitle}>
                    End Date: {eventData.endDateTime}
                  </Text>
                </View>
                <View style={styles.row4}>
                  <TouchableOpacity
                    style={[styles.button, styles.joinButton]}
                    onPress={() => {
                      setModalVisible(false); // Close the modal
                      navigation.navigate('Profile', {
                        screen: 'Profile',
                        params: {event: eventData},
                      });
                    }}>
                    <Text style={styles.buttonText}>Join</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('window');
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
  eventMessage: {
    backgroundColor: '#d0f0c0', // Light green, adjust as needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  modal: {
    margin: 0, // Ensure there's no margin
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%', // Ensure the content takes the full width
    backgroundColor: 'white',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  modalView: {
    width: '100%', // Ensure this takes the full width
    backgroundColor: 'white',
    // Remove or adjust the following properties that might be causing white space:
    // margin: 20,
    // borderRadius: 20,
    //]] padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  row1: {
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  row2: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    width: '100%',
  },
  row3: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    width: '100%',
  },
  rowImage: {
    width: '100%',
    height: 200, // Adjusted height
    resizeMode: 'cover',
  },
  row4: {
    backgroundColor: '#fff2e6',
    alignItems: 'center', // Center the buttons horizontally
    padding: 10,
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1, // Add flex to adjust width according to available space
    paddingVertical: 10,
    width: 100,
    paddingHorizontal: 10, // Reduce horizontal padding if needed
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center', // Center text vertically
  },
  joinButton: {
    backgroundColor: 'red',
    marginRight: 5, // Adjust spacing between buttons
  },
  shareButton: {
    backgroundColor: 'red',
    marginLeft: 5, // Adjust spacing between buttons
  },
  image: {
    width: '100%', // full width
    height: height / 4, // one-quarter of the phone's height
    resizeMode: 'cover',
  },
  itemContainer: {
    //height: height / 4, // one-quarter of the phone's height
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', // Align text to the left
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChatPage;
