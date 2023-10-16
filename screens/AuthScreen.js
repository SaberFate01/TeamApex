import React, {useState, useContext} from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
  ScrollView,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../userContext';

const DATABASE_URL =
  'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/database';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const {setUser} = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  const onChangeHandler = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const EmailCheck = mail => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) {
      return false;
    }
    return true;
  };

  const check = query => {
    if (
      query.includes('=') ||
      query.includes('#') ||
      query.includes('/*') ||
      query.includes('*/') ||
      query.includes('union') ||
      query.includes('--')
    ) {
      console.log(query);
      return true;
    }
    return false;
  };

  const onSubmitHandler = async () => {
    try {
      const query = isLogin
        ? `SELECT * FROM userprofiles WHERE email='${email}' AND password='${password}'`
        : `INSERT INTO userprofiles (email, username, password, date_of_birth) VALUES ('${email}', '${name}', '${password}', '${dateOfBirth}')`;
      if (!isLogin) {
        if (check(email) || check(password) || EmailCheck(email)) {
          throw new Error('Bad credentials');
        }
      }
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

      const result = await response.json(); // Assuming server returns JSON

      console.log('Server Response:', result); // Log the server response
      /////////////////////////////////////////////////////////////////////////////////
      if (isLogin) {
        user_auth(result[0].userid);
        console.log(Id());
      } else {
        const query_login = `SELECT * FROM userprofiles WHERE email='${email}' AND password='${password}'`;

        console.log('SQL Query:', query_login); // Log the SQL query

        const response_login = await fetch(DATABASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: 'root',
            pass: 'root',
            db_name: 'users',
            query: query_login,
          }),
        });

        const result_login = await response_login.json(); // Assuming server returns JSON

        console.log('Server Response:', result_login); // Log the server response
        user_auth(result_login[0].userid);
        console.log(Id());
      }
      /////////////////////////////////////////////////////////////////////////////////
      if (isLogin) {
        if (result && result.length > 0 && result[0].email === email) {
          // Adjust this based on actual server response
          setUser({
            userid: result[0].userid,
            username: result[0].username,
          });
          navigation.navigate('Home');
        } else {
          setIsError(true);
          setMessage('Invalid email or password');
        }
      } else {
        if (response.status === 200) {
          // Adjust this based on actual server response
          setIsError(false);
          setMessage('Signup successful');
          navigation.navigate('Home');
        } else {
          setIsError(true);
          setMessage(result.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setMessage('An error occurred');
    }
  };

  const getMessage = () => {
    const status = isError ? `Error: ` : `Success: `;

    return status + message;
  };

  return (
    <ImageBackground
      source={require('../assets/gradient-back.jpeg')}
      style={styles.image}>
      <View style={styles.card}>
        <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={setEmail}></TextInput>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={setName}></TextInput>
            )}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                onChangeText={setDateOfBirth}></TextInput>
            )}
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Password"
              onChangeText={setPassword}></TextInput>
            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>
              {message ? getMessage() : null}
            </Text>
            <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonAlt}
              onPress={onChangeHandler}>
              <Text style={styles.buttonAltText}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.agreementText}>
        By logging in, you agree with our{' '}
        <Text onPress={() => setModalVisible(true)} style={styles.termsText}>
          terms and conditions
        </Text>
      </Text>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.modalTitle}>
                  Terms, Conditions and Privacy Policy
                </Text>
                <Text style={styles.modalText}>
                  Effective Date: October 07, 2023{'\n\n'}
                  Welcome to ELDOME, a social networking mobile app designed for
                  older adults, with the option for younger users to also join
                  and participate. By using this app, you agree to comply with
                  the following Terms and Conditions and acknowledge our Privacy
                  Policy:{'\n\n'}
                  <Text style={styles.modalSubTitle}>Terms and Conditions</Text>
                  {'\n\n'}
                  1. Acceptance of Terms{'\n'}
                  By downloading, installing, or using the ELDOME, you agree to
                  be bound by these Terms and Conditions. If you do not agree to
                  these terms, please do not use the app.{'\n\n'}
                  2. Eligibility{'\n'}
                  This app is primarily intended for individuals aged 55 and
                  above. Users below the age of 55 are welcome to use the app,
                  but they must respect the primary target audience. All users
                  must provide accurate and complete registration information.
                  {'\n\n'}
                  3. Privacy and Data Protection {'\n'}
                  Your privacy is important to us. We collect and process your
                  personal information in accordance with our Privacy Policy. By
                  using the app, you consent to our collection and use of your
                  personal information as outlined in the Privacy Policy.
                  {'\n\n'}
                  4. User Conduct {'\n'}
                  a. You agree to use the app in compliance with all applicable
                  laws and regulations. {'\n'}b. You will not impersonate any
                  other individual or entity. {'\n'}c. You will not engage in
                  any form of harassment, hate speech, or bullying towards other
                  users. {'\n'}d. You will not upload, share, or promote any
                  inappropriate or offensive content. {'\n'}e. You will not
                  engage in any fraudulent or illegal activities on the app.
                  {'\n\n'}
                  5. Chat and Communication{'\n'}
                  a. The app provides individual and group chat features. Be
                  respectful and considerate when communicating with other
                  users. {'\n'}b. The app records chat conversations for
                  security and moderation purposes. Users are responsible for
                  their own messages and should exercise discretion in sharing
                  personal information.
                  {'\n\n'}
                  6. Attending Events
                  {'\n'}a. Users can attend events hosted on the app. Attendance
                  is voluntary.
                  {'\n'}b. Events may be recorded for reference and archival
                  purposes.
                  {'\n\n'}
                  7. Daily Check-In Questionnaire a. Users are encouraged to
                  complete daily check-in questionnaires provided by WHO-5 for
                  mental and social well-being assessment.
                  {'\n'}b. The information collected through these
                  questionnaires is confidential and used solely for the purpose
                  of providing well-being insights to the user.
                  {'\n\n'}
                  8. Data Visualization
                  {'\n'}a. The app provides data visualization tools to help
                  users track their mental and social well-being based on their
                  chat conversations, events attended, and daily check-ins.
                  {'\n'}b. Data visualization is for informational purposes and
                  should not be considered a substitute for professional medical
                  or psychological advice.
                  {'\n\n'}
                  9. Termination of Account {'\n'}a. We reserve the right to
                  terminate or suspend your account at our discretion if you
                  violate these Terms and Conditions or engage in activities
                  that disrupt the app's functionality. {'\n'}b. You can
                  deactivate your account at any time by following the app's
                  instructions.
                  {'\n\n'}10. Changes to Terms and Conditions {'\n'}We may
                  update these Terms and Conditions from time to time. You will
                  be notified of any changes, and your continued use of the app
                  after such changes will constitute your acceptance of the
                  revised terms.
                  {'\n\n'}11. Disclaimer ELDOME is not a substitute for
                  professional medical, psychological, or social services. Users
                  are encouraged to seek appropriate help when needed.
                  {'\n\n'}
                  12. Contact Us{'\n'}
                  If you have any questions or concerns regarding these Terms
                  and Conditions, please contact us at apexteam049@gmail.com or
                  visit https://eldome.weebly.com/.{'\n\n'}
                  By using ELDOME, you acknowledge that you have read,
                  understood, and agree to these Terms and Conditions. Enjoy
                  your experience on the app and stay connected with others.
                  {'\n\n'}
                  <Text style={styles.modalSubTitle}>Privacy Policy</Text>
                  {'\n\n'}
                  Last updated: October 07, 2023{'\n\n'}
                  Interpretation and Definitions (Definitions as provided in the
                  Privacy Policy section){'\n\n'}
                  Collecting and Using Your Personal Data (Information as
                  provided in the Privacy Policy section){'\n\n'}
                  Retention of Your Personal Data The Company will retain Your
                  Personal Data only for as long as is necessary for the
                  purposes set out in this Privacy Policy.{'\n\n'}We will retain and
                  use Your Personal Data to the extent necessary to comply with
                  our legal obligations {'\n\n'}(for example, if we are required to
                  retain your data to comply with applicable laws), resolve
                  disputes, and enforce our legal agreements and policies. The
                  Company will also retain Usage Data for internal analysis
                  purposes. {'\n\n'}Usage Data is generally retained for a shorter
                  period of time, except when this data is used to strengthen
                  the security or to improve the functionality of Our Service,
                  or We are legally obligated to retain this data for longer
                  time periods. {'\n\n'}Transfer of Your Personal Data (Information as
                  provided in the Privacy Policy section)
                  {'\n\n'}
                  Delete Your Personal Data (Information as provided in the
                  Privacy Policy section)
                  {'\n\n'}
                  Disclosure of Your Personal Data (Information as provided in
                  the Privacy Policy section)
                  {'\n\n'}
                  Security of Your Personal Data (Information as provided in the
                  Privacy Policy section)
                  {'\n\n'}
                  Children's Privacy (Information as provided in the Privacy
                  Policy section)
                  {'\n'}
                  Links to Other Websites (Information as provided in the
                  Privacy Policy section)
                  {'\n'}
                  Changes to this Privacy Policy (Information as provided in the
                  Privacy Policy section)
                  {'\n'}
                  Contact Us (Information as provided in the Privacy Policy
                  section)
                </Text>
                <Text style={styles.modalTitle}></Text>
                <Text style={styles.modalText}>
                  {/* More long text goes here */}
                </Text>
                {/* ... Additional content ... */}
                <Button title="Back" onPress={() => setModalVisible(false)} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  authContainer: {},
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: '80%',
    marginTop: '40%',
    borderRadius: 20,
    maxHeight: 380,
    paddingBottom: '30%',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: '10%',
    marginTop: '5%',
    marginBottom: '30%',
    color: 'black',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: '5%',
  },
  inputs: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingTop: 10,
    fontSize: 16,
    minHeight: 40,
  },
  button: {
    width: '80%',
    backgroundColor: 'black',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  buttonAlt: {
    width: '80%',
    borderWidth: 1,
    height: 40,
    borderRadius: 50,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonAltText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  message: {
    fontSize: 16,
    marginVertical: '5%',
  },
  agreementText: {
    textAlign: 'center',
    marginBottom: 20, // Added margin bottom
  },
  termsText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'flex-start', // Align text to the left
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalSubTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
});
var a = -1;
function user_auth(user_ID) {
  a = user_ID;
  return user_ID;
}
function Id() {
  return a;
}
export default AuthScreen;
export {Id};
