import React, { useContext }  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../userContext';

const Profile = () => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle}></View>
        <Text style={styles.name}>{user.username}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adviceSection}>
        <Text>Well-Being Advice</Text>
        <Text numberOfLines={5}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus...
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
});

export default Profile;