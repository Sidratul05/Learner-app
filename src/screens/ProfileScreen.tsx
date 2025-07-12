
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/navigation/types';
import firestore from '@react-native-firebase/firestore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectLectures, setSubjectLectures] = useState<{
    [subjectId: string]: {
      options: { label: string; value: string }[];
      selected: string | null;
    };
  }>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await firestore().collection('subjects').get();
        const options: { label: string; value: string }[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          options.push({ label: data.name, value: doc.id });
        });
        setSubjectOptions(options);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectSelect = async (value: string | null) => {
    if (!value || selectedSubjects.some(sub => sub.id === value)) return;

    const selectedOption = subjectOptions.find(option => option.value === value);
    if (!selectedOption) return;

    setSelectedSubjects(prev => [...prev, { id: value, name: selectedOption.label }]);

    try {
      const lectureSnapshot = await firestore()
        .collection('subjects')
        .doc(value)
        .collection('lectures')
        .get();

      const lectures: { label: string; value: string }[] = [];
      lectureSnapshot.forEach(doc => {
        const data = doc.data();
        lectures.push({ label: data.title, value: doc.id });
      });

      setSubjectLectures(prev => ({
        ...prev,
        [value]: { options: lectures, selected: null },
      }));
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleLectureSelect = (subjectId: string, lectureId: string | null) => {
    setSubjectLectures(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        selected: lectureId,
      },
    }));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Learning Tracker" />

      <View style={styles.content}>
        <Text style={styles.title}>Select a Subject:</Text>
        <RNPickerSelect
          onValueChange={handleSubjectSelect}
          items={subjectOptions}
          placeholder={{ label: 'Choose a subject...', value: null }}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>Subjects & Lectures</Text>
        <ScrollView>
          {selectedSubjects.map((subject, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.subjectName}>{subject.name}</Text>

              {subjectLectures[subject.id]?.options?.length ? (
                <>
                  <RNPickerSelect
                    onValueChange={(value) => handleLectureSelect(subject.id, value)}
                    items={subjectLectures[subject.id].options}
                    placeholder={{ label: 'Select a lecture...', value: null }}
                    style={pickerSelectStyles}
                    value={subjectLectures[subject.id].selected}
                  />

                  {subjectLectures[subject.id].selected && (
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate('LecturesScreen', {
                          subject: subject.id,
                          lectureId: subjectLectures[subject.id].selected,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View Lecture</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.noLectureText}>No lectures available</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#191970',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: '600',
    color: '#191970',
  },
  card: {
    backgroundColor: '#f8f0fc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
  },
  viewButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#d1f7c4',
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 16,
    color: '#2f4f4f',
    fontWeight: '600',
  },
  noLectureText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    color: 'purple',
    backgroundColor: '#e0ffff',
    paddingRight: 30,
    marginBottom: 10,
  },
});
/*
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/navigation/types';
import firestore from '@react-native-firebase/firestore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<{ id: string; name: string }[]>([]);
  const [subjectLectures, setSubjectLectures] = useState<{
    [subjectId: string]: {
      options: { label: string; value: string }[];
      selected: string | null;
    };
  }>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await firestore().collection('subjects').get();
        const options: { label: string; value: string }[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          options.push({ label: data.name, value: doc.id });
        });
        setSubjectOptions(options);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectSelect = async (value: string | null) => {
    if (!value || selectedSubjects.some(sub => sub.id === value)) return;

    const selectedOption = subjectOptions.find(option => option.value === value);
    if (!selectedOption) return;

    setSelectedSubjects(prev => [...prev, { id: value, name: selectedOption.label }]);

    try {
      const lectureSnapshot = await firestore()
        .collection('subjects')
        .doc(value)
        .collection('lectures')
        .get();

      const lectures: { label: string; value: string }[] = [];
      lectureSnapshot.forEach(doc => {
        const data = doc.data();
        lectures.push({ label: data.title, value: doc.id });
      });

      setSubjectLectures(prev => ({
        ...prev,
        [value]: { options: lectures, selected: null },
      }));
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleLectureSelect = (subjectId: string, lectureId: string | null) => {
    setSubjectLectures(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        selected: lectureId,
      },
    }));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Learning Tracker" />

      <View style={styles.content}>
        <Text style={styles.title}>Select a Subject:</Text>
        <RNPickerSelect
          onValueChange={handleSubjectSelect}
          items={subjectOptions}
          placeholder={{ label: 'Choose a subject...', value: null }}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>Subjects & Lectures</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedSubjects.map((subject, index) => (
            <View key={index} style={styles.cardHorizontalSmall}>
              <Text style={styles.subjectName}>{subject.name}</Text>

              {subjectLectures[subject.id]?.options?.length ? (
                <>
                  <RNPickerSelect
                    onValueChange={(value) => handleLectureSelect(subject.id, value)}
                    items={subjectLectures[subject.id].options}
                    placeholder={{ label: 'Select a lecture...', value: null }}
                    style={pickerSelectStyles}
                    value={subjectLectures[subject.id].selected}
                  />

                  {subjectLectures[subject.id].selected && (
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate('LecturesScreen', {
                          subject: subject.id,
                          lectureId: subjectLectures[subject.id].selected,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View Lecture</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.noLectureText}>No lectures available</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#191970',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 15,
    fontWeight: '600',
    color: '#191970',
  },
  cardHorizontalSmall: {
    backgroundColor: '#f8f0fc',
    padding: 12,
    borderRadius: 10,
    marginRight: 12,
    width: 200,
    height:350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 8,
  },
  viewButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#d1f7c4',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#2f4f4f',
    fontWeight: '600',
  },
  noLectureText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 5,
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    color: 'purple',
    backgroundColor: '#e0ffff',
    paddingRight: 30,
    marginBottom: 8,
  },
});
*/