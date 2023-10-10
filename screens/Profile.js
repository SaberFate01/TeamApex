import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import {UserContext} from '../userContext';
import {Modal} from 'react-native';

const questions = [
  'How are you feeling today?',
  'Did you sleep well last night?',
  'Have you eaten today?',
  'Did you exercise today?',
  'Have you talked to a friend today?',
];

const Profile = () => {
  const {user} = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleNext = answer => {
    if (currentQuestionIndex < questions.length - 1) {
      setAnswers([...answers, answer]);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handleSubmit = async answer => {
    // Ensure we only have answers for the 5 questions
    const finalAnswers = [...answers, answer].slice(0, questions.length);
    
    // Construct the data to be sent to the API
    const data = {
      userid: user.userid,
      date: new Date().toISOString().split('T')[0], // Get the current date in YYYY-MM-DD format
      ...finalAnswers.reduce(
        (acc, ans, idx) => ({...acc, [`q${idx + 1}`]: ans}),
        {},
      ),
    };
  
    // Send answers to API
    try {
      console.log(data);
      const response = await fetch(
        'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/checkin/post',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
  
      // Handle response...
      if (response.ok) {
        console.log('Submission successful!');
      } else {
        console.log('Submission failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  
    // Reset and close modal
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle}></View>
        <Text style={styles.name}>{user.username}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={() => setIsModalVisible(true)}>
          <Text>Check In</Text>
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.questionText}>
                <Text style={styles.boldText}>
                  {currentQuestionIndex + 1}.{' '}
                </Text>
                {questions[currentQuestionIndex]}
              </Text>
              {/* Radio Buttons */}
              <View style={styles.radioContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={styles.radioOption}
                    onPress={() => handleNext(num)}>
                    <Text>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {currentQuestionIndex < questions.length - 1 ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNext(0)}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit(0)}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.adviceSection}>
        <Text>Well-Being Advice</Text>
        <Text numberOfLines={5}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl
          eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a
          bibendum metus...
        </Text>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.boldText}>Activity/Month</Text>
        <Text>August: 8</Text>
        <View style={styles.redBar}></View>
        <Text>July: 6</Text>
        <View style={styles.yellowBar}>
          <View style={styles.halfFill}></View>
        </View>
        <Text style={styles.boldText}>Total Activities Per Week</Text>
        <Text style={styles.greenText}>1.3 Activity</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'grey',
  },
  name: {
    marginLeft: 10,
  },
  editButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  adviceSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  activitySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  boldText: {
    fontWeight: 'bold',
  },
  redBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginVertical: 5,
    marginHorizontal: 5,
  },
  yellowBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  halfFill: {
    flex: 0.5,
    backgroundColor: 'yellow',
  },
  greenText: {
    color: 'green',
    fontSize: 20,
  },
  checkInButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  closeButton: {
    backgroundColor: '#D3D3D3',
    radius: 20,
    borderRadius: 55,
    padding: 5,
    elevation: 2,
    position: 'absolute',
    left: 10,
    top: 10,
  },
  closeText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  questionText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  radioOption: {
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
