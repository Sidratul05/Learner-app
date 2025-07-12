/*
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBoxSvg from '../assets/icons/checkbox.svg';

type Lecture = {
  id: string;
  title: string;
  content: string;
  quiz: { question: string; options: string[]; answer: number }[];
};

type SubjectData = {
  id: string;
  name: string;
  lectures: Lecture[];
  completed: boolean;
};

export default function HomeScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const progressAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const fetchSubjectsAndLectures = async () => {
      try {
        const subjectsSnapshot = await firestore().collection('subjects').get();

        const subjectData: SubjectData[] = [];

        for (const doc of subjectsSnapshot.docs) {
          const subjectId = doc.id;
          const subjectName = doc.data().name;

          const lecturesSnapshot = await firestore()
            .collection('subjects')
            .doc(subjectId)
            .collection('lectures')
            .get();

          const lectures: Lecture[] = lecturesSnapshot.docs.map(lec => {
            const data = lec.data();
            return {
              id: lec.id,
              title: data.title || 'Untitled',
              content: data.content || '',
              quiz: data.quiz || [],
            };
          });

          const completed = lectures.every(
           lec => lec.content.trim() !== '' && lec.quiz.length > 0
          );

          subjectData.push({ id: subjectId, name: subjectName, lectures, completed });
        }

        setSubjects(subjectData);

        subjectData.forEach(subject => {
          const progressPercent = calculateSubjectProgress(subject);
          progressAnimations[subject.id] = new Animated.Value(0);
          Animated.timing(progressAnimations[subject.id], {
            toValue: progressPercent,
            duration: 800,
            useNativeDriver: false,
          }).start();
        });
      } catch (err) {
        console.error('Error loading subjects and lectures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndLectures();
  }, []);

  const calculateSubjectProgress = (subject: SubjectData) => {
    if (subject.lectures.length === 0) return 0;
    const completedCount = subject.lectures.filter(
      lec => lec.content.trim() !== '' && lec.quiz.length > 0
    ).length;
    return (completedCount / subject.lectures.length) * 100;
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(err => console.error('Sign out error:', err));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Learning Tracker" showSettings={true} onLogout={handleLogout} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Subjects Overview</Text>

        {subjects.map(subject => {
          const progressPercent = calculateSubjectProgress(subject);
          const progressAnim = progressAnimations[subject.id] || new Animated.Value(0);

          return (
            <TouchableOpacity
              key={subject.id}
              style={styles.subjectCard}
              activeOpacity={0.8}
            >
              <Text style={styles.subjectTitle}>{subject.name}</Text>

              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progressPercent.toFixed(0)}% Lectures Completed
              </Text>

              <Text
                style={{ color: subject.completed ? 'green' : 'red', marginBottom: 8 }}
              >
                {subject.completed ? 'Completed' : 'Incomplete'}
              </Text>

              <Text style={styles.lectureCount}>
                Lectures: {subject.lectures.length}
              </Text>

              <View style={{ marginTop: 10 }}>
                {subject.lectures.map(lecture => {
                  const lectureCompleted =
                    lecture.content.trim() !== '' && lecture.quiz.length > 0;

                  return (
                    <TouchableOpacity
                      key={lecture.id}
                      style={styles.lectureRow}
                      onPress={() => navigation.navigate('LectureDetail', { lecture })}
                    >
                      <View style={styles.checkboxContainer}>
                        <View style={styles.checkboxWrapper}>
                          {lectureCompleted ? (
                            <CheckBoxSvg width={18} height={18} />
                          ) : (
                            <View style={styles.emptyCircle} />
                          )}
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.lectureItem,
                          lectureCompleted && styles.completedLecture,
                        ]}
                        numberOfLines={1}
                      >
                        {lecture.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e6e6fa',
    minHeight: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#4caf50',
  },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  lectureCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  lectureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingVertical: 6,
    backgroundColor: '#fdd',
    marginBottom: 6,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'gray',
  },
  lectureItem: {
    fontSize: 16,
    color: '#380F17',
    flex: 1,
    paddingVertical: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  completedLecture: {
    color: 'green',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
*/
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBoxSvg from '../assets/icons/checkbox.svg';

type Lecture = {
  id: string;
  title: string;
  content: string;
  quiz: { question: string; options: string[]; answer: number }[];
};

type SubjectData = {
  id: string;
  name: string;
  lectures: Lecture[];
  completed: boolean;
};

export default function HomeScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const progressAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    const fetchSubjectsAndLectures = async () => {
      try {
        const subjectsSnapshot = await firestore().collection('subjects').get();
        const subjectData: SubjectData[] = [];

        for (const doc of subjectsSnapshot.docs) {
          const subjectId = doc.id;
          const subjectName = doc.data().name;

          const lecturesSnapshot = await firestore()
            .collection('subjects')
            .doc(subjectId)
            .collection('lectures')
            .get();

          const lectures: Lecture[] = lecturesSnapshot.docs.map(lec => {
            const data = lec.data();
            return {
              id: lec.id,
              title: data.title || 'Untitled',
              content: data.content || '',
              quiz: data.quiz || [],
            };
          });

          const completed = lectures.every(
            lec => lec.content.trim() !== '' && lec.quiz.length > 0
          );

          subjectData.push({ id: subjectId, name: subjectName, lectures, completed });
        }

        setSubjects(subjectData);

        subjectData.forEach(subject => {
          const progressPercent = calculateSubjectProgress(subject);
          progressAnimations[subject.id] = new Animated.Value(0);
          Animated.timing(progressAnimations[subject.id], {
            toValue: progressPercent,
            duration: 800,
            useNativeDriver: false,
          }).start();
        });
      } catch (err) {
        console.error('Error loading subjects and lectures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndLectures();
  }, []);

  const calculateSubjectProgress = (subject: SubjectData) => {
    if (subject.lectures.length === 0) return 0;
    const completedCount = subject.lectures.filter(
      lec => lec.content.trim() !== '' && lec.quiz.length > 0
    ).length;
    return (completedCount / subject.lectures.length) * 100;
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(err => console.error('Sign out error:', err));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Learning Tracker" showSettings={true} onLogout={handleLogout} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Subjects Overview</Text>

        {subjects.map(subject => {
          const progressPercent = calculateSubjectProgress(subject);
          const progressAnim = progressAnimations[subject.id] || new Animated.Value(0);

          return (
            <View key={subject.id} style={styles.subjectCard}>
              <Text style={styles.subjectTitle}>{subject.name}</Text>

              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progressPercent.toFixed(0)}% Lectures Completed
              </Text>

              <Text
                style={{ color: subject.completed ? 'green' : 'red', marginBottom: 8 }}
              >
                {subject.completed ? 'Completed' : 'Incomplete'}
              </Text>

              <Text style={styles.lectureCount}>
                Lectures: {subject.lectures.length}
              </Text>

              <View style={{ marginTop: 10 }}>
                {subject.lectures.map(lecture => {
                  const lectureCompleted =
                    lecture.content.trim() !== '' && lecture.quiz.length > 0;

                  return (
                    <View key={lecture.id} style={styles.lectureRow}>
                      <View style={styles.checkboxContainer}>
                        <View style={styles.checkboxWrapper}>
                          {lectureCompleted ? (
                            <CheckBoxSvg width={18} height={18} />
                          ) : (
                            <View style={styles.emptyCircle} />
                          )}
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.lectureItem,
                          lectureCompleted && styles.completedLecture,
                        ]}
                        numberOfLines={1}
                      >
                        {lecture.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e6e6fa',
    minHeight: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#4caf50',
  },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  lectureCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  lectureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingVertical: 6,
    backgroundColor: '#fdd',
    marginBottom: 6,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'gray',
  },
  lectureItem: {
    fontSize: 16,
    color: '#380F17',
    flex: 1,
    paddingVertical: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  completedLecture: {
    color: 'green',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
