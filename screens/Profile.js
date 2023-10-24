import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  ScrollView,
} from 'react-native';
import {UserContext} from '../userContext';
import {Modal} from 'react-native';
import chart from '../assets/chart.png';
import PieChart from 'react-native-pie-chart';

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
  const chartSeries = [10, 5, 3]; // YunFei, Joel, ChatGPT
  const sliceColor = ['#F46530', '#FF9E7A', '#D4EDF4']; // Colors for each section
  const getImage = imageName => {
    switch (imageName) {
      case 'med_social':
        return require('../assets/mid_social.png');
      case 'low_social':
        return require('../assets/low_social.png');
      case 'high_social':
        return require('../assets/high_social.png');
      default:
        return require('../assets/low_social.png'); // default image
    }
  };
  const images = ['low_social', 'mid_social', 'high_social'];
  const texts = {
    low_social: 'Low Social',
    med_social: 'Medium Social',
    high_social: 'High Social',
  };
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, paddingHorizontal: 0}}>
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
          <Text style={styles.boldText}>Well-Being Advice</Text>
          <Image
            source={getImage(selectedImage)}
            style={styles.adviceImage}
            resizeMode="contain"
          />
          <Text style={styles.adviceHeader}>{texts[selectedImage]}</Text>

          <Text numberOfLines={5}>
            Engaging in social activities can enhance your mood and overall
            well-being.
          </Text>
        </View>
        <View style={styles.barchartSection}>
          <Text style={styles.boldText}>Average Activity</Text>
          <View style={styles.chartContainer}>
            <Image
              source={require('../assets/chart.png')}
              style={styles.chartImage}
              resizeMode="contain"
            />
            <Text style={styles.chartText}>1.3</Text>
          </View>
        </View>
        <View style={styles.activitySection}>
          <Text style={styles.boldText}>Activity/Month</Text>
          <Text>October: 8</Text>
          <View style={styles.redBar}></View>
          <Text>September: 5</Text>
          <View style={styles.yellowBar}>
            <View style={styles.halfFill}></View>
          </View>
          <Text style={styles.boldText}>
            Total Activities Joined This Month
          </Text>
          <Text style={styles.greenText}>8 Activity</Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.boldText}>Most contacted person this month</Text>
          <View style={styles.chartAndLegend}>
            <PieChart
              widthAndHeight={200} // or another size you want
              series={chartSeries}
              sliceColor={sliceColor}
              doughnut={true}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />
            <View style={styles.legend}>
              {['YunFei', 'Joel', 'Franklin'].map((name, index) => (
                <View style={styles.legendItem} key={name}>
                  <View
                    style={[
                      styles.colorBox,
                      {backgroundColor: sliceColor[index]},
                    ]}
                  />
                  <Text>
                    {name}: {chartSeries[index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    width: '100%',
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
    alignItems: 'center', // Center the items horizontally
  },
  adviceImage: {
    width: '100%', // 80% of the screen width
    height: undefined,
    aspectRatio: 1164 / 304, // Keep your image aspect ratio
  },
  adviceHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  redBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#59981A',
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
    backgroundColor: '#88CA5E',
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
  barchartSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    position: 'relative',
    width: '90%',
    height: 200, // Adjust the height as per your requirement
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartImage: {
    width: '100%',
    height: '100%',
  },
  chartText: {
    position: 'absolute',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    top: 102, // Adjust as per your requirement
    left: 45, // Adjust as per your requirement
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f3f2',
    marginTop: '50',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  chartAndLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '50',
  },
  legend: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default Profile;
