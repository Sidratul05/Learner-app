/*
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../screens/navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => Alert.alert('Registered Successfully!'))
      .catch(error => Alert.alert('Registration Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} color="#ba55d3" />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Already registered? Login"
          onPress={() => navigation.navigate('Login')}
          color="#ba55d3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#ffe4e1',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc',
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 10,
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#ba55d3', 
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
*/
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../screens/navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const isValidUsername = (username: string) =>
    /^[a-zA-Z0-9_]{3,15}$/.test(username); // 3–15 chars, letters/numbers/underscore

  const handleRegister = () => {
    if (!isValidUsername(username)) {
      Alert.alert(
        'Invalid Username',
        'Username must be 3–15 characters and can only include letters, numbers, and underscores.'
      );
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters and include one uppercase, one lowercase, and one number.'
      );
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => Alert.alert('Registered Successfully!'))
      .catch(error =>
        Alert.alert('Registration Error', error.message)
      );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} color="#ba55d3" />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Already registered? Login"
          onPress={() => navigation.navigate('Login')}
          color="#ba55d3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe4e1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ba55d3',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
