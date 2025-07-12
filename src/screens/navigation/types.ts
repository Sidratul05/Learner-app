

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Quiz and Lecture types

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type QuizItem = {
  question: string;
  options: string[];
  answer: number; // index of correct option
};

export type Lecture = {
  id: string;
  title: string;
  content: string;
  quiz: QuizItem[]; // ensure quiz is always an array
};

// Root stack navigation param list
/*
export type RootStackParamList = {
  MainTabs: undefined;
  ProfileScreen: undefined;
  LecturesScreen: {
    subject: string;
    lectureId?: string | null; // ✅ added to fix error
  };
  LectureDetail: {
    lecture: Lecture;
  };
};
*/
export type RootStackParamList = {
  MainTabs: undefined;
  ProfileScreen: undefined;
  LecturesScreen: {
    subject: string;
    lectureId?: string | null;
  };
  LectureDetail: {
    lecture: Lecture;
    showQuiz: boolean;  // <-- add this param here
  };
};
