
// src/screens/LectureDetail.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Lecture } from '../screens/navigation/types';
import Header from '../components/Header'; // ✅ Import Header

export default function LectureDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { lecture } = route.params as { lecture: Lecture };

  return (
    <View style={styles.container}>
      
      <Header title={lecture.title} showBack onBack={() => navigation.goBack()} />


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{lecture.title}</Text>
        <Text style={styles.content}>{lecture.content}</Text>

        {lecture.quiz && lecture.quiz.length > 0 && (
          <>
            <Text style={styles.quizHeader}>Quiz</Text>
            {lecture.quiz.map((q, index) => (
              <View key={index} style={styles.quizItem}>
                <Text style={styles.question}>{q.question}</Text>
                {q.options.map((opt, i) => (
                  <Text key={i} style={styles.option}>• {opt}</Text>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6fa', // ✅ Same as LecturesScreen
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#555',
  },
  quizHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  quizItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  option: {
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 2,
  },
});
