// src/types/quizTypes.ts

export type Choice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

type QuizTitles = {
  [key: string]: string;
};

const quizTitles: QuizTitles = {
  quiz1: 'NTU Trivia',
  quiz2: 'Math Quiz',
  quiz3: 'Science Quiz',
};
