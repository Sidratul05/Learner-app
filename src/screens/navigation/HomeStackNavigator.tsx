/*
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../HomeScreen';
import LecturesScreen from '../LectureScreen';
import LectureDetail from '../LectureDetail'; // ✅ Add this


const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Lectures" component={LecturesScreen} options={{ title: 'Lectures' }} />

      }
      <Stack.Screen
  name="LectureDetail"
  component={LectureDetail}
  options={{ headerShown: false }} // 👈 Add this line
/>

    </Stack.Navigator>
  );
}
*/
// src/navigation/HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../HomeScreen';
import LecturesScreen from '../LectureScreen';
import LectureDetail from '../LectureDetail';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Lectures"
        component={LecturesScreen}
        options={{ title: 'Lectures' }}
      />
      <Stack.Screen
        name="LectureDetail"
        component={LectureDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
