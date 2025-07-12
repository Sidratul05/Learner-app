/*
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type HeaderProps = {
  title: string;
  icon?: string;          // optional emoji or icon text
  showBack?: boolean;     // show back arrow if true
  onBack?: () => void;    // callback when back arrow pressed
};

export default function Header({ title, icon, showBack, onBack }: HeaderProps) {
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>
        {icon && <Text>{icon} </Text>}  
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: '100%',
    backgroundColor:'#ba55d3',
    //backgroundColor: '#0C3B2E',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 35,    // vertically center roughly (height 90, marginTop 20 in title)
    padding: 8,
  },
  backArrow: {
    color: 'white',
    fontSize: 28,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
*/import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SettingsIcon from '../assets/icons/settings.svg'; // adjust path accordingly

type HeaderProps = {
  title: string;
  icon?: string;        // emoji or text icon
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  onLogout?: () => void;
};

export default function Header({
  title,
  icon,
  showBack,
  onBack,
  showSettings,
  onLogout,
}: HeaderProps) {
  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {icon && <Text>{icon} </Text>}
        {title}
      </Text>

      {showSettings && (
        <TouchableOpacity
          onPress={handleLogoutPress}
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <SettingsIcon width={24} height={24} fill="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: '100%',
    backgroundColor: '#ba55d3',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 35,
    padding: 8,
  },
  backArrow: {
    color: 'white',
    fontSize: 28,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  settingsButton: {
    position: 'absolute',
    right: 15,
    top: 35,
    padding: 8,
  },
});
