

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

import Navigator from './src/components/Navigator';
import AuthStackNavigator from './src/screens/navigation/AuthStackNavigator';


export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FDB095" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <Navigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
