import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from '../screens/navigation/HomeStackNavigator';
import ProfileStackNavigator from '../screens/navigation/ProfileStackNavigator';

// ✅ SVG imports (after configuring SVG transformer)
import HomeIcon from '../assets/icons/home.svg';
import ProfileIcon from '../assets/icons/user.svg';

const Tab = createBottomTabNavigator();

export default function Navigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ba55d3',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          position: 'absolute',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <HomeIcon width={size} height={size} fill={color} />;
          } else if (route.name === 'Subjects') {
            return <ProfileIcon width={size} height={size} fill={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#fff0f5',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Subjects" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

