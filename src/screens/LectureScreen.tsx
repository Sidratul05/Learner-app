
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

type QuizItem = {
  question: string;
  options: string[];
  answer: number;
};

type Lecture = {
  id: string;
  title: string;
  content: string;
  quiz: QuizItem[];
};

export default function LectureDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as { subject: string; lectureId: string };
  const { subject, lectureId } = params;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const doc = await firestore()
          .collection('subjects')
          .doc(subject)
          .collection('lectures')
          .doc(lectureId)
          .get();

        if (!doc.exists) {
          setError('Lecture not found');
          setLecture(null);
        } else {
          const data = doc.data();
          setLecture({
            id: doc.id,
            title: data?.title || 'Untitled',
            content: data?.content || '',
            quiz: data?.quiz || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load lecture');
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [subject, lectureId]);

  const handleAnswer = (questionIndex: number, selectedOptionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOptionIndex,
    }));
  };

  const getOptionStyle = (
    questionIndex: number,
    optionIndex: number,
    correctAnswerIndex: number
  ) => {
    const selected = selectedAnswers[questionIndex];

    if (selected === undefined) return styles.option;

    if (optionIndex === selected && optionIndex === correctAnswerIndex) {
      return [styles.option, styles.correctOption];
    } else if (optionIndex === selected && optionIndex !== correctAnswerIndex) {
      return [styles.option, styles.incorrectOption];
    } else {
      return styles.option;
    }
  };

  const calculateScore = () => {
    if (!lecture) return 0;
    let score = 0;
    lecture.quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) score++;
    });
    return score;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!lecture) {
    return (
      <View style={styles.centered}>
        <Text>No lecture data available.</Text>
      </View>
    );
  }

  const totalQuestions = lecture.quiz.length;
  const score = calculateScore();

  return (
    <View style={{ flex: 1, backgroundColor: '#e6e6fa' }}>
      <Header title={lecture.title} showBack onBack={() => navigation.goBack()} />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.lectureContent}>{lecture.content}</Text>

          {totalQuestions > 0 && (
            <>
              <View style={styles.quizContainer}>
                <Text style={styles.quizHeader}>Quiz</Text>
                {lecture.quiz.map((q, qIndex) => (
                  <View key={qIndex} style={styles.quizItem}>
                    <Text style={styles.question}>{q.question}</Text>
                    {q.options.map((opt, oIndex) => (
                      <TouchableOpacity
                        key={oIndex}
                        onPress={() => handleAnswer(qIndex, oIndex)}
                        disabled={selectedAnswers[qIndex] !== undefined}
                      >
                        <Text style={getOptionStyle(qIndex, oIndex, q.answer)}>
                          • {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {showCorrectAnswers && (
                      <Text style={styles.correctAnswer}>
                        Correct answer: {q.options[q.answer]}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.scoreText}>
                Score: {score} / {totalQuestions}
              </Text>

              <TouchableOpacity
                style={styles.showCorrectButton}
                onPress={() => setShowCorrectAnswers(!showCorrectAnswers)}
              >
                <Text style={styles.showCorrectButtonText}>
                  {showCorrectAnswers ? 'Hide Correct Answers' : 'Show Correct Answers'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // Add more space above tab bar
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lectureContent: {
    fontSize: 16,
    marginBottom: 12,
  },
  quizContainer: {
    marginTop: 8,
  },
  quizHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  quizItem: {
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  option: {
    fontSize: 15,
    paddingVertical: 4,
    paddingLeft: 12,
    color: '#333',
  },
  correctOption: {
    color: 'green',
    fontWeight: '700',
  },
  incorrectOption: {
    color: 'red',
    fontWeight: '700',
  },
  correctAnswer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'green',
    marginTop: 4,
    paddingLeft: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#555',
  },
  showCorrectButton: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
  },
  showCorrectButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
