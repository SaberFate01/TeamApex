import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../userContext';

const DATABASE_URL = 'https://flask-dot-acoustic-cirrus-396009.ts.r.appspot.com/database';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useContext(UserContext);

  const onChangeHandler = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const EmailCheck= (mail)=>{
   var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if(mail.match(mailformat)){
      return false;}
   return true;}


  const check = (query)=>{
    if (query.includes("=") || query.includes("#") || query.includes("/*") || query.includes("*/") || query.includes("union") || query.includes("--")){
        console.log(query);
        return true;}
    return false;
  }

  const onSubmitHandler = async () => {
    try {
      const query = isLogin
        ? `SELECT * FROM userprofiles WHERE email='${email}' AND password='${password}'`
        : `INSERT INTO userprofiles (email, username, password, date_of_birth) VALUES ('${email}', '${name}', '${password}', '${dateOfBirth}')`;
      if (!isLogin){
        if (check(email) || check(password) || EmailCheck(email)){
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
      if(isLogin){
        user_auth(result[0].userid);
        console.log(Id());}
        else{
        const query_login =`SELECT * FROM userprofiles WHERE email='${email}' AND password='${password}'`;

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
         console.log(Id())
        }
/////////////////////////////////////////////////////////////////////////////////
      if (isLogin) {
        if (result && result.length > 0 && result[0].email === email) { // Adjust this based on actual server response
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
        if (response.status === 200) { // Adjust this based on actual server response
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
        <ImageBackground source={require('../assets/gradient-back.jpeg')} style={styles.image}>
            <View style={styles.card}>
                <Text style={styles.heading}>{isLogin ? 'Login' : 'Signup'}</Text>
                <View style={styles.form}>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail}></TextInput>
                        {!isLogin && <TextInput style={styles.input} placeholder="Name" onChangeText={setName}></TextInput>}
                        {!isLogin && <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" onChangeText={setDateOfBirth}></TextInput>}
                        <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword}></TextInput>
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                        <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
                            <Text style={styles.buttonAltText}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
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
        fontWeight: '400'
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
});
var a = -1;
function user_auth(user_ID) {
    a= user_ID;
    return user_ID;
}
function Id() {
    return a;
}
export default AuthScreen;
export {Id};
